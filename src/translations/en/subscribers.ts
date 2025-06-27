/* src/locales/en/subscribers.ts (or wherever you store this) */
const subscribers = {
  add_subscriber: {
  },

  list_subscribers: {
    /* ───────── toolbar / misc ───────── */
    title: 'Subscribers',
    add_button: 'Add New',
    refresh_button: 'Refresh',
    search_placeholder: 'Search by ID, name, Tax ID, phone...',
    filter_button: 'Filter',

    /* ───────── filter labels ───────── */
    filter_type_label: 'Filter by Type',
    filter_type_residential: 'Residential',
    filter_type_commercial: 'Commercial',
    filter_status_label: 'Filter by Status',
    filter_status_active: 'Active',
    filter_status_inactive: 'Inactive',
    filter_status_suspended: 'Suspended',
    filter_status_planned: 'Planned',

    /* ───────── table headers (old + new) ───────── */
    table_header_id: 'ID',
    table_header_type: 'Type',                 // legacy
    table_header_subscriberType: 'Type',       // NEW (camel-case key used by code)
    table_header_name: 'Name',
    table_header_tax_id: 'Tax ID / CNPJ',      // legacy
    table_header_taxId: 'Tax ID / CNPJ',       // NEW
    table_header_status: 'Status',
    table_header_phone: 'Phone',               // legacy
    table_header_phoneNumber: 'Phone',         // NEW
    table_header_address: 'Address',

    /* ───────── empty / toasts ───────── */
    no_results: 'No subscribers found matching your criteria.',
    refresh_start_toast: 'Refreshing subscriber list...',
    refresh_end_toast: 'Subscriber list refreshed.',

    /* ───────── status labels ───────── */
    status_active: 'Active',
    status_inactive: 'Inactive',
    status_suspended: 'Suspended',
    status_planned: 'Planned',
    status_canceled: 'Canceled',

    /* ───────── dashboard tiles ───────── */
    stats_new_subscribers: 'New Subscribers (Month)',
    stats_active_subscribers: 'Active Subscribers',
    stats_suspended_subscribers: 'Suspended Subscribers',
    stats_total_subscribers: 'Total Subscribers',
  },

  subscriber_profile: {
    /* … unchanged … */
  },
};

export default subscribers;
