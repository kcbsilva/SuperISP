# /install-cloud.sh
#!/bin/bash

set -e

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

IP=$(hostname -I | awk '{print $1}')

echo -e "${GREEN}"
echo "============================================"
echo " 🚀  Starting Prolter Cloud Installer"
echo "============================================"
echo -e "${NC}"

####################################
# Step 1: Update System
####################################
echo -e "🛠️  Step 1/10: Updating system..."
sudo apt update -qq && sudo apt upgrade -y -qq
echo -e "🛠️  Step 1/10: Updating system... ✅ Done"

####################################
# Step 2: Install Dependencies
####################################
echo -e "📦 Step 2/10: Installing dependencies..."
sudo apt install -y -qq curl git nginx ufw fail2ban postgresql postgresql-contrib build-essential \
  freeradius freeradius-postgresql software-properties-common

curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
echo -e "📦 Step 2/10: Installing dependencies... ✅ Done"

####################################
# Step 3: Setup PostgreSQL
####################################
echo -e "🐘 Step 3/10: Configuring PostgreSQL..."
sudo -u postgres psql <<EOF
CREATE USER prolter WITH PASSWORD 'securepass123';
CREATE DATABASE prolterdb OWNER prolter;
GRANT ALL PRIVILEGES ON DATABASE prolterdb TO prolter;
EOF
echo -e "🐘 Step 3/10: PostgreSQL configured ✅ Done"

####################################
# Step 4: Clone Git Repository
####################################
echo -e "🔗 Step 4/10: Cloning Git repository..."
if [ -d "/opt/SuperISP" ]; then
    echo "Repository already exists, skipping clone..."
else
    sudo git clone https://github.com/kcbsilva/SuperISP.git /opt/SuperISP
fi
echo -e "🔗 Step 4/10: Cloning Git repository... ✅ Done"

####################################
# Step 5: Create System User for App
####################################
echo -e "👤 Step 5/10: Creating system user 'prolterapp'..."

# Create group
if ! getent group prolterapp > /dev/null; then
    sudo groupadd --system prolterapp
fi

# Create user with home directory
if ! id "prolterapp" &>/dev/null; then
    sudo useradd -m -d /home/prolterapp -s /usr/sbin/nologin -g prolterapp prolterapp
fi

# Set ownership
sudo chown -R prolterapp:prolterapp /opt/SuperISP
sudo mkdir -p /home/prolterapp
sudo chown -R prolterapp:prolterapp /home/prolterapp

echo -e "👤 Step 5/10: User 'prolterapp' created and home assigned ✅ Done"

####################################
# Step 6: Setup NGINX (HTTP Only)
####################################
echo -e "🌐 Step 6/10: Configuring NGINX for public IP access..."
sudo tee /etc/nginx/sites-available/prolter > /dev/null <<EOF
server {
    listen 80;
    server_name $IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/prolter /etc/nginx/sites-enabled/prolter
sudo nginx -t && sudo systemctl reload nginx
echo -e "🌐 Step 6/10: NGINX configured ✅ Done"

####################################
# Step 7: Setup Firewall + Fail2Ban
####################################
echo -e "🧱 Step 7/10: Configuring firewall & Fail2Ban..."
sudo ufw --force reset > /dev/null
sudo ufw allow OpenSSH > /dev/null
sudo ufw allow "Nginx Full" > /dev/null
sudo ufw allow 1812/udp > /dev/null
sudo ufw allow 1813/udp > /dev/null
sudo ufw allow 1723/tcp > /dev/null
sudo ufw --force enable > /dev/null

sudo tee /etc/fail2ban/jail.local > /dev/null <<EOL
[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
maxretry = 5
bantime = 1h
findtime = 10m
EOL

sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
echo -e "🧱 Step 7/10: Firewall & Fail2Ban active ✅ Done"

####################################
# Step 8: Enable Swap & Build App
####################################
echo -e "🧠 Step 8/10: Adding 2GB swap to avoid build issues..."
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab > /dev/null
echo -e "🧠 Swap enabled ✅"

echo -e "⚙️  Building Prolter app..."
cd /opt/SuperISP
sudo -u prolterapp npm install
sudo -u prolterapp npm run build
echo -e "⚙️  App built ✅"

####################################
# Step 9: Setup Systemd Service
####################################
echo -e "🛠️  Step 9/10: Setting up systemd service..."
sudo tee /etc/systemd/system/superisp.service > /dev/null <<EOF
[Unit]
Description=Prolter App
After=network.target

[Service]
WorkingDirectory=/opt/SuperISP
ExecStart=$(which npm) run start
Restart=always
Environment=NODE_ENV=production
Environment=DATABASE_URL=postgresql://prolter:securepass123@localhost:5432/prolterdb
User=prolterapp

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable superisp
sudo systemctl start superisp
echo -e "🛠️  Systemd service running as 'prolterapp' ✅"

####################################
# Step 10: Admin User + User Lockdown
####################################
echo -e "🔐 Step 10/10: Creating 'prolteradmin' and locking down others..."

# Create admin user
if id "prolteradmin" &>/dev/null; then
    echo "User prolteradmin already exists, skipping..."
else
    sudo useradd -m -s /bin/bash prolteradmin
    echo "prolteradmin:12345678" | sudo chpasswd
    sudo usermod -aG sudo prolteradmin
fi

# Disable all users except prolteradmin and prolterapp
for user in $(awk -F: '{ if ($3 >= 1000 && $1 != "prolteradmin" && $1 != "prolterapp") print $1 }' /etc/passwd); do
  sudo usermod --expiredate 1 "$user"
  echo "🔒 Disabled user: $user"
done

echo -e "🔐 Admin user ready and all others disabled ✅"

####################################
# Finished
####################################
echo -e "${GREEN}"
echo "============================================"
echo " ✅ Prolter Installed!"
echo " ➡️  Access it at: http://$IP"
echo " 👤 Login: prolteradmin | Password: 12345678"
echo "============================================"
echo -e "${NC}"
