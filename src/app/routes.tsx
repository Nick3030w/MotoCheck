import { createBrowserRouter } from "react-router";
import { SplashScreen } from "./components/SplashScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { LoginScreen } from "./components/LoginScreen";
import { HomeScreen } from "./components/HomeScreen";
import { VisualDiagnosisScreen } from "./components/VisualDiagnosisScreen";
import { AudioDiagnosisScreen } from "./components/AudioDiagnosisScreen";
import { ChatScreen } from "./components/ChatScreen";
import { DiagnosisResultScreen } from "./components/DiagnosisResultScreen";
import { HistoryScreen } from "./components/HistoryScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { PermissionsScreen } from "./components/PermissionsScreen";
import { SupportScreen } from "./components/SupportScreen";
import { MotorcyclesScreen } from "./components/MotorcyclesScreen";
import { WorkshopsMapScreen } from "./components/WorkshopsMapScreen";
import { TutorialsScreen } from "./components/TutorialsScreen";
import { RootLayout } from "./components/RootLayout";
import { PrivateRoute } from "./components/PrivateRoute";

// Helper to wrap components with PrivateRoute
function withAuth(Component: React.ComponentType) {
  return function ProtectedComponent() {
    return (
      <PrivateRoute>
        <Component />
      </PrivateRoute>
    );
  };
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      // Public routes
      { index: true, Component: SplashScreen },
      { path: "onboarding", Component: OnboardingScreen },
      { path: "login", Component: LoginScreen },

      // Protected routes (require authentication)
      { path: "home", Component: withAuth(HomeScreen) },
      { path: "diagnose/visual", Component: withAuth(VisualDiagnosisScreen) },
      { path: "diagnose/audio", Component: withAuth(AudioDiagnosisScreen) },
      { path: "diagnose/chat", Component: withAuth(ChatScreen) },
      { path: "result/:id", Component: withAuth(DiagnosisResultScreen) },
      { path: "result/:id/workshops", Component: withAuth(WorkshopsMapScreen) },
      { path: "result/:id/tutorials", Component: withAuth(TutorialsScreen) },
      { path: "history", Component: withAuth(HistoryScreen) },
      { path: "settings", Component: withAuth(SettingsScreen) },
      { path: "settings/permissions", Component: withAuth(PermissionsScreen) },
      { path: "settings/support", Component: withAuth(SupportScreen) },
      { path: "settings/motorcycles", Component: withAuth(MotorcyclesScreen) },
    ],
  },
]);
