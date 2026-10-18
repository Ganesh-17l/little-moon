// Little Moon PWA Service Worker Registration & Lifecycle Manager

const updateListeners = new Set();
let swRegistration = null;
let waitingWorker = null;
let isRefreshing = false;
let isUpdateAvailable = false;

function notifyListeners(isAvailable) {
  isUpdateAvailable = isAvailable;
  updateListeners.forEach((callback) => {
    try {
      callback({
        isUpdateAvailable,
        applyUpdate,
        waitingWorker,
      });
    } catch (err) {
      console.error('[SW Registration] Error in update listener:', err);
    }
  });
}

/**
 * Register the Service Worker (runs on web, safely skipped on native Capacitor)
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Safety check: Avoid registering Service Worker inside native Capacitor Android/iOS container
  const isCapacitorNative =
    window.Capacitor &&
    typeof window.Capacitor.isNativePlatform === 'function' &&
    window.Capacitor.isNativePlatform();

  if (isCapacitorNative) {
    console.log('[SW] Running inside Capacitor native shell, skipping web service worker.');
    return;
  }

  window.addEventListener('load', () => {
    // Determine SW URL relative to current location
    const swUrl = '/sw.js';

    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        swRegistration = reg;
        console.log('[SW] Registered successfully with scope:', reg.scope);

        // Case 1: A service worker is already waiting (e.g., from a previous visit)
        if (reg.waiting && navigator.serviceWorker.controller) {
          waitingWorker = reg.waiting;
          notifyListeners(true);
        }

        // Case 2: A new service worker is found
        reg.addEventListener('updatefound', () => {
          const installingWorker = reg.installing;
          if (!installingWorker) return;

          console.log('[SW] New service worker installing...');

          installingWorker.addEventListener('statechange', () => {
            console.log('[SW] Installing worker state changed to:', installingWorker.state);

            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // There is an existing active controller, so this is an update!
                console.log('[SW] Update available! Waiting for user action.');
                waitingWorker = installingWorker;
                notifyListeners(true);
              } else {
                // First-time install: assets are cached, silent success
                console.log('[SW] Initial content cached for offline use.');
              }
            }
          });
        });
      })
      .catch((err) => {
        console.warn('[SW] Service worker registration failed:', err);
      });

    // Listen for controller changes (when SKIP_WAITING is invoked and new SW activates)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (isRefreshing) return;
      isRefreshing = true;
      console.log('[SW] Controller changed. Reloading page for latest assets...');
      window.location.reload();
    });

    // Automatically check for SW updates when user returns to the tab
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && swRegistration) {
        swRegistration.update().catch((err) => {
          console.warn('[SW] Periodic update check failed:', err);
        });
      }
    });

    // Check for test mode query parameter (?test-update=true)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test-update') === 'true' || urlParams.get('test-update') === '1') {
      console.log('[SW TEST] Test update param detected in URL. Simulating update in 1 second.');
      setTimeout(() => {
        simulateUpdateAvailable();
      }, 1000);
    }
  });

  // Expose test helper on window for debugging & verification
  window.__SW_TEST__ = {
    simulateUpdateAvailable: () => simulateUpdateAvailable(),
    dismissUpdate: () => dismissUpdate(),
    checkUpdate: () => swRegistration && swRegistration.update(),
    applyUpdate: () => applyUpdate(),
    getStatus: () => ({
      hasServiceWorker: 'serviceWorker' in navigator,
      controller: Boolean(navigator.serviceWorker?.controller),
      waiting: Boolean(waitingWorker),
      isUpdateAvailable,
      registration: Boolean(swRegistration),
    }),
  };
}

/**
 * Apply the pending update safely and reload
 */
export function applyUpdate() {
  if (waitingWorker) {
    console.log('[SW] Posting SKIP_WAITING to waiting worker...');
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });

    // Fallback: reload after 1.5 seconds if controllerchange didn't trigger
    setTimeout(() => {
      if (!isRefreshing) {
        isRefreshing = true;
        window.location.reload();
      }
    }, 1500);
  } else {
    // If simulated or no waiting worker found, reload safely
    window.location.reload();
  }
}

/**
 * Dismiss the current update notification for this session
 */
export function dismissUpdate() {
  notifyListeners(false);
}

/**
 * Subscribe to update status changes
 */
export function onServiceWorkerUpdate(callback) {
  updateListeners.add(callback);
  // Immediate call with current state
  callback({
    isUpdateAvailable,
    applyUpdate,
    waitingWorker,
  });

  return () => {
    updateListeners.delete(callback);
  };
}

/**
 * Dev / Local Testing simulator
 */
export function simulateUpdateAvailable() {
  console.log('[SW TEST] Simulating new version available.');
  notifyListeners(true);
}
