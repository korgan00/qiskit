// =============================================================================
// Shared Qiskit Scripts
// =============================================================================


import {loadScript} from '@mathigon/boost';

declare global {
  interface Window {
    Juniper: any;
  }
}

loadScript('/resources/shared/vendor/prism.js');

loadScript('/resources/shared/vendor/juniper.min.js').then(() => {
  new window.Juniper({
    selector: '.jupyter',
    repo: 'qiskit-community-qiskit-textbook-c3db9g14',
    isolateCells: false,
    msgLoading: 'Loading or None returned'
  });
});

