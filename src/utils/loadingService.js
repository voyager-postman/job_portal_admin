let activeRequests = 0;
let showDelayTimer = null;
let isVisible = false;

const SHOW_DELAY_MS = 200;

let callbacks = {
  onShow: () => {},
  onHide: () => {},
};

export const registerLoadingCallbacks = (onShow, onHide) => {
  callbacks.onShow = onShow;
  callbacks.onHide = onHide;
};

export const showGlobalLoader = () => {
  activeRequests += 1;

  if (activeRequests === 1 && !showDelayTimer && !isVisible) {
    showDelayTimer = setTimeout(() => {
      showDelayTimer = null;
      if (activeRequests > 0) {
        isVisible = true;
        callbacks.onShow();
      }
    }, SHOW_DELAY_MS);
  }
};

export const hideGlobalLoader = () => {
  activeRequests = Math.max(0, activeRequests - 1);

  if (activeRequests === 0) {
    if (showDelayTimer) {
      clearTimeout(showDelayTimer);
      showDelayTimer = null;
    }

    if (isVisible) {
      isVisible = false;
      callbacks.onHide();
    }
  }
};

export const resetGlobalLoader = () => {
  activeRequests = 0;
  if (showDelayTimer) {
    clearTimeout(showDelayTimer);
    showDelayTimer = null;
  }
  if (isVisible) {
    isVisible = false;
    callbacks.onHide();
  }
};
