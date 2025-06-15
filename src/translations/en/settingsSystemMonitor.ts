//src/translations/en/settingsSystemMonitor.ts

const settingsSystemMonitor = {
    page_title: 'System Monitor',
    cpu_usage: 'CPU Usage',
    ram_usage: 'RAM Usage',
    ssd_usage: 'SSD Usage',
    postgres_status: 'PostgreSQL Status', // Keeping this as it might be used by Supabase
    supabase_status: 'Supabase Status', // Changed from mysql_status
    refresh_button: 'Refresh Metrics',
    refresh_toast_title: 'Refreshing Metrics',
    refresh_toast_description: 'Fetching latest system status...',
    postgres_connected: 'Connected',
    postgres_disconnected: 'Disconnected - Check logs!',
    supabase_connected: 'Connected', // Changed from mysql_connected
    supabase_disconnected: 'Disconnected - Check logs!', // Changed from mysql_disconnected
    live_logs_title: 'Live Logs (Placeholder)',
    live_logs_description: 'This section would display real-time system logs.',
  }

  export default settingsSystemMonitor;
