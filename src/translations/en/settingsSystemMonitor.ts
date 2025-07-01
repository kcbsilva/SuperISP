// src/translations/en/settingsSystemMonitor.ts

const settingsSystemMonitor = {
  page_title: 'System Monitor',

  // Metrics
  cpu_usage: 'CPU Usage',
  ram_usage: 'RAM Usage',
  ssd_usage: 'SSD Usage',
  postgres_status: 'PostgreSQL Status',

  // Refresh
  refresh_button: 'Refresh Metrics',
  refresh_toast_title: 'Refreshing Metrics',
  refresh_toast_description: 'Fetching latest system status...',
  postgres_connected: 'Connected',
  postgres_disconnected: 'Disconnected - Check logs!',

  // Logs
  live_logs_title: 'Live Logs',

  // Services
  services_status_title: 'Services Status',
  service_status_active: 'Active',
  service_status_inactive: 'Inactive',
  service_status_error: 'Error',

  // Actions
  service_action_restart: 'Restart',
  service_action_update: 'Update',
  restart_action_toast_title: 'Restarting Service',
  restart_action_toast_desc: 'Restarting {serviceName}...',
  restart_success: 'Restart Complete',
  restart_success_message: 'Service has been restarted successfully.',
  restart_failed: 'Restart Failed',

  // Update actions
  update_started: 'Update Started',
  update_success: 'Update Complete',
  update_failed: 'Update Failed',
  update_finished: 'The update process has finished.',
  updating_service: 'Updating {service}...',

  // Service names
  service_ubuntu: 'Ubuntu System',
  service_cron: 'CRON Scheduler',
  service_ntp: 'NTP Service',
  service_freeradius: 'FreeRADIUS',
  service_nginx: 'Nginx Web Server',
  service_nodejs: 'Node.js Runtime',
  service_postgresql: 'PostgreSQL Database',
  service_strongswan: 'StrongSwan VPN',
  service_sshd: 'SSH Daemon',
  service_prolter: 'Prolter System',
};

export default settingsSystemMonitor;
