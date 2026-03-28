import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Academy } from '../types';

export const sendTelegramNotification = async (academyId: string, message: string) => {
  try {
    const academyRef = doc(db, 'academies', academyId);
    const academySnap = await getDoc(academyRef);
    
    if (!academySnap.exists()) return;
    
    const academyData = academySnap.data() as Academy;
    const { telegram_bot_token, telegram_chat_id } = academyData;
    
    if (!telegram_bot_token || !telegram_chat_id) {
      console.warn('Telegram notification not sent: missing token or chat ID for academy', academyId);
      return;
    }
    
    const url = `https://api.telegram.org/bot${telegram_bot_token}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegram_chat_id,
        text: message,
        parse_mode: 'HTML',
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to send Telegram notification:', errorText);
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
};
