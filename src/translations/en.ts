// src/translations/en.ts
import auth from './en/auth';
import header from './en/header';
import loginPage from './en/loginPage';
import forgotPasswordPage from './en/forgotPasswordPage';
import updatePasswordPage from './en/updatePasswordPage';
import dashboard from './en/mainDashboard';
import sidebar from './en/sidebar'; // Import the new sidebar translations module
import subscribers from './en/subscribers';
import globalSettings from './en/globalSettings';
import pops from './en/pops';
import mapsPage from './en/mapsPage';
import mapsElements from './en/mapsElements';
import settingsUsers from './en/settingsUser';
import settingsInternetPage from './en/settingsInternetPage';
import financesCashbookPage from './en/financesCashbookPage';
import financesEntryCategories from './en/financesEntryCategories';
import nocFttxDashboard from './en/nocFttxDashboard';
import nocFttxOlts from './en/nocFttxOlts';
import settingsSystemMonitor from './en/settingsSystemMonitor';
import inventoryWarehouses from './en/inventoryWarehouses';
import nocOnxTemplates from './en/nocOnxTemplates';
import financesFinancialConfigs from './en/financesFinancialConfigs';
import subscribersNewContractWizard from './en/subcribersNewContractWizard';
import serviceCallsDashboard from './en/serviceCallsDashboard';
import serviceCallsTypes from './en/serviceCallsTypes';
import settingsNetworkIpPage from './en/settingsNetworkIpPage';
import hubParticipants from './en/hubParticipants';
import settingsSecuritySettings from './en/settingsSecuritySettings';
import settingsNetworkDevices from './en/settingsNetworkDevices';
import settingsNetworkRadius from './en/settingsNetworkRadius';
import settingsNetworkCgnat from './en/settingsNetworkCgnat';
import settingsNetworkVlan from './en/settingsNetworkVlan';
import hrDashboard from './en/hrDashboard';
import hrSalesDashboard from './en/hrSalesDashboard';
import messengerChat from './en/messengerChat';
import messengerDepartments from './en/messengerDepartments';
import messengerChannels from './en/messengerChannels';
import messengerFlow from './en/messengerFlow';
import messengerConfigure from './en/messengerConfigure';

const en = {
  ...auth,
  ...header,
  ...loginPage,
  ...forgotPasswordPage,
  ...updatePasswordPage,
  ...dashboard,
  ...sidebar, // Spread the imported sidebar translations
  ...subscribers,
  ...globalSettings,
  ...pops,
  ...mapsPage,
  ...mapsElements,
  ...settingsUsers,
  ...settingsInternetPage,
  ...financesCashbookPage,
  ...financesEntryCategories,
  ...nocFttxDashboard,
  ...nocFttxOlts,
  ...settingsSystemMonitor,
  ...inventoryWarehouses,
  ...nocOnxTemplates,
  ...financesFinancialConfigs,
  ...subscribersNewContractWizard,
  ...serviceCallsDashboard,
  ...serviceCallsTypes,
  ...settingsNetworkIpPage,
  ...hubParticipants,
  ...settingsSecuritySettings,
  ...settingsNetworkDevices,
  ...settingsNetworkRadius,
  ...settingsNetworkCgnat,
  ...settingsNetworkVlan,
  ...hrDashboard,
  ...hrSalesDashboard,
  ...messengerChat,
  ...messengerDepartments,
  ...messengerChannels,
  ...messengerFlow,
  ...messengerConfigure,



  


  settings_plans: {
    internet_page_title: 'Internet Plans',
    add_plan_button: 'Add Internet Plan',
    existing_plans_title: 'Existing Plans',
    existing_plans_description_internet: 'Manage your internet service plans.',
    no_plans_found_internet: 'No internet plans configured yet. Click "Add Internet Plan" to create one."',
    tv_page_title: 'TV Plans',
    add_plan_button_tv: 'Add TV Plan',
    existing_plans_description_tv: 'Manage your TV service plans.',
    no_plans_found_tv: 'No TV plans configured yet. Click "Add TV Plan" to create one.',
    mobile_page_title: 'Mobile Plans',
    add_plan_button_mobile: 'Add Mobile Plan',
    existing_plans_description_mobile: 'Manage your mobile service plans.',
    no_plans_found_mobile: 'No mobile plans configured yet. Click "Add Mobile Plan" to create one.',
    landline_page_title: 'Landline Plans',
    add_plan_button_landline: 'Add Landline Plan',
    existing_plans_description_landline: 'Manage your landline service plans.',
    no_plans_found_landline: 'No landline plans configured yet. Click "Add Landline Plan" to create one.',
    combos_page_title: 'Combo Plans',
    add_plan_button_combos: 'Add Combo Plan',
    existing_plans_description_combos: 'Manage your combo service plans.',
    no_plans_found_combos: 'No combo plans configured yet. Click "Add Combo Plan" to create one."',
    table_header_id: 'ID',
    table_header_name: 'Name',
    table_header_upload: 'Upload',
    table_header_download: 'Download',
    table_header_price: 'Price',
    table_header_connection_type: 'Connection Type',
    table_header_client_count: 'Client Count',
    table_header_actions: 'Actions',
    edit_action: 'Edit',
    remove_action: 'Remove',
    connection_type_fiber: 'Fiber',
    connection_type_radio: 'Radio',
    connection_type_satellite: 'Satellite',
    connection_type_utp: 'UTP',
  },
  mysql_page: {
    title: 'MySQL Management',
    select_option_prompt: 'Please select an option from the sidebar to manage MySQL databases or tables, or use the CLI.',
    databases_title: 'Databases',
    databases_list_title: 'Database List',
    databases_list_description: 'View and manage your MySQL databases.',
    db_header_name: 'Name',
    db_header_owner: 'Owner',
    db_header_encoding: 'Encoding',
    db_header_size: 'Size',
    db_header_actions: 'Actions',
    edit_action: 'Edit',
    delete_action: 'Delete',
    tables_title: 'Tables',
    tables_list_title: 'Table List',
    tables_list_description: 'View and manage tables in the selected database.',
    table_header_name: 'Name',
    table_header_schema: 'Schema',
    table_header_rows: 'Rows',
    table_header_size: 'Size',
    table_header_actions: 'Actions',
    add_database_button: 'Add Database',
    add_database_dialog_title: 'Add New Database',
    add_database_dialog_description: 'Enter the name for the new MySQL database.',
    form_db_name_label: 'Database Name',
    form_db_name_placeholder: 'e.g., my_new_app_db',
    form_create_db_button: 'Create Database',
    add_db_success_toast_title: 'Database Created',
    add_db_success_toast_desc: 'Database "{dbName}" has been created.',
    add_db_error_toast_title: 'Error Creating Database',
    add_db_error_toast_desc: 'Could not create the database.',
    add_table_button: 'Add Table',
    view_data_button: 'View Data',
    no_databases_found: 'No databases found or connection impossible. Check your .env file and ensure the database server is accessible.',
    loading_databases_error: 'Error loading database information: {message}',
    refreshing_databases_toast_title: 'Refreshing Databases...',
    refreshing_databases_toast_desc: 'Fetching the latest list of databases.',
    refresh_databases_button: 'Refresh',
    no_tables_found: 'No tables found in the selected database.',
    select_database_placeholder: 'Select a Database',
    select_database_prompt: 'Please select a database to view its tables.',
    backup_restore_title: 'Backup & Restore',
    backup_restore_description: 'Manage database backups and restore operations.',
    backup_restore_info: 'Backup and restore functionality is not yet implemented.',
    create_backup_button: 'Create Backup',
    restore_backup_button: 'Restore from Backup',
    cli_title: 'SQL Command Line Interface',
    cli_description: 'Execute SQL commands directly on the MySQL database. Use with caution.',
    cli_placeholder: 'Enter SQL command here (e.g., SELECT * FROM pops;)',
    cli_execute_button: 'Execute Command',
    cli_executing_button: 'Executing...',
    cli_results_title: 'Results:',
    cli_empty_command_title: 'Empty Command',
    cli_empty_command_desc: 'Please enter an SQL command to execute.',
    cli_simulated_error_desc: 'Simulated error executing command: Invalid syntax near "error".',
    cli_execution_error_title: 'Execution Error',
    cli_unexpected_error_desc: 'An unexpected error occurred.',
    cli_command_success_no_rows: 'Command "{command}" executed successfully. No rows returned.',
    cli_command_success_generic: 'Command "{command}" executed successfully. Result: {details}',
    cli_command_success_no_output: 'Command executed successfully, but no specific output was returned.',
    cli_execution_success_title: 'Command Executed',
    cli_execution_success_toast_desc: 'SQL command processed.',
    cli_execution_success_no_output_toast_desc: 'SQL command processed with no specific output.',
  },
  form_cancel_button: 'Cancel',
  form_saving_button: 'Saving...',


  service_calls: {
    title: 'Service Calls',
    refresh_button: 'Refresh',
    new_call_button: 'New Service Call',
    list_title: 'All Service Calls',
    table_header_id: 'ID',
    table_header_subscriber: 'Subscriber',
    table_header_reason: 'Reason',
    table_header_status: 'Status',
    table_header_technician: 'Technician',
    table_header_scheduled_date: 'Scheduled Date',
    table_header_created_at: 'Created At',
    table_header_actions: 'Actions',
    action_view: 'View',
    action_edit: 'Edit',
    action_delete: 'Delete',
    status_pending: 'Pending',
    status_in_progress: 'In Progress',
    status_resolved: 'Resolved',
    status_canceled: 'Canceled',
    status_all_tab: 'All',
    no_calls_found: 'No service calls found.',
    new_call_not_implemented_title: 'New Service Call (Not Implemented)',
    new_call_not_implemented_desc: 'Functionality to create new service calls is not yet available.',
    view_call_not_implemented_title: 'View Service Call (Not Implemented)',
    view_call_not_implemented_desc: 'Viewing details for call {id} is not yet available.',
    edit_call_not_implemented_title: 'Edit Service Call (Not Implemented)',
    edit_call_not_implemented_desc: 'Editing call {id} is not yet available.',
    delete_call_not_implemented_title: 'Delete Service Call (Not Implemented)',
    delete_call_not_implemented_desc: 'Deleting call {id} is not yet available.',
  },
  integrations_whatsapp: {
    title: 'WhatsApp Business API',
    description: 'Manage your WhatsApp Business API integration for customer communication.',
    placeholder: 'WhatsApp integration settings and status will be displayed here. (Not Implemented)'
  },
  integrations_telegram: {
    title: 'Telegram Bot Integration',
    description: 'Manage your Telegram bot integration for notifications and support.',
    placeholder: 'Telegram integration settings and bot status will be displayed here. (Not Implemented)'
  },
  integrations_meta: {
    title: 'Meta Platform Integration',
    description: 'Manage your Facebook Page and Instagram integrations for customer engagement.',
    placeholder: 'Meta integration settings (Facebook Page, Instagram Account) will be displayed here. (Not Implemented)'
  },
  integrations_sms: {
    title: 'SMS Gateway Configuration',
    description: 'Manage your SMS gateway integration for sending text message notifications.',
    placeholder: 'SMS gateway settings (API Key, Sender ID, etc.) will be displayed here. (Not Implemented)'
  },
};

export default en;
