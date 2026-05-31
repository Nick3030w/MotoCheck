import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

export function LoginScreen() {
  const navigate = useNavigate();
  const { login, register, loginWithGoogle, resetPassword, error, clearError, loading } =
    useAuthContext();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const displayError = localError || error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        if (!name.trim()) {
          setLocalError("Ingresa tu nombre completo.");
          return;
        }
        if (password.length < 6) {
          setLocalError("La contraseña debe tener al menos 6 caracteres.");
          return;
        }
        await register({ email, password, displayName: name });
      }
      navigate("/home");
    } catch {
      // Error is handled by the auth context
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError(null);
    clearError();
    try {
      await loginWithGoogle();
      navigate("/home");
    } catch {
      // Error is handled by the auth context
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setLocalError("Ingresa tu correo para recuperar la contraseña.");
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
      setLocalError(null);
    } catch {
      // Error is handled by the auth context
    }
  };

  const handleAppleLogin = () => {
    setLocalError("Inicio con Apple estará disponible próximamente.");
  };

  return (
    <div className="h-full bg-[#0F0F0F] flex flex-col px-8 pt-8 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <img src="/logo.png" alt="MotoCheck" className="w-24 h-24 object-contain" />
      </div>

      {/* Tab switcher */}
      <div className="flex bg-[#1A1A1A] rounded-2xl p-1 mb-8">
        <button
          onClick={() => {
            setIsLogin(true);
            setLocalError(null);
            clearError();
            setResetSent(false);
          }}
          className={`flex-1 py-3 rounded-xl transition-all font-[Space_Grotesk] ${
            isLogin ? "bg-[#FF6B2B] text-white" : "text-[#888888]"
          }`}
          style={{ fontWeight: 600 }}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => {
            setIsLogin(false);
            setLocalError(null);
            clearError();
            setResetSent(false);
          }}
          className={`flex-1 py-3 rounded-xl transition-all font-[Space_Grotesk] ${
            !isLogin ? "bg-[#FF6B2B] text-white" : "text-[#888888]"
          }`}
          style={{ fontWeight: 600 }}
        >
          Registrarse
        </button>
      </div>

      {/* Error message */}
      {displayError && (
        <div className="mb-4 bg-[#E74C3C]/10 border border-[#E74C3C]/30 rounded-2xl px-4 py-3">
          <p className="text-sm text-[#E74C3C]">{displayError}</p>
        </div>
      )}

      {/* Reset password success */}
      {resetSent && (
        <div className="mb-4 bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-2xl px-4 py-3">
          <p className="text-sm text-[#2ECC71]">
            Se envió un correo de recuperación a {email}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        {!isLogin && (
          <div className="bg-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3 border border-transparent focus-within:border-[#FF6B2B] transition-colors">
            <div className="w-5 h-5 text-[#888888]">👤</div>
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white placeholder:text-[#888888]"
            />
          </div>
        )}

        <div className="bg-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3 border border-transparent focus-within:border-[#FF6B2B] transition-colors">
          <Mail className="w-5 h-5 text-[#888888]" />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white placeholder:text-[#888888]"
            required
          />
        </div>

        <div className="bg-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3 border border-transparent focus-within:border-[#FF6B2B] transition-colors">
          <Lock className="w-5 h-5 text-[#888888]" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white placeholder:text-[#888888]"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[#888888] hover:text-white"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {isLogin && (
          <div className="text-right">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-[#FF6B2B] text-sm hover:text-[#FF8C5A]"
            >
              ¿Olvidé mi contraseña?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF6B2B] hover:bg-[#FF8C5A] transition-colors py-4 rounded-3xl font-[Space_Grotesk] mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ fontWeight: 600 }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{isLogin ? "Iniciando..." : "Creando cuenta..."}</span>
            </>
          ) : (
            <span>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</span>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-[#888888]/20" />
        <span className="text-[#888888] text-sm">o continúa con</span>
        <div className="flex-1 h-px bg-[#888888]/20" />
      </div>

      {/* Social buttons */}
      <div className="space-y-3 pb-8">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-colors py-4 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continuar con Google</span>
        </button>

        <button
          onClick={handleAppleLogin}
          disabled={loading}
          className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-colors py-4 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span>Continuar con Apple</span>
        </button>
      </div>
    </div>
  );
}
