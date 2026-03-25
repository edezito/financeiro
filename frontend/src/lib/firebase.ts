import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  PhoneAuthProvider,
  browserLocalPersistence,
  setPersistence,
  Auth
} from "firebase/auth";

interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;
let phoneProvider: PhoneAuthProvider | undefined;

// Inicializa apenas se a API Key estiver presente e estiver no navegador
if (firebaseConfig.apiKey && typeof window !== 'undefined') {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Configura persistência local
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error("Erro ao configurar persistência:", error);
      });

    googleProvider = new GoogleAuthProvider();
    phoneProvider = new PhoneAuthProvider(auth);
    
    console.log('✅ Firebase Auth inicializado no cliente');
  } catch (error) {
    console.error("Erro ao inicializar Firebase:", error);
  }
}

export { auth, googleProvider, phoneProvider };