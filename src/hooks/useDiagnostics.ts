import { useState, useEffect, useCallback } from "react";
import { diagnosisRepository } from "@/repositories/diagnosis.repository";
import type { Diagnosis } from "@/types";

interface UseDiagnosticsReturn {
  diagnostics: Diagnosis[];
  loading: boolean;
  error: string | null;
  getDiagnosisById: (id: string) => Promise<Diagnosis | null>;
  deleteDiagnosis: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useDiagnostics(userId: string | undefined): UseDiagnosticsReturn {
  const [diagnostics, setDiagnostics] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagnostics = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await diagnosisRepository.getByUserId(userId);
      setDiagnostics(results);
    } catch (err: any) {
      setError(err.message || "Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDiagnostics();
  }, [fetchDiagnostics]);

  const getDiagnosisById = useCallback(async (id: string): Promise<Diagnosis | null> => {
    try {
      return await diagnosisRepository.getById(id);
    } catch (err: any) {
      setError(err.message || "Error al cargar el diagnóstico");
      return null;
    }
  }, []);

  const deleteDiagnosis = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await diagnosisRepository.delete(id);
        setDiagnostics((prev) => prev.filter((d) => d.id !== id));
      } catch (err: any) {
        setError(err.message || "Error al eliminar el diagnóstico");
        throw err;
      }
    },
    []
  );

  return {
    diagnostics,
    loading,
    error,
    getDiagnosisById,
    deleteDiagnosis,
    refresh: fetchDiagnostics,
  };
}
