// app/page.tsx
import Link from "next/link";
import PrivacyModal from "@/components/PrivacyModal";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080b12] text-white flex flex-col justify-between selection:bg-[#00d4ff]/30">
      <PrivacyModal />

      {/* Ambient Lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full bg-[#0f4c75] opacity-20 blur-[150px]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-[#1a0533] opacity-30 blur-[130px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.3)]">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">FinSalud</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-white/70 hover:text-white transition-colors font-medium px-3 py-1.5"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="text-sm bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] hover:opacity-90 text-white font-medium px-4 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)]"
          >
            Crear Cuenta
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#00d4ff] text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
          Control financiero inteligente y seguro
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.15] mb-6">
          Toma el control absoluto de tus{" "}
          <span className="bg-gradient-to-r from-[#00d4ff] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">
            finanzas personales
          </span>
        </h1>

        <p className="text-white/60 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed">
          Centraliza tus ingresos, categoriza gastos en tiempo real y calcula tu tasa de ahorro con análisis visuales diseñados para ayudarte a tomar mejores decisiones.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
          <Link
            href="/register"
            className="bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] hover:opacity-90 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_30px_rgba(0,212,255,0.25)] text-center text-sm"
          >
            Comenzar Ahora Gratis
          </Link>
          <Link
            href="/dashboard"
            className="border border-white/10 bg-white/5 hover:bg-white/10 text-white/90 font-semibold px-8 py-3.5 rounded-xl transition-all text-center text-sm"
          >
            Ver Demo en Vivo
          </Link>
        </div>

        {/* Ventajas / Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 relative overflow-hidden">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="text-base font-semibold text-white mb-2">Monitoreo en Tiempo Real</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Métricas actualizadas al instante con balances netos, cálculo de tasa de ahorro y desglose de gastos por categoría.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 relative overflow-hidden">
            <div className="text-2xl mb-3">🛡️</div>
            <h3 className="text-base font-semibold text-white mb-2">Máxima Seguridad</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Contraseñas cifradas, comunicación segura SSL/HTTPS y protección contra vulnerabilidades comunes.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 relative overflow-hidden">
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="text-base font-semibold text-white mb-2">Metas y Presupuestos</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Visualiza fácilmente en qué áreas gastas más para optimizar tu capacidad de ahorro quincenal y mensual.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 max-w-6xl mx-auto w-full px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
        <span>© {new Date().getFullYear()} FinSalud. Todos los derechos reservados.</span>
        <div className="flex gap-6">
          <Link href="/privacidad" className="hover:text-white/80 transition-colors">
            Aviso de Privacidad
          </Link>
          <Link href="/login" className="hover:text-white/80 transition-colors">
            Acceso
          </Link>
        </div>
      </footer>
    </div>
  );
}