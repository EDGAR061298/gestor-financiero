// components/PrivacyModal.tsx
"use client";

import { useEffect, useState } from "react";

export default function PrivacyModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isAccepted = localStorage.getItem("privacy_accepted") === "true";
    if (!isAccepted) {
      const timer = setTimeout(() => setIsOpen(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("privacy_accepted", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#0d111a] p-6 shadow-[0_0_50px_rgba(0,212,255,0.15)] text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center text-sm font-bold">
            🛡️
          </div>
          <h3 className="text-lg font-semibold tracking-tight">Aviso de Privacidad y Cookies</h3>
        </div>

        <div className="max-h-60 overflow-y-auto pr-2 space-y-3 text-xs text-white/70 leading-relaxed border-y border-white/10 py-3 my-3">
          <p>
            En <strong>FinSalud</strong> valoramos tu confianza. De conformidad con las normativas de protección de datos personales, te informamos que la información financiera, de registro y transaccional recopilada en esta plataforma es utilizada exclusivamente para proveer métricas, balances y análisis personalizados.
          </p>
          <p>
            <strong>Cifrado y Seguridad:</strong> Tus contraseñas están encriptadas mediante algoritmos criptográficos robustos (hashing seguro) y la comunicación se realiza a través de canales protegidos por SSL/HTTPS.
          </p>
          <p>
            <strong>No divulgación:</strong> No transferimos, vendemos ni compartimos tu información personal ni historial financiero con terceros. Al pulsar &quot;Aceptar y Continuar&quot;, consientes el tratamiento de tus datos bajo estos términos.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={handleAccept}
            className="w-full sm:w-auto bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] hover:opacity-90 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)]"
          >
            Aceptar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
}