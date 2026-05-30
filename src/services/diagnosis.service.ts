import { textModel, visionModel, audioModel } from "@/config/gemini";
import type { DiagnosisResult, GeminiDiagnosisResponse, ChatMessage } from "@/types";

const DIAGNOSIS_JSON_PROMPT = `
Responde ÚNICAMENTE con un JSON válido (sin markdown, sin backticks) con esta estructura exacta:
{
  "title": "Nombre corto de la falla",
  "description": "Descripción detallada del problema",
  "severity": "leve" | "moderado" | "crítico",
  "confidence": 0-100,
  "affectedComponent": "Componente afectado",
  "causes": ["causa 1", "causa 2"],
  "symptoms": ["síntoma 1", "síntoma 2"],
  "solutions": [
    {"step": 1, "description": "Paso 1", "icon": "🔧"},
    {"step": 2, "description": "Paso 2", "icon": "⚡"}
  ],
  "estimatedCost": {
    "parts": [{"name": "Pieza", "min": 100, "max": 200}],
    "labor": {"min": 200, "max": 400}
  },
  "canDIY": true/false,
  "diyDifficulty": "fácil" | "intermedio" | "avanzado" | null,
  "diyNotes": "Notas sobre reparación casera o null"
}

Los costos deben estar en pesos colombianos (COP).
`;

/**
 * Parsea la respuesta de Gemini a un DiagnosisResult tipado
 */
function parseGeminiResponse(responseText: string): DiagnosisResult {
  // Limpiar la respuesta (a veces Gemini agrega backticks)
  let cleaned = responseText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  }
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  const parsed: GeminiDiagnosisResponse = JSON.parse(cleaned);

  // Calcular totales de costo
  let estimatedCost = null;
  if (parsed.estimatedCost) {
    const partsTotal = parsed.estimatedCost.parts.reduce(
      (acc, part) => ({ min: acc.min + part.min, max: acc.max + part.max }),
      { min: 0, max: 0 }
    );
    estimatedCost = {
      parts: parsed.estimatedCost.parts,
      labor: parsed.estimatedCost.labor,
      totalMin: partsTotal.min + parsed.estimatedCost.labor.min,
      totalMax: partsTotal.max + parsed.estimatedCost.labor.max,
      currency: "COP",
    };
  }

  return {
    title: parsed.title,
    description: parsed.description,
    severity: parsed.severity,
    confidence: parsed.confidence,
    affectedComponent: parsed.affectedComponent,
    causes: parsed.causes,
    symptoms: parsed.symptoms,
    solutions: parsed.solutions,
    estimatedCost,
    canDIY: parsed.canDIY,
    diyDifficulty: parsed.diyDifficulty,
    diyNotes: parsed.diyNotes,
  };
}

export const diagnosisService = {
  /**
   * Diagnóstico por texto (chat con IA)
   * Envía el historial de mensajes y obtiene respuesta
   */
  async diagnoseByText(
    messages: ChatMessage[],
    motorcycleInfo: string
  ): Promise<string> {
    const chat = textModel.startChat({
      history: messages.slice(0, -1).map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    const contextPrefix = motorcycleInfo
      ? `[Moto del usuario: ${motorcycleInfo}] `
      : "";

    const result = await chat.sendMessage(contextPrefix + lastMessage.content);
    return result.response.text();
  },

  /**
   * Generar diagnóstico final estructurado desde el chat
   */
  async generateFinalDiagnosis(
    chatHistory: ChatMessage[],
    motorcycleInfo: string
  ): Promise<DiagnosisResult> {
    const conversationSummary = chatHistory
      .map((msg) => `${msg.role === "user" ? "Usuario" : "IA"}: ${msg.content}`)
      .join("\n");

    const prompt = `Basándote en esta conversación sobre una falla de motocicleta${
      motorcycleInfo ? ` (${motorcycleInfo})` : ""
    }, genera un diagnóstico completo:

${conversationSummary}

${DIAGNOSIS_JSON_PROMPT}`;

    const result = await textModel.generateContent(prompt);
    return parseGeminiResponse(result.response.text());
  },

  /**
   * Diagnóstico por imagen
   */
  async diagnoseByImage(
    imageBase64: string,
    mimeType: string,
    motorcycleInfo: string
  ): Promise<DiagnosisResult> {
    const prompt = `Analiza esta imagen de una motocicleta${
      motorcycleInfo ? ` (${motorcycleInfo})` : ""
    } y genera un diagnóstico de la falla visible.

${DIAGNOSIS_JSON_PROMPT}`;

    const result = await visionModel.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType,
        },
      },
    ]);

    return parseGeminiResponse(result.response.text());
  },

  /**
   * Diagnóstico por audio
   */
  async diagnoseByAudio(
    audioBase64: string,
    mimeType: string,
    motorcycleInfo: string
  ): Promise<DiagnosisResult> {
    const prompt = `Analiza este audio de una motocicleta${
      motorcycleInfo ? ` (${motorcycleInfo})` : ""
    } e identifica ruidos anormales para generar un diagnóstico.

${DIAGNOSIS_JSON_PROMPT}`;

    const result = await audioModel.generateContent([
      prompt,
      {
        inlineData: {
          data: audioBase64,
          mimeType,
        },
      },
    ]);

    return parseGeminiResponse(result.response.text());
  },
};
