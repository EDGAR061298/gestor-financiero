// app/register/page.tsx
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hasMinLen = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLen && hasLetter && hasNumber;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("La contraseña debe tener al menos 8 caracteres y ser alfanumérica.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al registrar la cuenta");
      }

      router.push("/login?registered=true");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#0f4c75] opacity-20 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth={2}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-lg">FinSalud</span>
          </Link>
          <h2 className="text-xl font-semibold">Crea tu cuenta</h2>
          <p className="text-xs text-white/50 mt-1">Comienza a administrar tus finanzas de forma segura</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/60 mb-1">Nombre completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00d4ff]/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00d4ff]/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">Contraseña alfanumérica</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00d4ff]/50 transition-all"
            />

            <div className="mt-2 space-y-1 text-[11px]">
              <p className={hasMinLen ? "text-[#22d3a4]" : "text-white/40"}>
                {hasMinLen ? "✓" : "○"} Mínimo 8 caracteres
              </p>
              <p className={hasLetter ? "text-[#22d3a4]" : "text-white/40"}>
                {hasLetter ? "✓" : "○"} Al menos una letra
              </p>
              <p className={hasNumber ? "text-[#22d3a4]" : "text-white/40"}>
                {hasNumber ? "✓" : "○"} Al menos un número
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="w-full bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] hover:opacity-90 disabled:opacity-50 text-white font-medium rounded-xl py-2.5 text-sm transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)] mt-2"
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p className="text-center text-xs text-white/50 mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-[#00d4ff] hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}