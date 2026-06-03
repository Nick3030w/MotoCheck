import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services/auth.service";
import { userRepository } from "@/repositories/user.repository";
import type { User as FirebaseUser } from "firebase/auth";
import type { UserProfile, LoginCredentials, RegisterCredentials } from "@/types";

interface UseAuthReturn {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Cargar perfil de Firestore
        try {
          const userProfile = await userRepository.getProfile(firebaseUser.uid);
          if (!userProfile) {
            // Si es usuario nuevo (viene de Google), crearlo
            await userRepository.createProfile(firebaseUser);
            const newProfile = await userRepository.getProfile(firebaseUser.uid);
            setProfile(newProfile);
          } else {
            setProfile(userProfile);
          }
        } catch (err) {
          console.error("Error loading profile:", err);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setLoading(true);
      await authService.login(credentials);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setError(null);
      setLoading(true);
      const firebaseUser = await authService.register(credentials);
      // Crear perfil en Firestore
      await userRepository.createProfile(firebaseUser);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const firebaseUser = await authService.loginWithGoogle();
      // Verificar si ya tiene perfil, si no, crearlo
      const existingProfile = await userRepository.getProfile(firebaseUser.uid);
      if (!existingProfile) {
        await userRepository.createProfile(firebaseUser);
      }
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await authService.logout();
      setProfile(null);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      setError(null);
      await authService.resetPassword(email);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    profile,
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    clearError,
  };
}

/**
 * Traduce códigos de error de Firebase a mensajes en español
 */
function getErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Este correo ya está registrado.";
    case "auth/invalid-email":
      return "El correo electrónico no es válido.";
    case "auth/operation-not-allowed":
      return "Operación no permitida.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/user-disabled":
      return "Esta cuenta ha sido deshabilitada.";
    case "auth/user-not-found":
      return "No existe una cuenta con este correo.";
    case "auth/wrong-password":
      return "Contraseña incorrecta.";
    case "auth/invalid-credential":
      return "Credenciales inválidas. Verifica tu correo y contraseña.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta de nuevo más tarde.";
    case "auth/popup-closed-by-user":
      return "Se cerró la ventana de inicio de sesión.";
    case "auth/network-request-failed":
      return "Error de conexión. Verifica tu internet.";
    default:
      return "Ocurrió un error inesperado. Intenta de nuevo.";
  }
}
