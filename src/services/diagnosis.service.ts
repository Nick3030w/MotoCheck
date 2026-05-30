import { GEMINI_API_KEY, GEMINI_MODEL, GEMINI_BASE_URL, MOTOCHECK_SYSTEM_INSTRUCTION } from "@/config/gemini";
import type { DiagnosisResult, GeminiDiagnosisResponse, ChatMessage } from "@/types";

const DIAGNOSIS_JSON_PROMPT = `
Responde ÚNICAMENTE con un JSON válido (sin markdown, sin backticks, sin texto adicional) con esta estructura exacta:
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
  "canDIY": true,
  "diyDifficulty": "fácil",
  "diyNotes": "Notas sobre reparación casera o null"
}

Los costos deben estar en pesos colombianos (COP).
`;

/**
 * Llama a la API REST de Gemini directamente
 */
async function callGeminiAPI(contents: any[], systemInstruction?: string): Promise<string> {
  const url = `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body: any = { contents };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Gemini API Error:", response.status, errorData);
    throw new Error(
      errorData?.error?.message || `Error de la API de Gemini (${response.status})`
    );
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("La IA no generó una respuesta. Intenta de nuevo.");
  }

  return text;
}

/**
 * Parsea la respuesta de Gemini a un DiagnosisResult tipado
 */
function parseGeminiResponse(responseText: string): DiagnosisResult {
  let cleaned = responseText.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  const parsed: GeminiDiagnosisResponse = JSON.parse(cleaned);

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
   */
  async diagnoseByText(
    messages: ChatMessage[],
    motorcycleInfo: string
  ): Promise<string> {
    const systemPrompt = motorcycleInfo
      ? `${MOTOCHECK_SYSTEM_INSTRUCTION}\n\nLa moto del usuario es: ${motorcycleInfo}. Personaliza tus respuestas para este modelo específico.`
      : MOTOCHECK_SYSTEM_INSTRUCTION;

    // Construir historial de conversación para Gemini
    const contents = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    return callGeminiAPI(contents, systemPrompt);
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

    const contents = [{ role: "user" as const, parts: [{ text: prompt }] }];
    const responseText = await callGeminiAPI(contents, MOTOCHECK_SYSTEM_INSTRUCTION);
    return parseGeminiResponse(responseText);
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

    const contents = [
      {
        role: "user" as const,
        parts: [
          { text: prompt },
          { inlineData: { data: imageBase64, mimeType } },
        ],
      },
    ];

    const systemPrompt = `${MOTOCHECK_SYSTEM_INSTRUCTION}\n\nAnaliza imágenes para identificar fallas mecánicas visibles. Detecta desgaste, daños, fugas, corrosión u otros problemas.`;
    const responseText = await callGeminiAPI(contents, systemPrompt);
    return parseGeminiResponse(responseText);
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

    const contents = [
      {
        role: "user" as const,
        parts: [
          { text: prompt },
          { inlineData: { data: audioBase64, mimeType } },
        ],
      },
    ];

    const systemPrompt = `${MOTOCHECK_SYSTEM_INSTRUCTION}\n\nAnaliza audios para identificar ruidos anormales en motocicletas (golpeteos, chirridos, vibraciones, clics).`;
    const responseText = await callGeminiAPI(contents, systemPrompt);
    return parseGeminiResponse(responseText);
  },
};
