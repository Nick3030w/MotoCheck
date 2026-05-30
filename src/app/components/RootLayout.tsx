import { Outlet } from "react-router";
import { AuthProvider } from "@/contexts/AuthContext";

export function RootLayout() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0F0F0F] text-white font-[Inter] overflow-hidden">
        {/* Mobile device frame */}
        <div className="max-w-[430px] h-screen mx-auto bg-[#0F0F0F] relative">
          {/* Main content */}
          <div className="h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
