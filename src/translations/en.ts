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
import pops from './en/settingsBuisnessPops';
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
import settingsBuisnessCities from './en/settingsBusinessCities';
import postgresDatabases from './en/postgresDatabases';
import postgresTables from './en/postgresTables';
import postgresSqlCli from './en/postgresSqlCli';

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
  ...settingsBuisnessCities,
  ...postgresDatabases,
  ...postgresTables,
  ...postgresSqlCli,

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
