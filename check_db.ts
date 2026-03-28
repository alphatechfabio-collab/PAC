import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function check() {
  try {
    const users = await getDocs(collection(db, 'users'));
    console.log('Users:', users.docs.map(d => ({ id: d.id, email: d.data().email })));

    const athletes = await getDocs(collection(db, 'athletes'));
    console.log('Athletes:', athletes.docs.map(d => ({ id: d.id, email: d.data().email, user_id: d.data().user_id })));

    const progress = await getDocs(collection(db, 'student_technique_progress'));
    console.log('Progress:', progress.docs.map(d => ({ id: d.id, athlete_id: d.data().athlete_id, technique_id: d.data().technique_id, status: d.data().status })));

    const techniques = await getDocs(collection(db, 'techniques'));
    console.log('Techniques:', techniques.docs.map(d => ({ id: d.id, name: d.data().name, category: d.data().category })));
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}

check();
