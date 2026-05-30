import { useState, useEffect, useCallback } from "react";
import { motorcycleRepository } from "@/repositories/motorcycle.repository";
import type { Motorcycle, MotorcycleFormData } from "@/types";

interface UseMotorcyclesReturn {
  motorcycles: Motorcycle[];
  selectedMotorcycle: Motorcycle | null;
  loading: boolean;
  error: string | null;
  addMotorcycle: (data: MotorcycleFormData) => Promise<void>;
  updateMotorcycle: (id: string, data: Partial<MotorcycleFormData>) => Promise<void>;
  deleteMotorcycle: (id: string) => Promise<void>;
  selectMotorcycle: (moto: Motorcycle) => void;
  refresh: () => Promise<void>;
}

export function useMotorcycles(userId: string | undefined): UseMotorcyclesReturn {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMotorcycles = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const motos = await motorcycleRepository.getByUserId(userId);
      setMotorcycles(motos);

      // Seleccionar la primera moto por defecto si no hay ninguna seleccionada
      if (motos.length > 0 && !selectedMotorcycle) {
        setSelectedMotorcycle(motos[0]);
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar las motos");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMotorcycles();
  }, [fetchMotorcycles]);

  const addMotorcycle = useCallback(
    async (data: MotorcycleFormData) => {
      if (!userId) return;
      try {
        setError(null);
        const id = await motorcycleRepository.create(userId, data);
        const newMoto: Motorcycle = {
          id,
          userId,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setMotorcycles((prev) => [newMoto, ...prev]);

        // Si es la primera moto, seleccionarla
        if (motorcycles.length === 0) {
          setSelectedMotorcycle(newMoto);
        }
      } catch (err: any) {
        setError(err.message || "Error al agregar la moto");
        throw err;
      }
    },
    [userId, motorcycles.length]
  );

  const updateMotorcycle = useCallback(
    async (id: string, data: Partial<MotorcycleFormData>) => {
      try {
        setError(null);
        await motorcycleRepository.update(id, data);
        setMotorcycles((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ...data, updatedAt: new Date() } : m))
        );
        // Actualizar la moto seleccionada si es la misma
        if (selectedMotorcycle?.id === id) {
          setSelectedMotorcycle((prev) => (prev ? { ...prev, ...data } : prev));
        }
      } catch (err: any) {
        setError(err.message || "Error al actualizar la moto");
        throw err;
      }
    },
    [selectedMotorcycle]
  );

  const deleteMotorcycle = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await motorcycleRepository.delete(id);
        const updated = motorcycles.filter((m) => m.id !== id);
        setMotorcycles(updated);

        // Si se eliminó la moto seleccionada, seleccionar otra
        if (selectedMotorcycle?.id === id) {
          setSelectedMotorcycle(updated.length > 0 ? updated[0] : null);
        }
      } catch (err: any) {
        setError(err.message || "Error al eliminar la moto");
        throw err;
      }
    },
    [motorcycles, selectedMotorcycle]
  );

  const selectMotorcycle = useCallback((moto: Motorcycle) => {
    setSelectedMotorcycle(moto);
  }, []);

  return {
    motorcycles,
    selectedMotorcycle,
    loading,
    error,
    addMotorcycle,
    updateMotorcycle,
    deleteMotorcycle,
    selectMotorcycle,
    refresh: fetchMotorcycles,
  };
}
