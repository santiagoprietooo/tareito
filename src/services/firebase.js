import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAcX26B3qTZJH8V6Yjce6ds_mu4DiWsy2k",
    authDomain: "notas-y-tareas.firebaseapp.com",
    projectId: "notas-y-tareas",
    storageBucket: "notas-y-tareas.firebasestorage.app",
    messagingSenderId: "515086817327",
    appId: "1:515086817327:web:89ea6a1c1bf6a5571b8eda"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);