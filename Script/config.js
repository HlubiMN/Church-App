import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import { getDatabase } from 'firebase/database';
import 'firebase/database'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDNpGo_e25JNRZ3p-IQkTw7oaTVljNOHxc",
  authDomain: "narrowgate-8649b.firebaseapp.com",
  databaseURL: "https://narrowgate-8649b-default-rtdb.firebaseio.com",
  projectId: "narrowgate-8649b",
  storageBucket: "narrowgate-8649b.appspot.com",
  messagingSenderId: "164039233310",
  appId: "1:164039233310:web:cbf1376ecfc5376249830f",
  measurementId: "G-MMQ2ZRZQYD"
};

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const databas = getDatabase();
const s = getStorage(firebase.initializeApp(firebaseConfig))
export { databas, firebase,s };