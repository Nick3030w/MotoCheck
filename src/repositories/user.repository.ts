import { firestoreService } from "@/services/firestore.service";
import type { UserProfile } from "@/types";
import type { User as FirebaseUser } from "firebase/auth";

const COLLECTION = "users";

export const userRepository = {
  /**
   * Crear perfil de usuario en Firestore (se llama después del registro)
   */
  async createProfile(firebaseUser: FirebaseUser): Promise<void> {
    const profile: Omit<UserProfile, "createdAt" | "updatedAt"> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || "",
      photoURL: firebaseUser.photoURL,
      motorcycles: [],
      totalDiagnostics: 0,
      resolvedDiagnostics: 0,
    };

    await firestoreService.createWithId(COLLECTION, firebaseUser.uid, profile);
  },

  /**
   * Obtener perfil de usuario por UID
   */
  async getProfile(uid: string): Promise<UserProfile | null> {
    return firestoreService.getById<UserProfile>(COLLECTION, uid);
  },

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    await firestoreService.update(COLLECTION, uid, data);
  },

  /**
   * Incrementar contador de diagnósticos
   */
  async incrementDiagnostics(uid: string): Promise<void> {
    const profile = await this.getProfile(uid);
    if (profile) {
      await firestoreService.update(COLLECTION, uid, {
        totalDiagnostics: profile.totalDiagnostics + 1,
      });
    }
  },

  /**
   * Incrementar contador de diagnósticos resueltos
   */
  async incrementResolved(uid: string): Promise<void> {
    const profile = await this.getProfile(uid);
    if (profile) {
      await firestoreService.update(COLLECTION, uid, {
        resolvedDiagnostics: profile.resolvedDiagnostics + 1,
      });
    }
  },
};
