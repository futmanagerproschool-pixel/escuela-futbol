import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Reemplaza esto con TUS credenciales de la consola de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_ID",
  appId: "TU_ID_APP"
};

// 1. Inicializamos la App
const app = initializeApp(firebaseConfig);

// 2. IMPORTANTE: Usamos "export" para que otros archivos puedan usarlo
export const db = getFirestore(app);
