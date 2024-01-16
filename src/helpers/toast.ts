import {alert, AlertOptions, setup, toast, ToastOptions} from '@baronha/ting';

const defaultToastOptions: ToastOptions = {
  duration: 1.5,
};

const defaultAlertOptions: AlertOptions = {
  duration: 1.5,
};

setup({alert: defaultToastOptions, toast: defaultAlertOptions});

export const showToast = (options: ToastOptions) => {
  toast(options);
};

export const showAlert = (options: ToastOptions) => {
  alert(options);
};
