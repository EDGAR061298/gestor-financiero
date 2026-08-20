// app/recuperar-password/page.tsx
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simulación de envío de correo de restablecimiento
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch {
      setError("Error al procesar la solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#0f4c75] opacity-25 blur-[140px]" />
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
          <h2 className="text-xl font-semibold">Recuperar Contraseña</h2>
          <p className="text-xs text-white/50 mt-1">
            Ingresa tu correo para recibir un enlace de restablecimiento
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="p-4 rounded-xl bg-[#22d3a4]/10 border border-[#22d3a4]/30 text-[#22d3a4] text-xs leading-relaxed">
              Si el correo <strong>{email}</strong> está registrado, hemos enviado las instrucciones para restablecer tu contraseña. Revisa tu bandeja de entrada o spam.
            </div>
            <Link
              href="/login"
              className="inline-block w-full bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white font-medium rounded-xl py-2.5 text-sm transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)]"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] hover:opacity-90 disabled:opacity-50 text-white font-medium rounded-xl py-2.5 text-sm transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)]"
            >
              {loading ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>

            <p className="text-center text-xs text-white/50 mt-4">
              <Link href="/login" className="text-[#00d4ff] hover:underline">
                Regresar al Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}