import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVEMo4EHyRoYwV9M_knRmRkXFBLCjf234",
  authDomain: "one-store-1572f.firebaseapp.com",
  projectId: "one-store-1572f",
  storageBucket: "one-store-1572f.appspot.com",
  messagingSenderId: "226565505947",
  appId: "1:226565505947:web:51ae2d94552022a211973e",
  measurementId: "G-FYHJWMV8YX",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const db = getFirestore(app);
