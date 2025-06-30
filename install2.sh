#!/bin/bash
# /opt/prolter/install.sh

set -e
export PATH=$PATH:/usr/bin

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
DB_USER="prolter_user"
DB_NAME="prolter_app"
DB_PASS=$(openssl rand -base64 16)
ADMIN_PASS=$(openssl rand -base64 12)

echo -e "${GREEN}"
echo "============================================"
echo " 🚀  Starting Prolter Installer"
echo "============================================"
echo -e "${NC}"

# Function for error handling
handle_error() {
    echo -e "${RED}❌ Error on line $1: Command '$2' failed${NC}"
    exit 1
}

# Set up error trapping
trap 'handle_error $LINENO "$BASH_COMMAND"' ERR

#########################################
# Step 1: Update System
#########################################
echo -e "🛠️  Step 1/10: Updating system..."
sudo apt update -qq && sudo apt upgrade -y -qq
echo -e "🛠️  Step 1/11: Updating system... ✅ Done"

#########################################
# Step 2: Install Dependencies
#########################################
echo -e "📦 Step 2/10: Installing dependencies..."
sudo apt install -y -qq curl git build-essential nginx \
  postgresql postgresql-contrib freeradius freeradius-postgresql \
  ufw fail2ban nodejs npm gnupg strongswan strongswan-pki
echo -e "📦 Step 2/11: Installing dependencies... ✅ Done"

# Verify Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo -e "${YELLOW}⚠️  Warning: Node.js version is older than recommended (14+)${NC}"
fi

#########################################
# Step 3: Setup PostgreSQL
#########################################
echo -e "🐘 Step 3/10: Configuring PostgreSQL..."

# Wait for PostgreSQL to be ready
sleep 2

# Create user and database with proper error handling
if sudo -u postgres psql -t -c '\du' | cut -d \| -f 1 | grep -qw "$DB_USER"; then
    echo "Database user exists, updating password..."
    sudo -u postgres psql -c "ALTER USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';"
else
    echo "Creating database user..."
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';"
fi

if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo "Database exists, skipping creation..."
else
    echo "Creating database..."
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
fi

# Configure authentication with improved version detection
PG_VERSION=$(sudo -u postgres psql -t -c "SHOW server_version;" | grep -oE '[0-9]+\.[0-9]+' | head -1)
if [ -z "$PG_VERSION" ]; then
    # Fallback method
    PG_VERSION=$(ls /etc/postgresql/ | head -1)
fi

PG_HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"

if [ -f "$PG_HBA" ]; then
    # Add host authentication if not exists
    if ! grep -q "host $DB_NAME $DB_USER" "$PG_HBA"; then
        echo "host $DB_NAME $DB_USER 127.0.0.1/32 md5" | sudo tee -a "$PG_HBA" > /dev/null
        echo "Added database authentication rule"
    fi
    sudo systemctl restart postgresql
    
    # Verify PostgreSQL is running
    if ! sudo systemctl is-active --quiet postgresql; then
        echo -e "${RED}❌ PostgreSQL failed to start${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Warning: Could not find pg_hba.conf at expected location: $PG_HBA${NC}"
fi

echo -e "🐘 PostgreSQL configured ✅"

#########################################
# Step 4: Create prolteradmin User
#########################################
echo -e "👤 Step 4/10: Creating user 'prolteradmin'..."
if id "prolteradmin" &>/dev/null; then
    echo "User exists. Updating password..."
    echo "prolteradmin:$ADMIN_PASS" | sudo chpasswd
else
    sudo useradd -m -s /bin/bash prolteradmin
    echo "prolteradmin:$ADMIN_PASS" | sudo chpasswd
    sudo usermod -aG sudo prolteradmin
    echo "prolteradmin ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/prolteradmin > /dev/null
    sudo chmod 440 /etc/sudoers.d/prolteradmin
fi

echo -e "🛠️ Setting up GPG directory for prolteradmin..."

# Ensure home directory exists and is correct
sudo mkdir -p /etc/prolter/vpn
sudo mkdir -p /home/prolteradmin/.gnupg
sudo chown -R prolteradmin:prolteradmin /home/prolteradmin/.gnupg
sudo chmod 700 /home/prolteradmin/.gnupg

echo -e "🔐 GPG directory configured ✅"

# Store admin credentials securely
echo "$ADMIN_PASS" | sudo tee /opt/prolter_admin_pass > /dev/null
sudo chmod 600 /opt/prolter_admin_pass
sudo chown root:root /opt/prolter_admin_pass

echo -e "👤 User created ✅"
echo -e "${YELLOW}📝 Admin password saved to: /opt/prolter_admin_pass${NC}"

#########################################
# Step 5: Clone Git Repository
#########################################
echo -e "🔗 Step 5/10: Cloning Git repository..."
if [ -d "/opt/Prolter" ]; then
  echo "Repo exists. Updating..."
  cd /opt/Prolter && git pull origin main || git pull origin master || echo "Failed to update repo"
else
  if ! git clone https://github.com/kcbsilva/Prolter.git /opt/Prolter; then
    echo -e "${RED}❌ Failed to clone repository${NC}"
    exit 1
  fi
fi
echo -e "🔗 Git repository ready ✅"

# Create necessary directories
sudo mkdir -p /opt/Prolter/db
sudo mkdir -p /opt/Prolter/scripts

# Create creds.ts file
cat <<EOF | sudo tee /opt/Prolter/db/creds.ts > /dev/null
// /opt/Prolter/db/creds.ts
export const dbUser = '${DB_USER}';
export const dbPassword = '${DB_PASS}';
export const dbName = '${DB_NAME}';
EOF

sudo chown prolteradmin:prolteradmin /opt/Prolter/db/creds.ts
sudo chmod 600 /opt/Prolter/db/creds.ts
echo -e "📄 creds.ts file created ✅"

# Encrypt creds.ts to creds.ts.gpg
if command -v gpg >/dev/null 2>&1; then
    gpg --batch --symmetric --cipher-algo AES256 --passphrase "$DB_PASS" \
      -o /opt/Prolter/db/creds.ts.gpg /opt/Prolter/db/creds.ts

    sudo chown prolteradmin:prolteradmin /opt/Prolter/db/creds.ts.gpg
    sudo chmod 600 /opt/Prolter/db/creds.ts.gpg
    echo -e "🔒 creds.ts encrypted to creds.ts.gpg ✅"
else
    echo -e "${YELLOW}⚠️  Warning: GPG not available, skipping encryption${NC}"
fi

# Create .gpgpass file with GPG passphrase
echo "$DB_PASS" | sudo tee /opt/Prolter/.gpgpass > /dev/null
sudo chown prolteradmin:prolteradmin /opt/Prolter/.gpgpass
sudo chmod 600 /opt/Prolter/.gpgpass
echo -e "🔐 .gpgpass file created ✅"

#########################################
# Step 6: Change ownership to prolteradmin
#########################################
echo -e "📁 Step 6/10: Changing file ownership..."
sudo chown -R prolteradmin:prolteradmin /opt/Prolter
echo -e "📁 Ownership updated ✅"

#########################################
# Step 7: Setup Firewall and Fail2Ban
#########################################
echo -e "🌐 Step 7/10: Configuring firewall..."
sudo ufw --force reset > /dev/null 2>&1
sudo ufw allow 22/tcp > /dev/null        # SSH
sudo ufw allow 80/tcp > /dev/null         # HTTP
sudo ufw allow 443/tcp > /dev/null        # HTTPS
sudo ufw allow 1812/udp > /dev/null       # RADIUS Authentication
sudo ufw allow 1813/udp > /dev/null       # RADIUS Accounting
sudo ufw allow 500/udp > /dev/null        # IPsec IKE
sudo ufw allow 4500/udp > /dev/null       # IPsec NAT-T
sudo ufw --force enable > /dev/null
sudo ufw logging on > /dev/null 2>&1
echo -e "🌐 Firewall configured ✅"

echo -e "🔐 Configuring Fail2Ban..."
cat <<EOF | sudo tee /etc/fail2ban/jail.local > /dev/null
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = 22
logpath = %(sshd_log)s
maxretry = 5
bantime = 1h
findtime = 10m

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 1h
EOF

#sudo systemctl restart fail2ban
sudo systemctl enable fail2ban

# Verify Fail2Ban is running
if sudo systemctl is-active --quiet fail2ban; then
    echo -e "🔐 Fail2Ban setup ✅"
else
    echo -e "${YELLOW}⚠️  Warning: Fail2Ban may not be running properly${NC}"
fi

#########################################
# Step 8: Setup Prolter App
#########################################
echo -e "🔧 Step 8/10: Setting up Prolter app..."
cd /opt/Prolter

# Install dependencies as prolteradmin
sudo -u prolteradmin npm install --silent

# Build the application with error handling
if ! sudo -u prolteradmin NODE_OPTIONS="--max-old-space-size=4096" npm run build; then
    echo -e "${YELLOW}⚠️  Build failed, trying without NODE_OPTIONS...${NC}"
    sudo -u prolteradmin npm run build
fi

# Import schema if available
if [ -f "/opt/Prolter/schema.sql" ]; then
    echo -e "📄 Importing PostgreSQL schema from /opt/Prolter/schema.sql..."
    PGPASSWORD=$DB_PASS psql -U $DB_USER -d $DB_NAME -h localhost -f /opt/Prolter/schema.sql && \
    echo -e "📄 Schema imported ✅" || \
    { echo -e "${RED}❌ Failed to import schema${NC}"; exit 1; }
else
    echo -e "${YELLOW}⚠️  schema.sql not found at /opt/Prolter/schema.sql — skipping import${NC}"
fi

# Create .env.local
sudo bash -c "cat > /opt/Prolter/.env.local" <<EOF
NODE_ENV=production
PORT=3000
PGHOST=localhost
PGPORT=5432
PGUSER=$DB_USER
PGPASSWORD=$DB_PASS
PGDATABASE=$DB_NAME
EOF

sudo chown prolteradmin:prolteradmin /opt/Prolter/.env.local
sudo chmod 600 /opt/Prolter/.env.local
echo -e "📄 .env.local created ✅"

# Create systemd service
sudo tee /etc/systemd/system/prolter.service > /dev/null <<EOF
[Unit]
Description=Prolter App
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=prolteradmin
Group=prolteradmin
WorkingDirectory=/opt/Prolter
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
Environment=GNUPGHOME=/opt/Prolter/.gnupg
Environment=PORT=3000
StandardOutput=journal
StandardError=journal
SyslogIdentifier=prolter

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/Prolter

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable prolter

# Start service and verify
sudo systemctl start prolter
sleep 5

if sudo systemctl is-active --quiet prolter; then
    echo -e "🔧 Prolter app setup ✅"
else
    echo -e "${RED}❌ Prolter service failed to start${NC}"
    echo "Checking service status..."
    sudo systemctl status prolter --no-pager
    exit 1
fi

#########################################
# Step 9: Configure NGINX
#########################################
echo -e "🌐 Step 9/10: Configuring NGINX..."

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# First, add rate limiting to the main nginx.conf
if ! grep -q "limit_req_zone" /etc/nginx/nginx.conf; then
    # Add rate limiting configuration to http block
    sudo sed -i '/http {/a\\t# Rate limiting configuration\n\tlimit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;\n\tlimit_req_status 429;' /etc/nginx/nginx.conf
    echo -e "📝 Added rate limiting to nginx.conf ✅"
fi

# Create Prolter NGINX configuration
NGINX_CONF="/etc/nginx/sites-available/prolter"
sudo tee "$NGINX_CONF" > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        # Apply rate limiting
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/prolter

# Test NGINX configuration
if sudo nginx -t; then
    sudo systemctl reload nginx
    echo -e "🌐 NGINX configured ✅"
else
    echo -e "${RED}❌ NGINX configuration test failed${NC}"
    exit 1
fi

# Verify NGINX is running
if ! sudo systemctl is-active --quiet nginx; then
    echo -e "${RED}❌ NGINX is not running${NC}"
    sudo systemctl start nginx
fi

#########################################
# Step 10: Add Credential Recovery Script
#########################################
echo -e "🛟 Step 10/10: Creating recovery utilities..."

cat <<'EOF' | sudo tee /opt/Prolter/scripts/recover-creds.sh > /dev/null
#!/bin/bash
# /opt/Prolter/scripts/recover-creds.sh

set -e
export PATH=$PATH:/usr/bin

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔐 Prolter Credentials Recovery Utility${NC}"
echo

# Check if files exist
if [ ! -f /opt/Prolter/db/creds.ts.gpg ]; then
  echo -e "${RED}❌ Encrypted file not found at /opt/Prolter/db/creds.ts.gpg${NC}"
  exit 1
fi

if [ ! -f /opt/Prolter/.gpgpass ]; then
  echo -e "${YELLOW}⚠️  GPG passphrase file not found, manual entry required${NC}"
  read -s -p "Enter passphrase: " PASSPHRASE
  echo
else
  PASSPHRASE=$(cat /opt/Prolter/.gpgpass)
  echo -e "${GREEN}📁 Using stored passphrase${NC}"
fi

echo -e "🔄 Decrypting credentials..."
if gpg --quiet --batch --yes --decrypt --passphrase "$PASSPHRASE" \
  /opt/Prolter/db/creds.ts.gpg > /opt/Prolter/db/creds.ts 2>/dev/null; then
  
  chmod 600 /opt/Prolter/db/creds.ts
  chown prolteradmin:prolteradmin /opt/Prolter/db/creds.ts
  echo -e "${GREEN}✅ creds.ts successfully restored at /opt/Prolter/db/creds.ts${NC}"
else
  echo -e "${RED}❌ Failed to decrypt. Incorrect passphrase or corrupted file.${NC}"
  rm -f /opt/Prolter/db/creds.ts
  exit 1
fi
EOF

# Create system status script
cat <<'EOF' | sudo tee /opt/Prolter/scripts/status.sh > /dev/null
#!/bin/bash
# /opt/Prolter/scripts/status.sh

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔍 Prolter System Status${NC}"
echo "=================================="

# Check services
services=("postgresql" "nginx" "prolter" "fail2ban")
for service in "${services[@]}"; do
    if systemctl is-active --quiet "$service"; then
        echo -e "✅ $service: ${GREEN}Running${NC}"
    else
        echo -e "❌ $service: ${RED}Not Running${NC}"
    fi
done

echo
echo "🌐 Network Status:"
echo "=================================="
ss -tlnp | grep -E ':80|:443|:3000|:5432' | while read line; do
    echo "$line"
done

echo
echo "📊 Resource Usage:"
echo "=================================="
echo "Memory: $(free -h | awk 'NR==2{printf "%.1f%%", $3*100/$2 }')"
echo "Disk: $(df -h / | awk 'NR==2{print $5}')"
echo "Load: $(uptime | awk -F'load average:' '{print $2}')"

echo
echo "📝 Recent Logs:"
echo "=================================="
echo "Last 5 Prolter log entries:"
journalctl -u prolter -n 5 --no-pager -q
EOF

# Set permissions for scripts
sudo chmod +x /opt/Prolter/scripts/recover-creds.sh
sudo chmod +x /opt/Prolter/scripts/status.sh
sudo chown prolteradmin:prolteradmin /opt/Prolter/scripts/recover-creds.sh
sudo chown prolteradmin:prolteradmin /opt/Prolter/scripts/status.sh

echo -e "🛟 Recovery and status scripts created ✅"

#########################################
# Create Installation Summary
#########################################
cat <<EOF | sudo tee /opt/Prolter/INSTALLATION_SUMMARY.txt > /dev/null
PROLTER INSTALLATION SUMMARY
============================
Installation Date: $(date)
Server IP: $(hostname -I | awk '{print $1}')

CREDENTIALS:
- Database User: $DB_USER
- Database Name: $DB_NAME  
- Database Password: Stored in /opt/Prolter/.gpgpass
- Admin User: prolteradmin
- Admin Password: Stored in /opt/prolter_admin_pass

FILES LOCATIONS:
- Application: /opt/Prolter
- Credentials: /opt/Prolter/db/creds.ts
- Encrypted Backup: /opt/Prolter/db/creds.ts.gpg
- Environment: /opt/Prolter/.env.local
- Recovery Script: /opt/Prolter/scripts/recover-creds.sh
- Status Script: /opt/Prolter/scripts/status.sh

SERVICES:
- Prolter App: systemctl status prolter
- PostgreSQL: systemctl status postgresql  
- NGINX: systemctl status nginx
- Fail2Ban: systemctl status fail2ban

USEFUL COMMANDS:
- Check system status: /opt/Prolter/scripts/status.sh
- Recover credentials: /opt/Prolter/scripts/recover-creds.sh
- Check Prolter logs: journalctl -u prolter -f
- Restart Prolter: systemctl restart prolter

SECURITY NOTES:
- Firewall configured with UFW
- Fail2Ban protecting SSH and HTTP
- Database credentials encrypted
- Admin password securely generated
EOF

sudo chown prolteradmin:prolteradmin /opt/Prolter/INSTALLATION_SUMMARY.txt
sudo chmod 600 /opt/Prolter/INSTALLATION_SUMMARY.txt

#########################################
# Final Verification and Message
#########################################
echo -e "${GREEN}"
echo "============================================"
echo " 🎉 Installation Complete!"
echo "============================================"
echo -e "${NC}"

echo -e "${YELLOW}📋 Installation Summary:${NC}"
echo "• Prolter app running on http://$(hostname -I | awk '{print $1}')"
echo "• Admin user: prolteradmin"
echo "• Admin password: stored in /opt/prolter_admin_pass"
echo "• Database credentials: /opt/Prolter/db/creds.ts"
echo "• Installation summary: /opt/Prolter/INSTALLATION_SUMMARY.txt"
echo ""
echo -e "${YELLOW}🔧 Useful commands:${NC}"
echo "• Check status: /opt/Prolter/scripts/status.sh"
echo "• View logs: journalctl -u prolter -f"
echo "• Restart app: systemctl restart prolter"
echo ""

# Final service verification
echo -e "${GREEN}🔍 Final Service Check:${NC}"
for service in postgresql nginx prolter fail2ban; do
    if systemctl is-active --quiet "$service"; then
        echo -e "✅ $service: Running"
    else
        echo -e "❌ $service: Not Running"
    fi
done

echo ""
echo -e "${GREEN}🚀 System will reboot in 10 seconds...${NC}"
echo "Press Ctrl+C to cancel reboot"

sleep 10
sudo reboot