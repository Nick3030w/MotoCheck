import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User as FirebaseUser,
  type Unsubscribe,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import type { LoginCredentials, RegisterCredentials } from "@/types";

const googleProvider = new GoogleAuthProvider();

export const authService = {
  /**
   * Registrar usuario con email y contraseña
   */
  async register({ email, password, displayName }: RegisterCredentials): Promise<FirebaseUser> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // Actualizar el nombre del usuario
    await updateProfile(credential.user, { displayName });
    return credential.user;
  },

  /**
   * Iniciar sesión con email y contraseña
   */
  async login({ email, password }: LoginCredentials): Promise<FirebaseUser> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  },

  /**
   * Iniciar sesión con Google
   */
  async loginWithGoogle(): Promise<FirebaseUser> {
    const credential = await signInWithPopup(auth, googleProvider);
    return credential.user;
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    await signOut(auth);
  },

  /**
   * Enviar email de recuperación de contraseña
   */
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  /**
   * Suscribirse a cambios de estado de autenticación
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): Unsubscribe {
    return onAuthStateChanged(auth, callback);
  },
};
