import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase para Hotel Grupo Ariel
const firebaseConfig = {
  apiKey: "AIzaSyD9B8wkcyRuawXo_vvEN1nH4Mf7ltmDzJE",
  authDomain: "app-gestion-hotel.firebaseapp.com",
  projectId: "app-gestion-hotel",
  storageBucket: "app-gestion-hotel.firebasestorage.app",
  messagingSenderId: "601378772943",
  appId: "1:601378772943:web:c07e2af43159dd397324ba",
  measurementId: "G-3DBQ9PX5ND"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);
