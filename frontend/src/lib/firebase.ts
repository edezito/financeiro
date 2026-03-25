import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  PhoneAuthProvider,
  browserLocalPersistence,
  setPersistence
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inicializa o Firebase apenas no cliente
let app: any = null;
let auth: any = null;
let googleProvider: any = null;
let phoneProvider: any = null;

if (typeof window !== 'undefined') {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    
    // Configura persistência local
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error("Erro ao configurar persistência:", error);
      });

    // Inicializa providers
    googleProvider = new GoogleAuthProvider();
    phoneProvider = new PhoneAuthProvider(auth);
    
    console.log('✅ Firebase Auth inicializado no cliente');
  } catch (error) {
    console.error("Erro ao inicializar Firebase:", error);
  }
}

export { auth, googleProvider, phoneProvider };