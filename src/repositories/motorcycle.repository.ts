import { firestoreService } from "@/services/firestore.service";
import { where } from "firebase/firestore";
import type { Motorcycle, MotorcycleFormData } from "@/types";

const COLLECTION = "motorcycles";

export const motorcycleRepository = {
  /**
   * Obtener todas las motos de un usuario
   */
  async getByUserId(userId: string): Promise<Motorcycle[]> {
    return firestoreService.getAll<Motorcycle>(COLLECTION, [
      where("userId", "==", userId),
    ]);
  },

  /**
   * Obtener una moto por ID
   */
  async getById(id: string): Promise<Motorcycle | null> {
    return firestoreService.getById<Motorcycle>(COLLECTION, id);
  },

  /**
   * Crear una nueva moto
   */
  async create(userId: string, data: MotorcycleFormData): Promise<string> {
    return firestoreService.create(COLLECTION, {
      ...data,
      userId,
    });
  },

  /**
   * Actualizar una moto
   */
  async update(id: string, data: Partial<MotorcycleFormData>): Promise<void> {
    await firestoreService.update(COLLECTION, id, data);
  },

  /**
   * Eliminar una moto
   */
  async delete(id: string): Promise<void> {
    await firestoreService.delete(COLLECTION, id);
  },
};
