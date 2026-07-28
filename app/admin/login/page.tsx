"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, KeyRound } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Invalid credentials");
      }

      toast.success(`Welcome back, ${json.data.name || "Admin"}!`);
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to log in");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-stone-800/90 border border-stone-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xs">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#B67B5C]/20 text-[#B67B5C] rounded-2xl mb-4 border border-[#B67B5C]/30 shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Premika Admin</h1>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            Sign in to access Premika Management Portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 size-4 text-stone-400" />
              <input
                type="email"
                required
                placeholder="admin@premika.shop"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#B67B5C] focus:ring-1 focus:ring-[#B67B5C] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 size-4 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#B67B5C] focus:ring-1 focus:ring-[#B67B5C] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-200 transition"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-stone-700 bg-stone-900 text-[#B67B5C] focus:ring-[#B67B5C]"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="text-[#E0BCA2] hover:underline focus:outline-none"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B67B5C] hover:bg-[#8B5A3C] text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Forgot Password UI Modal Placeholder */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
            onClick={() => setIsForgotModalOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-stone-800 border border-stone-700 rounded-2xl p-6 shadow-2xl z-10 text-stone-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#B67B5C]/20 text-[#B67B5C] rounded-xl">
                <KeyRound size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Reset Password</h3>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Password reset links must be issued by a Super Admin. Please contact your system administrator to request a credential reset.
            </p>
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="w-full bg-stone-700 hover:bg-stone-600 text-white text-xs font-semibold py-2 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
