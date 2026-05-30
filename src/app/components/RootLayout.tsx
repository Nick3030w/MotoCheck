import { Outlet } from "react-router";
import { AuthProvider } from "@/contexts/AuthContext";

export function RootLayout() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0F0F0F] text-white font-[Inter] overflow-hidden">
        {/* Mobile device frame */}
        <div className="max-w-[430px] h-screen mx-auto bg-[#0F0F0F] relative">
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-11 bg-[#0F0F0F] z-50 flex items-center justify-between px-6 pt-2">
            <span className="text-sm">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-3" viewBox="0 0 16 12" fill="white">
                <rect x="0" y="0" width="5" height="12" opacity="0.4"/>
                <rect x="6" y="2" width="4" height="10" opacity="0.7"/>
                <rect x="11" y="4" width="5" height="8"/>
              </svg>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="white">
                <path d="M2 6h12v4H2z" opacity="0.4"/>
                <path d="M14 7h1v2h-1z"/>
                <rect x="3" y="7" width="10" height="2"/>
              </svg>
            </div>
          </div>

          {/* Main content */}
          <div className="h-full pt-11 pb-8">
            <Outlet />
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
    </AuthProvider>
  );
}
