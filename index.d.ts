import { SetupWorker } from 'msw';

declare global {
  interface Window {
    msw: {
      worker: SetupWorker;
    };
  }
}
