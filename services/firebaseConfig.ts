import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "markitup-ai-2026.firebaseapp.com",
  projectId: "markitup-ai-2026",
  storageBucket: "markitup-ai-2026.appspot.com",
  messagingSenderId: "114085938391",
  appId: "1:114085938391:web:fbsvc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Auth instance
export const firebaseAuth = getAuth(app);

export default app;
