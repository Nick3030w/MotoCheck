import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.motocheck.app',
  appName: 'MotoCheck',
  webDir: 'dist',
  server: {
    // Permite que la app cargue recursos externos (Firebase, Gemini, etc.)
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#0F0F0F',
      showSpinner: false,
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '1009709334512-bi9h8be9sfjthleonpa6qbij97n9om3h.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
