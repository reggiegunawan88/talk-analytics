import { configValues as config } from 'Config';
import { showNotification } from 'Modules/notification';

const errorHandler = e =>
  showNotification({
    message: (e && e.message) || 'Something went wrong',
    type: config.NOTIF_TYPE.DANGER
  });

export default errorHandler;
