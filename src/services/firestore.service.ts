import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  type QueryConstraint,
  type DocumentData,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

/**
 * Convierte Timestamps de Firestore a Date de JavaScript
 */
function convertTimestamps(data: DocumentData): DocumentData {
  const converted: DocumentData = {};
  for (const [key, val] of Object.entries(data)) {
    if (val instanceof Timestamp) {
      converted[key] = val.toDate();
    } else if (val && typeof val === "object" && !Array.isArray(val)) {
      converted[key] = convertTimestamps(val as DocumentData);
    } else {
      converted[key] = val;
    }
  }
  return converted;
}

export const firestoreService = {
  /**
   * Obtener un documento por ID
   */
  async getById<T>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as T;
  },

  /**
   * Obtener documentos con filtros opcionales
   */
  async getAll<T>(collectionName: string, constraints: QueryConstraint[] = []): Promise<T[]> {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
    })) as T[];
  },

  /**
   * Crear un nuevo documento (ID auto-generado)
   */
  async create<T extends DocumentData>(collectionName: string, data: T): Promise<string> {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  /**
   * Crear un documento con ID específico
   */
  async createWithId<T extends DocumentData>(
    collectionName: string,
    id: string,
    data: T
  ): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Actualizar un documento existente
   */
  async update(collectionName: string, id: string, data: Partial<DocumentData>): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Eliminar un documento
   */
  async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  },

  // Re-export query helpers for convenience
  where,
  orderBy,
  limit,
};
