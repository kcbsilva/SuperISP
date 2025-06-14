// src/translations/index.ts
import auth from './en/auth';
import header from './en/header';
import loginPage from './en/loginPage';
import forgotPasswordPage from './en/forgotPasswordPage';
import updatePasswordPage from './en/updatePasswordPage';
import dashboard from './en/mainDashboard';
import sidebar from './en/sidebar';
import subscribers from './en/subscribers';
// Import other English translation modules as you create them
// For example:
// import settingsGlobalPage from './en/settingsGlobalPage';
// import popsPage from './en/popsPage';
// import etc...

// Combine all English translation modules into a single 'en' object
const en = {
  ...auth,
  ...header,
  ...loginPage,
  ...forgotPasswordPage,
  ...updatePasswordPage,
  ...dashboard, // dashboard.ts now likely uses keys like 'dashboard.total_subscribers_title' directly
  ...sidebar,
  ...subscribers,
  // Spread other imported page-specific modules here:
  // ...settingsGlobalPage,
  // ...popsPage,
};

const translations = {
  en,
  // pt and fr have been removed as per previous requests
};

export default translations;
