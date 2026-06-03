import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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

/**
 * Detecta si estamos ejecutando en un entorno nativo (Capacitor/Android)
 */
function isNativePlatform(): boolean {
  const cap = (window as any).Capacitor;
  if (!cap) return false;
  if (typeof cap.isNativePlatform === "function") return cap.isNativePlatform();
  if (typeof cap.getPlatform === "function") return cap.getPlatform() !== "web";
  return false;
}

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
   * En nativo usa signInWithRedirect, en web usa signInWithPopup
   */
  async loginWithGoogle(): Promise<FirebaseUser> {
    if (isNativePlatform()) {
      await signInWithRedirect(auth, googleProvider);
      // El resultado se obtiene después del redirect con getRedirectResult
      const result = await getRedirectResult(auth);
      if (result?.user) {
        return result.user;
      }
      throw new Error("No se pudo completar el inicio de sesión con Google.");
    }
    const credential = await signInWithPopup(auth, googleProvider);
    return credential.user;
  },

  /**
   * Obtener resultado del redirect de Google (para plataformas nativas)
   */
  async getGoogleRedirectResult(): Promise<FirebaseUser | null> {
    const result = await getRedirectResult(auth);
    return result?.user || null;
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
