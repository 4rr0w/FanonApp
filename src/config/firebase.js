import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAKMpkaKdDTBlfl1gMZKOygPw50BBCpGAk',
  authDomain: 'fanon-dfde1.firebaseapp.com',
  projectId: 'fanon-dfde1',
  storageBucket: 'fanon-dfde1.appspot.com',
  messagingSenderId: '342053614567',
  appId: '1:342053614567:web:6a77254e57a26877d5c342',
  measurementId: 'G-E848BSKB1T',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
