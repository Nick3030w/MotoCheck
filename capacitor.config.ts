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
  },
};

export default config;
