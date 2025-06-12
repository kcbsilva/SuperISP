// src/translations/en/header.ts
const header = {
  header: {
    changelog: 'Changelog',
    changelog_label: 'Version 0.1.0',
    changelog_new: 'New',
    changelog_new_desc: 'Initial release features.',
    changelog_fixes: 'Fixes',
    changelog_fixes_desc: 'Various UI adjustments.',
    changelog_improvements: 'Improvements',
    changelog_improvements_desc: 'Sidebar and dashboard layout.',
    profile: 'User Profile',
    my_account: 'My Account',
    profile_menu_item: 'Profile',
    logout_menu_item: 'Logout',
    profile_action_title: 'Logout', // This seems like a duplicate from core, decide where it belongs
    profile_action_desc: 'Logout process initiated (Not Implemented)', // Duplicate
    toggle_theme: 'Toggle theme',
  },
  search: { // Moved from dashboard.ts as it's part of the header
    placeholder: 'Search clients, equipment, elements...',
    clients_label: 'Clients',
    equipment_label: 'Equipment',
    serial_prefix: 'S/N',
    elements_label: 'Elements',
    no_results_found: 'No results found for "{term}"',
  },
};

export default header;
