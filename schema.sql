-- PostgreSQL schema for SuperISP

-- Roles and permissions
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  group_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL,
  description TEXT,
  default_role_id INTEGER REFERENCES roles(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE template_permissions (
  template_id INTEGER REFERENCES user_templates(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (template_id, permission_id)
);

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  full_name VARCHAR(255),
  role_id INTEGER REFERENCES roles(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Subscribers and related tables
CREATE TABLE pops (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  subscriber_type VARCHAR(20) NOT NULL,
  full_name VARCHAR(255),
  company_name VARCHAR(255),
  birthday DATE,
  established_date DATE,
  address TEXT NOT NULL,
  point_of_reference TEXT,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  mobile_number VARCHAR(50),
  tax_id VARCHAR(100),
  business_number VARCHAR(100),
  id_number VARCHAR(100),
  signup_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriber_services (
  id SERIAL PRIMARY KEY,
  subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,
  service_type VARCHAR(20) NOT NULL,
  plan VARCHAR(100) NOT NULL,
  pop_id INTEGER REFERENCES pops(id),
  status VARCHAR(20) NOT NULL,
  technology VARCHAR(20),
  download_speed VARCHAR(20),
  upload_speed VARCHAR(20),
  ip_address VARCHAR(100),
  online_status VARCHAR(20),
  authentication_type VARCHAR(20),
  pppoe_username VARCHAR(100),
  pppoe_password VARCHAR(100),
  ipoe_username VARCHAR(100),
  ipoe_password VARCHAR(100),
  mac_address VARCHAR(100),
  xpon_sn VARCHAR(100)
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,
  contract_id INTEGER,
  date_made DATE,
  due_date DATE,
  value NUMERIC(10,2),
  wallet VARCHAR(100),
  status VARCHAR(20) CHECK (status IN ('Paid','Due','Canceled'))
);

CREATE TABLE payment_plans (
  id SERIAL PRIMARY KEY,
  subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,
  start_date DATE,
  installments INTEGER,
  installment_amount NUMERIC(10,2),
  status VARCHAR(20)
);

CREATE TABLE promises_to_pay (
  id SERIAL PRIMARY KEY,
  subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,
  promise_date DATE,
  amount NUMERIC(10,2),
  status VARCHAR(20)
);

CREATE TABLE service_calls (
  id SERIAL PRIMARY KEY,
  subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,
  date DATE,
  reason TEXT,
  status VARCHAR(20),
  technician TEXT,
  notes TEXT
);

CREATE TABLE inventory_items (
  id SERIAL PRIMARY KEY,
  subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,
  name VARCHAR(255),
  serial_number VARCHAR(255),
  item_type VARCHAR(50),
  status VARCHAR(50),
  assigned_date DATE
);

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,
  name VARCHAR(255),
  doc_type VARCHAR(50),
  upload_date DATE,
  url TEXT
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,
  date DATE,
  author VARCHAR(255),
  content TEXT
);

CREATE TABLE history_entries (
  id SERIAL PRIMARY KEY,
  subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,
  date DATE,
  user_name VARCHAR(255),
  action TEXT,
  details TEXT
);

-- Network equipment
CREATE TABLE olts (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  manufacturer VARCHAR(100),
  model VARCHAR(100),
  technology VARCHAR(20),
  ports INTEGER,
  ip_address VARCHAR(100),
  management_port INTEGER,
  status VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Optical Network Units / Terminals
CREATE TABLE onus (
  id SERIAL PRIMARY KEY,
  olt_id INTEGER REFERENCES olts(id) ON DELETE CASCADE,
  serial_number VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(100),
  model VARCHAR(100),
  subscriber_id INTEGER REFERENCES subscribers(id),
  light_level_tx VARCHAR(20),
  light_level_rx VARCHAR(20),
  status VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ONUs provisioning templates
CREATE TABLE onu_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(100),
  model VARCHAR(100),
  provisioning_script TEXT,
  unprovisioning_script TEXT,
  success_condition_type VARCHAR(50),
  success_condition_text VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Cities / Regions
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  country VARCHAR(100),
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Authentication users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nas (
  id SERIAL PRIMARY KEY,
  nasname TEXT NOT NULL UNIQUE,       -- IP Address
  shortname TEXT NOT NULL UNIQUE,     -- Friendly Name
  type TEXT NOT NULL,                 -- Type (Mikrotik, Cisco, etc.)
  ports INTEGER,                      -- FreeRADIUS: Number of ports
  secret TEXT NOT NULL,               -- FreeRADIUS shared secret
  server TEXT,                        -- FreeRADIUS: server (optional)
  community TEXT,                     -- SNMP community (encrypted)
  snmp_version TEXT,
  snmp_port INTEGER DEFAULT 161,
  timeout INTEGER,
  username TEXT,
  password TEXT,                      -- Encrypted login password
  http_port INTEGER,
  dns1 TEXT,
  dns2 TEXT,
  pop_id UUID REFERENCES pops(id),
  description TEXT,
  snmp_status TEXT DEFAULT 'pending', -- ok, fail, pending
  ping_time_ms INTEGER,
  last_checked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE system_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  target_id TEXT,
  message TEXT NOT NULL,
  level TEXT DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- /prisma/migrations/.../migration.sql or via SQL directly
CREATE TABLE vlans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vlan_id INTEGER NOT NULL CHECK (vlan_id BETWEEN 1 AND 4094),
  description TEXT,
  pop_id UUID NOT NULL REFERENCES pops(id),
  is_tagged BOOLEAN DEFAULT TRUE,
  status VARCHAR(10) NOT NULL CHECK (status IN ('Active', 'Inactive')),
  assigned_to TEXT,
  available_in_hub BOOLEAN DEFAULT FALSE,
  participant_id UUID REFERENCES participants(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  business_number TEXT NOT NULL UNIQUE,
  device_count INTEGER DEFAULT 0,
  vlan_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create the devices table
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  ip_address INET NOT NULL,
  type TEXT CHECK (type IN ('Router', 'Switch', 'Access Point', 'NVR', 'Server', 'OLT', 'Other')),
  manufacturer TEXT,
  pop_id UUID REFERENCES pops(id) ON DELETE SET NULL,
  monitor BOOLEAN DEFAULT FALSE,
  readable BOOLEAN DEFAULT FALSE,
  radius BOOLEAN DEFAULT FALSE,
  provision BOOLEAN DEFAULT FALSE,
  backup BOOLEAN DEFAULT FALSE,
  connection_type TEXT CHECK (connection_type IN ('SSH', 'Web', 'Telnet', 'API')),
  username TEXT,
  password TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create the enum type
CREATE TYPE device_type AS ENUM (
  'Router',
  'Switch',
  'Access Point',
  'NVR',
  'Server',
  'OLT',
  'Other'
);

CREATE TABLE entry_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('Income', 'Expense')) NOT NULL,
  description TEXT,
  parent_category_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT fk_parent FOREIGN KEY (parent_category_id) REFERENCES entry_categories(id) ON DELETE SET NULL
);

CREATE TABLE vpn_connections (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  remote_address TEXT NOT NULL,
  local_subnet TEXT NOT NULL,
  remote_subnet TEXT NOT NULL,
  pre_shared_key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE vpn_users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  client_ip INET NOT NULL,
  routes TEXT[], -- supports multiple CIDRs
  psk TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);