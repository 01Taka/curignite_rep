// 通知の許可をリクエストし、トークンを取得

import { getToken } from "firebase/messaging";
import { messaging } from "../../firebase/firebase";

// 通知の許可をリクエストし、トークンを取得
export const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        const token = await getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY' });
        console.log('FCM Token:', token);
        // トークンをサーバーに送信して保存する
        localStorage.setItem('fcmToken', token);
      } else {
        console.log('Notification permission denied.');
      }
    } catch (error) {
      console.error('Unable to get permission to notify.', error);
    }
};