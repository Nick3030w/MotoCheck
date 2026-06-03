import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCredential,
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
 * Detecta si estamos en un entorno nativo de Capacitor
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
   * - En nativo (Android): usa el plugin @codetrix-studio/capacitor-google-auth
   *   que muestra el selector nativo de Google y devuelve un idToken.
   *   Luego usamos ese token para autenticar con Firebase.
   * - En web: usa signInWithPopup normal de Firebase.
   */
  async loginWithGoogle(): Promise<FirebaseUser> {
    if (isNativePlatform()) {
      // Importar dinámicamente el plugin nativo
      const { GoogleAuth } = await import("@codetrix-studio/capacitor-google-auth");
      
      // Inicializar el plugin (necesario en Android)
      await GoogleAuth.initialize({
        clientId: "1009709334512-bi9h8be9sfjthleonpa6qbij97n9om3h.apps.googleusercontent.com",
        scopes: ["profile", "email"],
        grantOfflineAccess: true,
      });

      // Abrir selector nativo de cuenta Google
      const googleUser = await GoogleAuth.signIn();
      
      // Usar el idToken para autenticar con Firebase
      const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
      const result = await signInWithCredential(auth, credential);
      return result.user;
    }

    // En web, usar popup normal
    const credential = await signInWithPopup(auth, googleProvider);
    return credential.user;
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    // Si estamos en nativo, también cerrar sesión de Google
    if (isNativePlatform()) {
      try {
        const { GoogleAuth } = await import("@codetrix-studio/capacitor-google-auth");
        await GoogleAuth.signOut();
      } catch {
        // Silenciar si no estaba logueado con Google
      }
    }
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
