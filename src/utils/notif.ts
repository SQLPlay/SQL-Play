import {Notifier, NotifierComponents} from 'react-native-notifier';

export const showErrorNotif = (title: string, description?: string) => {
  return Notifier.showNotification({
    title,
    description,
    Component: NotifierComponents.Alert,
    duration: 5000,
    componentProps: {
      alertType: 'error',
    },
  });
};

export const showSuccessNotif = (title: string, description?: string) => {
  return Notifier.showNotification({
    title,
    description,
    duration: 5000,
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType: 'success',
    },
  });
};
