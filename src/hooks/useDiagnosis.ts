import { useState, useCallback } from "react";
import { diagnosisService } from "@/services/diagnosis.service";
import { diagnosisRepository } from "@/repositories/diagnosis.repository";
import { userRepository } from "@/repositories/user.repository";
import type { DiagnosisResult, ChatMessage } from "@/types";

interface UseDiagnosisReturn {
  result: DiagnosisResult | null;
  diagnosisId: string | null;
  loading: boolean;
  error: string | null;
  diagnoseByImage: (file: File) => Promise<string>;
  diagnoseByAudio: (file: File) => Promise<string>;
  diagnoseByChat: (messages: ChatMessage[]) => Promise<string>;
  sendChatMessage: (messages: ChatMessage[]) => Promise<string>;
  clearResult: () => void;
}

interface UseDiagnosisOptions {
  userId: string;
  motorcycleId: string;
  motorcycleInfo: string; // e.g. "Kawasaki Ninja 400 2022"
}

/**
 * Convierte un File a base64 (sin prefijo data:...)
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

export function useDiagnosis(options: UseDiagnosisOptions): UseDiagnosisReturn {
  const { userId, motorcycleId, motorcycleInfo } = options;
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Diagnóstico por imagen: analiza con Gemini y guarda solo el resultado en texto
   * (no se guarda la imagen, solo el diagnóstico)
   */
  const diagnoseByImage = useCallback(
    async (file: File): Promise<string> => {
      try {
        setLoading(true);
        setError(null);

        // Convertir imagen a base64 para enviar a Gemini
        const base64 = await fileToBase64(file);

        // Analizar con Gemini
        const diagnosisResult = await diagnosisService.diagnoseByImage(
          base64,
          file.type,
          motorcycleInfo
        );
        setResult(diagnosisResult);

        // Guardar solo el resultado del diagnóstico en Firestore (sin imagen)
        const id = await diagnosisRepository.create({
          userId,
          motorcycleId,
          type: "image",
          result: diagnosisResult,
          imageUrls: [],
          audioUrl: null,
          chatMessages: [],
        });

        setDiagnosisId(id);

        // Incrementar contador del usuario
        await userRepository.incrementDiagnostics(userId);

        return id;
      } catch (err: any) {
        const message = err.message || "Error al realizar el diagnóstico visual";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [userId, motorcycleId, motorcycleInfo]
  );

  /**
   * Diagnóstico por audio: analiza con Gemini y guarda solo el resultado en texto
   * (no se guarda el audio, solo el diagnóstico)
   */
  const diagnoseByAudio = useCallback(
    async (file: File): Promise<string> => {
      try {
        setLoading(true);
        setError(null);

        // Convertir audio a base64 para enviar a Gemini
        const base64 = await fileToBase64(file);

        // Analizar con Gemini
        const diagnosisResult = await diagnosisService.diagnoseByAudio(
          base64,
          file.type,
          motorcycleInfo
        );
        setResult(diagnosisResult);

        // Guardar solo el resultado del diagnóstico en Firestore (sin audio)
        const id = await diagnosisRepository.create({
          userId,
          motorcycleId,
          type: "audio",
          result: diagnosisResult,
          imageUrls: [],
          audioUrl: null,
          chatMessages: [],
        });

        setDiagnosisId(id);

        // Incrementar contador del usuario
        await userRepository.incrementDiagnostics(userId);

        return id;
      } catch (err: any) {
        const message = err.message || "Error al realizar el diagnóstico por audio";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [userId, motorcycleId, motorcycleInfo]
  );

  /**
   * Enviar mensaje en el chat y obtener respuesta de la IA
   */
  const sendChatMessage = useCallback(
    async (messages: ChatMessage[]): Promise<string> => {
      try {
        setError(null);
        const response = await diagnosisService.diagnoseByText(messages, motorcycleInfo);
        return response;
      } catch (err: any) {
        const message = err.message || "Error al comunicarse con la IA";
        setError(message);
        throw new Error(message);
      }
    },
    [motorcycleInfo]
  );

  /**
   * Generar diagnóstico final desde el chat y guardarlo
   */
  const diagnoseByChat = useCallback(
    async (messages: ChatMessage[]): Promise<string> => {
      try {
        setLoading(true);
        setError(null);

        // Generar diagnóstico estructurado
        const diagnosisResult = await diagnosisService.generateFinalDiagnosis(
          messages,
          motorcycleInfo
        );
        setResult(diagnosisResult);

        // Guardar en Firestore
        const id = await diagnosisRepository.create({
          userId,
          motorcycleId,
          type: "text",
          result: diagnosisResult,
          imageUrls: [],
          audioUrl: null,
          chatMessages: messages,
        });

        setDiagnosisId(id);

        // Incrementar contador del usuario
        await userRepository.incrementDiagnostics(userId);

        return id;
      } catch (err: any) {
        const message = err.message || "Error al generar el diagnóstico";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [userId, motorcycleId, motorcycleInfo]
  );

  const clearResult = useCallback(() => {
    setResult(null);
    setDiagnosisId(null);
    setError(null);
  }, []);

  return {
    result,
    diagnosisId,
    loading,
    error,
    diagnoseByImage,
    diagnoseByAudio,
    diagnoseByChat,
    sendChatMessage,
    clearResult,
  };
}
