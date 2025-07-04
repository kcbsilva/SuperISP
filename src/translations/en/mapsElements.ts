//src/translations/en/mapsElements.ts

const maps_elements = {
    add_element_button: 'Add Element',
    select_type_title: 'Select Element Type',
    select_type_description: 'Please select a specific map element type from the sidebar to view or manage its items.',
    list_title_polls: 'Poll List',
    no_polls_found: 'No polls found. They are typically added via the map interface.',
    list_title_fdhs: 'FDH List',
    no_fdhs_found: 'No FDHs found. They are typically added via the map interface.',
    list_title_foscs: 'FOSC List',
    no_foscs_found: 'No FOSCs found. They are typically added via the map interface.',
    list_title_splitters: 'Splitter List',
    no_splitters_found: 'No splitters found. They are typically added via the map interface.',
    fosc_table_header_gps: 'GPS Coordinates',
    fosc_table_header_type: 'Type',
    fosc_type_aerial: 'Aerial',
    fosc_type_underground: 'Underground',
    fosc_table_header_trays: 'Trays (Used/Max)',
    fosc_table_header_cable_count: 'Cables (In/Out)',
    fosc_table_header_status: 'Status',
    fosc_status_active: 'Active',
    fosc_status_inactive: 'Inactive',
    fosc_status_planned: 'Planned',
    fosc_table_header_brand: 'Brand',
    fosc_table_header_manufacturer: 'Manufacturer',
    action_edit_fosc: 'Edit FOSC',
    action_delete_fosc: 'Delete FOSC',
    fosc_template_button: 'FOSC Templates',
    fosc_manage_templates_title: 'Manage FOSC Templates',
    fosc_new_template_heading: 'New Template',
    fosc_template_form_manufacturer_label: 'Manufacturer',
    fosc_template_form_manufacturer_placeholder: 'Select Manufacturer',
    fosc_template_form_model_label: 'Model',
    fosc_template_form_model_placeholder: 'e.g., FOSC 450 D6',
    fosc_template_form_max_trays_label: 'Max Tray Capacity',
    fosc_template_form_max_cables_label: 'Max Cable Inserts',
    fosc_template_form_max_splices_label: 'Max Splice Counts',
    fosc_template_form_cancel_button: 'Cancel',
    fosc_template_form_save_button: 'Save Template',
    fosc_template_add_success_title: 'FOSC Template Added',
    fosc_template_add_success_desc: 'Template for {model} by {manufacturer} added.',
    existing_fosc_templates_list_title: 'Existing Templates',
    no_existing_fosc_templates: 'No existing templates.',
    fosc_template_info_trays: 'Trays',
    fosc_template_info_cables: 'Cables',
    fosc_template_info_splices: 'Splices',
    fosc_modal_title: 'FOSC Details: {id}',
    fosc_modal_tab_cable_info: 'Cable Info',
    fosc_modal_cable_info_number: '#',
    fosc_modal_cable_info_serial: 'Serial #',
    fosc_modal_cable_info_count: 'Count',
    fosc_modal_cable_info_manufacturer: 'Manufacturer',
    fosc_modal_cable_info_description: 'Description',
    fosc_modal_cable_info_tube_ids: 'Tube IDs',
    fosc_modal_cable_info_meter_mark: 'Meter Mark',
    fosc_modal_no_cable_info: 'No cable information available.',
    fosc_modal_tab_splice_diagram: 'Splice Diagram',
    fosc_modal_tab_splice_log: 'Splice Log',
    fosc_modal_no_splice_logs: 'No splice logs available.',
    fosc_modal_tab_history: 'History',
    fosc_modal_no_history: 'No history available.',
    list_title_peds: 'PED List',
    ped_table_header_description: 'Description',
    ped_table_header_ped_type: 'PED Type',
    ped_type_column: 'Column',
    ped_type_cabinet: 'Cabinet',
    ped_table_header_energized: 'Energized?',
    ped_table_header_manufacturer: 'Manufacturer',
    ped_table_header_gps: 'GPS',
    ped_table_header_address: 'Address (Optional)',
    action_edit_ped: 'Edit PED',
    action_delete_ped: 'Delete PED',
    yes_indicator: 'Yes',
    no_indicator: 'No',
    no_peds_found: 'No PEDs found. They are typically added via the map interface.',
    list_title_accessories: 'Accessory List',
    no_accessories_found: 'No accessories found. They are typically added via the map interface.',
    list_title_towers: 'Tower List',
    no_towers_found: 'No towers found. They are typically added via the map interface.',
    list_title_cables: 'Cable List',
    no_cables_found: 'No cables found. They are typically added via the map interface.',
    projects_page_title: 'Projects',
    add_project_button: 'Add Project',
    list_title_projects: 'Project List',
    no_projects_found: 'No projects found. Click "Add Project" to create one.',
    table_header_project: 'Project',
    project_table_header_id: 'ID',
    project_table_header_name: 'Project Name',
    project_table_header_pop: 'PoP',
    project_table_header_status: 'Status',
    project_table_header_actions: 'Actions',
    action_edit_project: 'Edit Project',
    action_delete_project: 'Delete Project',
    fdh_table_header_gps: 'GPS Coordinates',
    fdh_table_header_type: 'Type',
    fdh_type_aerial: 'Aerial',
    fdh_type_underground: 'Underground',
    fdh_table_header_ports: 'Ports',
    fdh_table_header_pon: 'PON',
    fdh_table_header_status: 'Status',
    fdh_status_active: 'Active',
    fdh_status_inactive: 'Inactive',
    fdh_table_header_brand: 'Brand',
    action_edit_fdh: 'Edit FDH',
    action_delete_fdh: 'Delete FDH',
    fdh_modal_title: 'FDH Details: {id}',
    fdh_modal_tab_port_list: 'Port List',
    fdh_modal_port_number: 'Port #',
    fdh_modal_client_name: 'Client Name',
    fdh_modal_light_levels_rx_tx: 'Light Levels (RX/TX)',
    fdh_modal_port_free: 'Free',
    fdh_modal_no_clients_or_ports: 'No ports or clients to display for this FDH.',
    fdh_modal_tab_cable_info: 'Cable Info',
    fdh_modal_cable_info_number: '#',
    fdh_modal_cable_info_serial: 'Serial #',
    fdh_modal_cable_info_count: 'Count',
    fdh_modal_cable_info_manufacturer: 'Manufacturer',
    fdh_modal_cable_info_description: 'Description',
    fdh_modal_cable_info_tube_ids: 'Tube IDs',
    fdh_modal_cable_info_meter_mark: 'Meter Mark',
    fdh_modal_no_cable_info: 'No cable information available for this FDH.',
    fdh_modal_tab_diagram: 'Splice Diagram',
    fdh_modal_tab_log: 'Splice Log',
    fdh_modal_log_date: 'Date',
    fdh_modal_log_technician: 'Technician',
    fdh_modal_log_tube_a: 'Tube ID (A)',
    fdh_modal_log_fiber_a: 'Fiber # (A)',
    fdh_modal_log_tube_b: 'Tube ID (B)',
    fdh_modal_log_fiber_b: 'Fiber # (B)',
    fdh_modal_log_tray: 'Tray',
    fdh_modal_log_slot: 'Slot',
    fdh_modal_log_notes: 'Description',
    fdh_modal_no_logs: 'No splice logs available for this FDH.',
    fdh_modal_tab_history: 'History',
    fdh_modal_history_date: 'Date',
    fdh_modal_history_user: 'User',
    fdh_modal_history_action: 'Action',
    fdh_modal_history_details: 'Details',
    fdh_modal_no_history: 'No history available for this FDH.',
    fdh_modal_close_button: 'Close',
    template_modal_not_implemented_title: 'Template Management (Not Implemented)',
    poll_template_button: 'Poll Templates',
    poll_template_modal_not_implemented_desc: 'Managing templates for Polls is not yet available.',
    poll_profile_title: 'Poll Profile: {id}',
    poll_profile_description: 'Details of the selected hydro poll.',
    poll_modal_tab_details: 'Details',
    poll_modal_tab_cables: 'Cables Passed',
    poll_modal_tab_enclosures: 'Enclosures',
    poll_modal_tab_history: 'History',
    poll_profile_id_label: 'ID',
    poll_profile_description_label: 'Description',
    poll_profile_project_label: 'Project',
    poll_profile_height_label: 'Height',
    poll_profile_type_label: 'Type',
    poll_profile_address_label: 'Address',
    poll_profile_gps_label: 'GPS Coordinates',
    poll_profile_transformer_label: 'Transformer',
    poll_modal_cables_passed_heading: 'Cables Passed',
    poll_modal_no_cables: 'No cables passed through this poll.',
    poll_modal_enclosures_heading: 'Attached Enclosures',
    poll_modal_foscs_heading: 'FOSCs',
    poll_modal_no_foscs: 'No FOSCs attached.',
    poll_modal_fdhs_heading: 'FDHs',
    poll_modal_no_fdhs: 'No FDHs attached.',
    poll_modal_history_heading: 'Poll History',
    poll_modal_history_date: 'Date',
    poll_modal_history_user: 'User',
    poll_modal_history_description: 'Description',
    poll_modal_history_details: 'Details',
    poll_modal_no_history: 'No history entries available.',
    poll_modal_close_button: 'Close',
    action_edit_poll: 'Edit Poll (Not Implemented)',
    action_delete_poll: 'Delete Poll (Not Implemented)',
    action_see_in_map: 'See in Map (Not Implemented)',
    ped_template_button: 'PED Templates',
    ped_template_modal_not_implemented_desc: 'Managing templates for PEDs is not yet available.',
    tower_template_button: 'Tower Templates',
    tower_template_modal_not_implemented_desc: 'Managing templates for Towers is not yet available.',
    cable_template_button: 'Cable Templates',
    cable_template_modal_not_implemented_desc: 'Managing templates for Cables is not yet available.',
    accessory_template_button: 'Accessory Templates',
    accessory_template_modal_not_implemented_desc: 'Managing templates for Accessories is not yet available.',
    splitter_template_button: 'Splitter Templates',
    splitter_template_modal_not_implemented_desc: 'Managing templates for Splitters is not yet available.',
    splitter_table_header_id: 'ID',
    splitter_table_header_description: 'Description',
    splitter_table_header_enclosure: 'Enclosure (FOSC/FDH ID)',
    splitter_table_header_connectorized: 'Connectorized',
    splitter_table_header_connector_type: 'Connector Type',
    splitter_table_header_distribution_type: 'Distribution Type',
    splitter_table_header_category: 'Category',
    splitter_table_header_ratio: 'Ratio (if 1x2)',
    action_edit_splitter: 'Edit Splitter',
    action_delete_splitter: 'Delete Splitter',
    splitter_manage_templates_title: 'Manage Splitter Templates',
    splitter_new_template_heading: 'New Splitter Template',
    splitter_template_form_manufacturer_label: 'Manufacturer',
    splitter_template_form_manufacturer_placeholder: 'Select Manufacturer',
    splitter_template_form_model_label: 'Model',
    splitter_template_form_model_placeholder: 'e.g., OptiTap Splitter',
    splitter_template_form_category_label: 'Category',
    splitter_template_form_category_placeholder: 'Select Category',
    splitter_template_form_input_conn_label: 'Input Connector',
    splitter_template_form_output_conn_label: 'Output Connector(s)',
    splitter_template_form_conn_placeholder: 'Select Type',
    splitter_template_form_dist_type_label: 'Distribution Type',
    splitter_template_form_dist_type_placeholder: 'Select Type',
    splitter_dist_type_network: 'Network',
    splitter_dist_type_pon: 'PON',
    splitter_template_form_cancel_button: 'Cancel',
    splitter_template_form_save_button: 'Save Template',
    splitter_template_add_success_title: 'Splitter Template Added',
    splitter_template_add_success_desc: 'Template for {model} by {manufacturer} added.',
    existing_splitter_templates_list_title: 'Existing Templates',
    no_existing_splitter_templates: 'No existing templates.',
    splitter_template_info_category: 'Category',
    splitter_template_info_conn_types: 'Connectors (In/Out)',
    fdh_template_button: 'FDH Templates',
    fdh_manage_templates_title: 'Manage FDH Templates',
    fdh_new_template_heading: 'New FDH Template',
    fdh_template_form_manufacturer_label: 'Manufacturer',
    fdh_template_form_manufacturer_placeholder: 'Select Manufacturer',
    fdh_template_form_model_label: 'Model',
    fdh_template_form_model_placeholder: 'e.g., OptiSheath',
    fdh_template_form_max_port_capacity_label: 'Max Port Capacity',
    fdh_template_form_type_label: 'FDH Type',
    fdh_template_form_type_placeholder: 'Select Type',
    fdh_template_form_cancel_button: 'Cancel',
    fdh_template_form_save_button: 'Save Template',
    fdh_template_add_success_title: 'FDH Template Added',
    fdh_template_add_success_desc: 'Template for {model} by {manufacturer} added.',
    existing_fdh_templates_list_title: 'Existing FDH Templates',
    no_existing_fdh_templates: 'No existing FDH templates.',
    fdh_template_info_max_ports: 'Max Ports',
    fdh_template_info_type: 'Type',
    poll_manage_templates_title: 'Manage Poll Templates',
    poll_new_template_heading: 'New Poll Template',
    poll_template_form_manufacturer_label_optional: 'Manufacturer (Optional)',
    poll_template_form_manufacturer_placeholder: 'Select Manufacturer',
    poll_template_form_material_label: 'Material',
    poll_template_form_material_placeholder: 'Select Material',
    poll_template_form_height_label: 'Height Description',
    poll_template_form_height_placeholder: 'e.g., 12m Concrete, 10ft Wood',
    poll_template_form_type_label: 'Type',
    poll_template_form_type_placeholder: 'Select poll type',
    poll_type_circular: 'Circular',
    poll_type_square: 'Square',
    poll_template_form_cancel_button: 'Cancel',
    poll_template_form_save_button: 'Save Template',
    poll_template_add_success_title: 'Poll Template Added',
    poll_template_add_success_desc_new: 'Poll template for {height} {material} poles added.',
    existing_poll_templates_list_title: 'Existing Templates',
    no_existing_poll_templates: 'No existing templates.',
    poll_template_info_height_display: 'Height: {height}',
    ped_manage_templates_title: 'Manage PED Templates',
    ped_new_template_heading: 'New PED Template',
    ped_template_form_manufacturer_label: 'Manufacturer',
    ped_template_form_manufacturer_placeholder: 'Select Manufacturer',
    ped_template_form_model_label: 'Model',
    ped_template_form_model_placeholder: 'e.g., Alpha PED 2000',
    ped_template_form_max_capacity_label: 'Max Capacity (Slots/Connections)',
    ped_template_form_type_label: 'PED Type',
    ped_template_form_type_placeholder: 'Select Type',
    ped_template_form_cancel_button: 'Cancel',
    ped_template_form_save_button: 'Save Template',
    ped_template_add_success_title: 'PED Template Added',
    ped_template_add_success_desc: 'Template for {model} by {manufacturer} added.',
    existing_ped_templates_list_title: 'Existing PED Templates',
    no_existing_ped_templates: 'No existing PED templates.',
    ped_template_info_max_capacity: 'Max Capacity',
    ped_template_info_type: 'Type',
    list_title_sites: 'Site List',
    site_template_button: 'Site Templates',
    site_template_modal_not_implemented_desc: 'Managing templates for Sites is not yet available.',
    no_sites_found: 'No sites found. They are typically added via the map interface.',
    list_title_vaults: 'Vault List',
    vault_template_button: 'Vault Templates',
    vault_template_modal_not_implemented_desc: 'Managing templates for Vaults is not yet available.',
    no_vaults_found: 'No vaults found. They are typically added via the map interface.',
    list_title_ducts: 'Duct List',
    duct_template_button: 'Duct Templates',
    duct_template_modal_not_implemented_desc: 'Managing templates for Ducts is not yet available.',
    no_ducts_found: 'No ducts found. They are typically added via the map interface.',
  }

  export default maps_elements;