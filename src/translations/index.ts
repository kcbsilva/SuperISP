// src/translations/index.ts
import core from './en/core';
import dashboard from './en/dashboard';
import sidebar from './en/sidebar';
import subscribers from './en/subscribers';
// Import other English translation modules you have created here
// For example:
// import settings from './en/settings';
// import finances from './en/finances';

// Combine all English translation modules into a single 'en' object
const en = {
  ...core,
  ...dashboard,
  ...sidebar,
  ...subscribers,
  // Spread other imported modules here:
  // ...settings,
  // ...finances,
};

const translations = {
  en,
  // pt and fr have been removed as per previous requests
};

export default translations;
