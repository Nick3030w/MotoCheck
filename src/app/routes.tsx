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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: SplashScreen },
      { path: "onboarding", Component: OnboardingScreen },
      { path: "login", Component: LoginScreen },
      { path: "home", Component: HomeScreen },
      { path: "diagnose/visual", Component: VisualDiagnosisScreen },
      { path: "diagnose/audio", Component: AudioDiagnosisScreen },
      { path: "diagnose/chat", Component: ChatScreen },
      { path: "result/:id", Component: DiagnosisResultScreen },
      { path: "result/:id/workshops", Component: WorkshopsMapScreen },
      { path: "result/:id/tutorials", Component: TutorialsScreen },
      { path: "history", Component: HistoryScreen },
      { path: "settings", Component: SettingsScreen },
      { path: "settings/permissions", Component: PermissionsScreen },
      { path: "settings/support", Component: SupportScreen },
      { path: "settings/motorcycles", Component: MotorcyclesScreen },
    ],
  },
]);
