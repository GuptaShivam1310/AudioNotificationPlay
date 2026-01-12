import notifee, { AndroidImportance } from '@notifee/react-native';
// import { addTrack } from './soundService';

import messaging, {
  getMessaging,
  requestPermission,
  getToken,
  AuthorizationStatus,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import { addTrack } from './player';
import { playSoundFromUrl } from './soundService';

/**
 * Android notification channel
 */
export async function createNotificationChannel() {
  return await notifee.createChannel({
    id: 'default',
    name: 'Default Notifications',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
}

/**
 * Request permission + token
 */
export async function requestUserPermission() {
  const messaging = getMessaging();

  await notifee.requestPermission();

  const authStatus = await requestPermission(messaging, {
    alert: true,
    sound: true,
    badge: true,
  });

  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  console.log('firebase enabled', enabled);

  if (enabled) {
    const token = await getToken(messaging);
    console.log('firebase token', token);
    return token;
  }
  return null;
}

/**
 * Foreground notification
 */
export function registerForegroundHandler() {
  const messaging = getMessaging();

  return onMessage(messaging, async remoteMessage => {
    console.log('firebase Foreground Notification:', remoteMessage);

    const title =
      remoteMessage.data?.title || remoteMessage.notification?.title;

    const body =
      remoteMessage.data?.body || remoteMessage.notification?.body;
    console.log("sdlksldksd", body)
    if (body) {
      await addTrack(body);
      //  await playSoundFromUrl(body);
    }
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'default',
        pressAction: { id: 'default' },
      },
      ios: {
        sound: 'default',
      },
    });
  });
}

/**
 * Notification click handler
 */
export async function registerNotificationClickHandler() {
  const messaging = getMessaging();

  onNotificationOpenedApp(messaging, async remoteMessage => {
    console.log('firebase Opened from background:', remoteMessage);
    const body =
      remoteMessage.data?.body || remoteMessage.notification?.body;
    if (body) {
      await addTrack(body);
      // await playSoundFromUrl(body);
    }
  });

  const initialMessage = await getInitialNotification(messaging);
  if (initialMessage) {
    console.log('Opened from killed state:', initialMessage);
    const body =
      initialMessage.data?.body || initialMessage.notification?.body;
    if (body) {
      await addTrack(body);
      //  await playSoundFromUrl(body);
    }
  }

}



messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('firebase Background Notification:', remoteMessage);
  const body =
    remoteMessage.data?.body || remoteMessage.notification?.body;
  if (body) {
    await addTrack(body);
    //  await playSoundFromUrl(body);
  }
})