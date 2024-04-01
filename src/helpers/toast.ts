import {alert, AlertOptions, setup, toast, ToastOptions} from '@baronha/ting';

const defaultToastOptions: ToastOptions = {
  duration: 1.5,
};

const defaultAlertOptions: AlertOptions = {
  blurBackdrop: 15,
  backdropOpacity: 0.1,
  duration: 1.5,
};

setup({alert: defaultToastOptions, toast: defaultAlertOptions});

export const showToast = (options: ToastOptions) => {
  toast(options);
};

export const showAlert = (options: AlertOptions) => {
  alert(options);
};
