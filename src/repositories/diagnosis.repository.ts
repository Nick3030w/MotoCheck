import { firestoreService } from "@/services/firestore.service";
import { where, limit } from "firebase/firestore";
import type { Diagnosis, DiagnosisResult, DiagnosisType, ChatMessage } from "@/types";

const COLLECTION = "diagnostics";

export const diagnosisRepository = {
  /**
   * Obtener todos los diagnósticos de un usuario (ordenados por fecha)
   */
  async getByUserId(userId: string): Promise<Diagnosis[]> {
    const results = await firestoreService.getAll<Diagnosis>(COLLECTION, [
      where("userId", "==", userId),
    ]);
    // Ordenar en el cliente para evitar índices compuestos
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * Obtener diagnósticos recientes (limitados)
   */
  async getRecent(userId: string, count: number = 10): Promise<Diagnosis[]> {
    const results = await firestoreService.getAll<Diagnosis>(COLLECTION, [
      where("userId", "==", userId),
    ]);
    return results
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, count);
  },

  /**
   * Obtener un diagnóstico por ID
   */
  async getById(id: string): Promise<Diagnosis | null> {
    return firestoreService.getById<Diagnosis>(COLLECTION, id);
  },

  /**
   * Crear un nuevo diagnóstico
   */
  async create(data: {
    userId: string;
    motorcycleId: string;
    type: DiagnosisType;
    result: DiagnosisResult;
    imageUrls?: string[];
    audioUrl?: string | null;
    chatMessages?: ChatMessage[];
  }): Promise<string> {
    return firestoreService.create(COLLECTION, {
      userId: data.userId,
      motorcycleId: data.motorcycleId,
      type: data.type,
      result: data.result,
      imageUrls: data.imageUrls || [],
      audioUrl: data.audioUrl || null,
      chatMessages: data.chatMessages || [],
    });
  },

  /**
   * Eliminar un diagnóstico
   */
  async delete(id: string): Promise<void> {
    await firestoreService.delete(COLLECTION, id);
  },

  /**
   * Obtener diagnósticos por moto específica
   */
  async getByMotorcycleId(motorcycleId: string): Promise<Diagnosis[]> {
    const results = await firestoreService.getAll<Diagnosis>(COLLECTION, [
      where("motorcycleId", "==", motorcycleId),
    ]);
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
};
