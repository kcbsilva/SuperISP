// src/translations/en.ts
import auth from './en/auth';
import header from './en/header';
import loginPage from './en/loginPage';
import forgotPasswordPage from './en/forgotPasswordPage';
import updatePasswordPage from './en/updatePasswordPage';
import dashboard from './en/mainDashboard';
import sidebar from './en/sidebar';
import subscribers from './en/subscribers';
import globalSettings from './en/globalSettings';
import settingsBusinessPops from './en/settingsBusinessPops';
import mapsPage from './en/mapsPage';
import mapsElements from './en/mapsElements';
import settingsUsers from './en/settingsUser';
import settingsInternetPage from './en/settingsInternetPage';
import settingsBusinessCities from './en/settingsBusinessCities';
import financesCashbookPage from './en/financesCashbookPage';
import financesEntryCategories from './en/financesEntryCategories';
import nocFttxDashboard from './en/nocFttxDashboard';
import nocFttxOlts from './en/nocFttxOlts';
import settingsSystemMonitor from './en/settingsSystemMonitor';
import inventoryWarehouses from './en/inventoryWarehouses';
import nocOnxTemplates from './en/nocOnxTemplates';
import financesFinancialConfigs from './en/financesFinancialConfigs'; // Import for financial_configs
import subscribersNewContractWizard from './en/subcribersNewContractWizard';
import serviceCallsDashboard from './en/serviceCallsDashboard';
import serviceCallsTypes from './en/serviceCallsTypes';
import settingsNetworkIpPage from './en/settingsNetworkIpPage';
import hubParticipants from './en/hubParticipants'; // Import for hub_participants
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
import postgresDatabases from './en/postgresDatabases';
import postgresTables from './en/postgresTables';
import postgresSqlCli from './en/postgresSqlCli';


const en = {
  auth: auth.auth,
  header: header.header,
  login: loginPage.login,
  forgot_password: forgotPasswordPage.forgot_password,
  update_password: updatePasswordPage.update_password,
  dashboard: dashboard.dashboard,
  sidebar: sidebar.sidebar,
  subscribers: subscribers.subscribers,
  list_subscribers: subscribers.list_subscribers,
  add_subscriber: subscribers.add_subscriber,
  subscriber_profile: subscribers.subscriber_profile,
  global_settings: globalSettings,
  pops: settingsBusinessPops,
  maps_page: mapsPage,
  maps_elements: mapsElements,
  settings_users: settingsUsers,
  settings_plans: settingsInternetPage,
  settings_business_cities: settingsBusinessCities,
  finances_cash_book: financesCashbookPage,
  finances_entry_categories: financesEntryCategories,
  fttx_dashboard: nocFttxDashboard,
  fttx_olts: nocFttxOlts,
  settingsSystemMonitor: settingsSystemMonitor,
  inventory_warehouses: inventoryWarehouses,
  onx_templates: nocOnxTemplates,
  financial_configs: financesFinancialConfigs, // Assign the imported object
  new_contract_wizard: subscribersNewContractWizard,
  service_calls_dashboard: serviceCallsDashboard,
  service_types: serviceCallsTypes,
  network_ip_page: settingsNetworkIpPage,
  hub_participants: hubParticipants, // Assign the imported object
  security_settings_page: settingsSecuritySettings,
  network_devices_page: settingsNetworkDevices,
  network_radius_page: settingsNetworkRadius,
  cgnat_page: settingsNetworkCgnat,
  vlan_page: settingsNetworkVlan,
  hr_dashboard: hrDashboard,
  sales_dashboard: hrSalesDashboard,
  messenger_chat: messengerChat,
  messenger_departments: messengerDepartments,
  messenger_channels: messengerChannels,
  messenger_flow: messengerFlow,
  messenger_configure: messengerConfigure,
  postgres_databases: postgresDatabases.postgres_databases,
  postgres_tables: postgresTables.postgres_tables,
  postgres_sql_cli: postgresSqlCli.postgres_sql_cli,

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
