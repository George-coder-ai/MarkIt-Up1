import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { firebaseAuth } from './firebaseConfig';

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

// Debug: log the API URL in development
if (import.meta.env.DEV) {
  console.log('Using API URL:', API_URL);
}

export const authService = {
  async signup(userData: { name: string; email: string; password: string }) {
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        userData.email,
        userData.password
      );

      const idToken = await userCredential.user.getIdToken();

      // Create user profile in backend
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email.toLowerCase(),
          password: userData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // If backend signup fails, delete Firebase user
        await userCredential.user.delete();
        throw new Error(data.error || 'Signup failed');
      }

      // Store Firebase ID token
      localStorage.setItem('firebaseToken', idToken);
      localStorage.setItem('token', idToken);

      return {
        access_token: idToken,
        user: data.user
      };
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  },

  async login(credentials: { email: string; password: string }) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        credentials.email.toLowerCase(),
        credentials.password
      );

      const idToken = await userCredential.user.getIdToken();

      // Verify with backend
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email.toLowerCase(),
          idToken: idToken
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store tokens
      localStorage.setItem('firebaseToken', idToken);
      localStorage.setItem('token', idToken);

      return {
        access_token: idToken,
        user: data.user
      };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  async getCurrentUser() {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
        unsubscribe();

        if (!firebaseUser) {
          resolve(null);
          return;
        }

        try {
          const idToken = await firebaseUser.getIdToken();
          
          const response = await fetch(`${API_URL}/me`, {
            headers: {
              'Authorization': `Bearer ${idToken}`
            }
          });

          const data = await response.json();

          if (!response.ok) {
            localStorage.removeItem('firebaseToken');
            localStorage.removeItem('token');
            resolve(null);
            return;
          }

          resolve(data);
        } catch (error) {
          console.error('Failed to get current user:', error);
          resolve(null);
        }
      });
    });
  },

  async logout() {
    try {
      await signOut(firebaseAuth);
      localStorage.removeItem('firebaseToken');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};
    }
};
