import App from './app/Main.app.svelte';
import './main.css';

const target = document.getElementById('app') as Element;

if (import.meta.env.DEV && !(target instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?',
  );
}

if (import.meta.env.DEV) {
  void import('./mocks/browser.mock').then(({ worker }) => {
    // insert it into global window object, so we can debug the worker in runtime (e.g Chrome DevTools)
    window.msw = { worker };
    // start browser worker
    return worker.start({ onUnhandledRequest: 'bypass' });
  });
}

const app = new App({
  target,
});

export default app;
