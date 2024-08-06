import { getMessaging, Message } from "firebase-admin/messaging";

export const sendMessage = async (message: Message) => {
  try {
    const response = await getMessaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};