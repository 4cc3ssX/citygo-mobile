import {AlertOptions, setup, ToastOptions} from '@baronha/ting';

export const DEFAULT_TOAST_OPTIONS: ToastOptions = {
  duration: 1.5,
};

export const DEFAULT_ALERT_OPTIONS: AlertOptions = {
  blurBackdrop: 15,
  backdropOpacity: 0.1,
  duration: 1.5,
};

setup({alert: DEFAULT_TOAST_OPTIONS, toast: DEFAULT_ALERT_OPTIONS});
