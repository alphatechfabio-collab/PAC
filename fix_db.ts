import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function fix() {
  try {
    const athletes = await getDocs(collection(db, 'athletes'));
    for (const a of athletes.docs) {
      const data = a.data();
      if (data.email) {
        const userQuery = query(collection(db, 'users'), where('email', '==', data.email));
        const userDocs = await getDocs(userQuery);
        if (!userDocs.empty) {
          const correctUserId = userDocs.docs[0].id;
          if (data.user_id !== correctUserId) {
            console.log(`Fixing athlete ${data.email}: ${data.user_id} -> ${correctUserId}`);
            await updateDoc(doc(db, 'athletes', a.id), { user_id: correctUserId });
          }
        } else {
          // If user not found in users collection, and user_id == owner_id, it's a bug.
          // Reset user_id to empty string.
          if (data.user_id && data.user_id === data.owner_id && data.email !== 'alphatech.fabio@gmail.com') {
            console.log(`Resetting user_id for athlete ${data.email} (was ${data.user_id})`);
            await updateDoc(doc(db, 'athletes', a.id), { user_id: '' });
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}

fix();
