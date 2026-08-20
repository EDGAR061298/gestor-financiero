// app/privacidad/page.tsx
import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#080b12] text-white p-6 relative">
      <div className="max-w-3xl mx-auto py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#00d4ff] hover:underline mb-6">
          ← Volver a inicio
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Aviso de Privacidad Integral</h1>
        <p className="text-xs text-white/40 mb-8">Última actualización: Agosto 2026</p>

        <div className="space-y-6 text-sm text-white/70 leading-relaxed border-t border-white/10 pt-6">
          <section>
            <h2 className="text-white font-semibold text-base mb-2">1. Responsable del Tratamiento de Datos</h2>
            <p>
              FinSalud es responsable del tratamiento y protección de sus datos personales conforme a las leyes vigentes de protección de datos en posesión de particulares.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">2. Finalidad del Uso de Datos</h2>
            <p>
              Los datos recabados (nombre, correo electrónico, transacciones y presupuestos) son utilizados única y exclusivamente para brindar el servicio de cálculo, análisis financiero personal y autenticación segura dentro de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">3. Medidas de Seguridad y Cifrado</h2>
            <p>
              Toda la comunicación de datos se encuentra protegida bajo certificados SSL/TLS con cifrado de extremo a extremo en conexiones HTTPS. Las contraseñas de los usuarios no son legibles ni accesibles por administradores gracias al almacenamiento con algoritmos criptográficos hash.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">4. Derechos ARCO</h2>
            <p>
              Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales solicitando la eliminación de su cuenta en cualquier momento.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}