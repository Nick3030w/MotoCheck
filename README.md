<p align="center">
  <img src="https://img.shields.io/badge/🏍️_MotoCheck-AI_Motorcycle_Diagnostics-FF6B2B?style=for-the-badge&labelColor=0F0F0F" alt="MotoCheck" />
</p>

<h1 align="center">🏍️ MotoCheck</h1>

<p align="center">
  <strong>Diagnóstico inteligente de motocicletas con IA</strong><br/>
  <sub>Tu mecánico experto disponible 24/7, directo en tu bolsillo.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=flat-square&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Capacitor-119EFF?style=flat-square&logo=capacitor&logoColor=white" alt="Capacitor" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

---

## 🎯 ¿Qué es MotoCheck?

MotoCheck es una aplicación móvil que utiliza **Google Gemini AI** para diagnosticar fallas mecánicas en motocicletas a través de **imágenes, audio y conversación**. Diseñada para el mercado colombiano, ofrece diagnósticos presuntivos con estimación de costos en COP, localización de talleres cercanos y tutoriales de reparación.

> **Problema que resuelve:** Miles de motociclistas no tienen acceso inmediato a un mecánico experto cuando detectan un ruido extraño, una pieza dañada o un comportamiento inusual. MotoCheck pone ese conocimiento al alcance de un tap.

---

## ⚡ Funcionalidades Principales

| Módulo | Descripción |
|--------|-------------|
| 📸 **Diagnóstico Visual** | Toma o sube una foto del componente afectado. La IA identifica fallas visibles. |
| 🎙️ **Diagnóstico por Audio** | Graba el sonido anómalo. La IA analiza patrones de ruido para identificar el origen. |
| 💬 **Chat con IA** | Conversación interactiva con un mecánico virtual que hace preguntas de seguimiento. Soporta adjuntos de imagen y audio inline. |
| 📋 **Reportes Estructurados** | Diagnóstico con severidad, confianza %, causas, síntomas, soluciones paso a paso, costos estimados y factibilidad DIY. |
| 🗺️ **Talleres Cercanos** | Mapa con geolocalización para encontrar talleres de motos cerca de ti, con navegación integrada. |
| 🎬 **Tutoriales** | Videos de reparación relacionados con la falla diagnosticada, clasificados por dificultad. |
| 🏍️ **Gestión de Motos** | Registra múltiples motocicletas para diagnósticos personalizados por marca y modelo. |
| 📊 **Historial** | Accede a diagnósticos anteriores con estadísticas de uso. |

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    CLIENTE                           │
│  React 18 + TypeScript + Tailwind CSS + Radix UI    │
│  Capacitor (Android nativo)                         │
├─────────────────────────────────────────────────────┤
│                   SERVICIOS                          │
│  ┌──────────┐  ┌───────────┐  ┌─────────────────┐  │
│  │ Firebase │  │ Gemini AI │  │ Geolocation API │  │
│  │ Auth +   │  │ 2.5 Flash │  │ + Google Maps   │  │
│  │ Firestore│  │ (REST)    │  │                 │  │
│  └──────────┘  └───────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────┤
│                  DEPLOYMENT                          │
│  Firebase Hosting (Web) + Capacitor (Android APK)   │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 18, TypeScript 6, Vite 6, Tailwind CSS 4 |
| **UI Components** | Radix UI, shadcn/ui, MUI, Lucide Icons |
| **Animaciones** | Framer Motion |
| **IA** | Google Gemini 2.5 Flash (multimodal: texto, imagen, audio) |
| **Auth & DB** | Firebase Authentication (Email + Google OAuth), Cloud Firestore |
| **Mobile** | Capacitor 6 (Android) |
| **Maps** | @vis.gl/react-google-maps + Geolocation API |
| **Routing** | React Router 7 (hash-based para compatibilidad Capacitor) |
| **Hosting** | Firebase Hosting |

---

## 🚀 Quick Start

### Prerrequisitos

- Node.js 18+
- npm o pnpm
- Android Studio (para build Android)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/motocheck.git
cd motocheck

# Instalar dependencias
npm install
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Firebase
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# Google Gemini AI
VITE_GEMINI_API_KEY=tu_gemini_api_key

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=tu_maps_api_key
```

### Desarrollo

```bash
# Servidor de desarrollo (web)
npm run dev

# Build de producción
npm run build

# Sync y abrir en Android Studio
npm run android:sync
npm run android:open

# Build completo Android
npm run android:run
```

---

## 📂 Estructura del Proyecto

```
src/
├── app/
│   └── components/       # Screens y componentes de UI
├── config/               # Firebase y Gemini AI config
├── contexts/             # AuthContext (estado de autenticación)
├── hooks/                # Custom hooks (useDiagnosis, useGeolocation, etc.)
├── services/             # Servicios de IA (diagnosis.service)
├── repositories/         # CRUD Firestore (diagnosis, motorcycle, user)
├── types/                # Interfaces TypeScript
└── lib/                  # Utilidades compartidas
```

---

## 📱 Flujo de Usuario

```
Splash → Onboarding → Login
                         │
                         ▼
                    ┌── Home ──┐
                    │          │
         ┌─────────┼──────────┼─────────┐
         ▼         ▼          ▼         ▼
      📸 Visual  🎙️ Audio  💬 Chat   🏍️ Motos
         │         │          │
         └─────────┼──────────┘
                   ▼
           📋 Resultado
            │         │
            ▼         ▼
       🗺️ Talleres  🎬 Tutoriales
```

---

## 🔒 Seguridad

- Autenticación con Firebase Auth (Email/Password + Google OAuth)
- Rutas protegidas con `PrivateRoute`
- API keys gestionadas con variables de entorno (no expuestas en código)
- Reglas de Firestore configuradas por usuario

---

## 🌎 Localización

- **Idioma:** Español (Colombia)
- **Moneda:** COP (Pesos Colombianos)
- **Región de talleres:** Bogotá, Colombia
- **IA personalizada:** El modelo responde en español con lenguaje directo y coloquial

---

## 📄 Licencia

Este proyecto es privado y de uso interno.

---

<p align="center">
  <sub>Construido con 🧡 y mucha grasa de motor</sub>
</p>
