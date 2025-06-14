// src/translations/en/settingsInternetPage.ts
const settingsInternetPage = {
  settings_plans: {
    internet_page_title: 'Internet Plans',
    add_plan_button: 'Add Internet Plan',
    existing_plans_title: 'Existing Internet Plans',
    existing_plans_description_internet: 'Manage your internet service plans.',
    no_plans_found_internet: 'No internet plans configured yet. Click "Add Internet Plan" to create one.',
    table_header_id: 'ID',
    table_header_name: 'Name',
    table_header_upload: 'Upload',
    table_header_download: 'Download',
    table_header_price: 'Price',
    table_header_connection_type: 'Connection Type',
    table_header_client_count: 'Client Count',
    connection_type_fiber: 'Fiber',
    connection_type_radio: 'Radio',
    connection_type_satellite: 'Satellite',
    connection_type_utp: 'UTP',
    // Note: table_header_actions and edit/remove_action were in the main settings_plans object previously.
    // If they are specific to this page, they can be here. If general, they should remain in a general plans translation.
    // For now, I'll assume they might be general and not include them here unless specified.
  },
};

export default settingsInternetPage;
