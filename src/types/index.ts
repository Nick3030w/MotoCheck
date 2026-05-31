// ============================================
// USER TYPES
// ============================================

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  motorcycles: string[]; // IDs de motos
  totalDiagnostics: number;
  resolvedDiagnostics: number;
}

// ============================================
// MOTORCYCLE TYPES
// ============================================

export interface Motorcycle {
  id: string;
  userId: string;
  name: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  emoji: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MotorcycleFormData = Omit<Motorcycle, "id" | "userId" | "createdAt" | "updatedAt">;

// ============================================
// DIAGNOSIS TYPES
// ============================================

export type DiagnosisType = "text" | "image" | "audio";
export type Severity = "leve" | "moderado" | "crítico";

export interface DiagnosisResult {
  title: string;
  description: string;
  severity: Severity;
  confidence: number; // 0-100
  affectedComponent: string;
  causes: string[];
  symptoms: string[];
  solutions: DiagnosisSolution[];
  estimatedCost: CostEstimate | null;
  canDIY: boolean;
  diyDifficulty: "fácil" | "intermedio" | "avanzado" | null;
  diyNotes: string | null;
}

export interface DiagnosisSolution {
  step: number;
  description: string;
  icon: string;
}

export interface CostEstimate {
  parts: { name: string; min: number; max: number }[];
  labor: { min: number; max: number };
  totalMin: number;
  totalMax: number;
  currency: string;
}

export interface Diagnosis {
  id: string;
  userId: string;
  motorcycleId: string;
  type: DiagnosisType;
  result: DiagnosisResult;
  // Media references (Firebase Storage paths)
  imageUrls: string[];
  audioUrl: string | null;
  // Chat history (for text diagnosis)
  chatMessages: ChatMessage[];
  createdAt: Date;
}

// ============================================
// CHAT TYPES
// ============================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  chips?: string[];
  // Adjuntos multimedia opcionales
  imageBase64?: string;
  imageMimeType?: string;
  audioBase64?: string;
  audioMimeType?: string;
}

// ============================================
// TUTORIAL TYPES
// ============================================

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  difficulty: "Fácil" | "Intermedio" | "Avanzado";
  author: string;
  views: number;
  likes: number;
  relatedFaults: string[];
  createdAt: Date;
}

// ============================================
// WORKSHOP TYPES
// ============================================

export interface Workshop {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  rating: number;
  reviews: number;
  specialties: string[];
  location: {
    lat: number;
    lng: number;
  };
  distance?: string; // Calculated at runtime
}

// ============================================
// AUTH TYPES
// ============================================

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

// ============================================
// GEMINI RESPONSE PARSING
// ============================================

export interface GeminiDiagnosisResponse {
  title: string;
  description: string;
  severity: Severity;
  confidence: number;
  affectedComponent: string;
  causes: string[];
  symptoms: string[];
  solutions: { step: number; description: string; icon: string }[];
  estimatedCost: {
    parts: { name: string; min: number; max: number }[];
    labor: { min: number; max: number };
  } | null;
  canDIY: boolean;
  diyDifficulty: "fácil" | "intermedio" | "avanzado" | null;
  diyNotes: string | null;
}
