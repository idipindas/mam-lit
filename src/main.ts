// router.ts
import { Router } from '@vaadin/router';

// Importing web components
import './config/env-ui';
// import './components/insert-stuff/mam-insert-dialog2';
// import './components/layout/page-layout';

// Define the outlet with proper typing
const outlet: HTMLElement | null = document.getElementById('outlet');

if (outlet) {
  const router = new Router(outlet);

  router.setRoutes([
    { path: '/', component: 'env-ui' },
    { path: '/layout', component: 'page-layout' },
    { path: '/mam-dialog', component: 'mam-insert-dialog2' },
  ]);
} else {
  console.error('Router outlet not found');
}
