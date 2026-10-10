/**
 * Installer Vue entry (built into install-dev/theme/js/install-app.js).
 */

import { createApp } from 'vue';
import App from './App.vue';

const bootstrap = window.__INSTALL_BOOTSTRAP__ || {};
createApp(App, { bootstrap }).mount('#install-app');
