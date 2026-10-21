import Link from 'next/link'
export default function PagoFallido() {
  return <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-950 text-white">
    <div className="max-w-lg text-center space-y-6">
      <h1 className="text-3xl font-bold">El pago aún no está confirmado</h1>
      <p>Puede estar pendiente, haber sido rechazado o cancelado. Si viste un cargo, consulta el estado de tu membresía antes de volver a pagar.</p>
      <Link className="block text-green-400 underline" href="/membresias/pago/exito">Consultar mi membresía</Link>
      <Link className="block underline" href="/membresias">Volver a los planes</Link>
      <Link className="block underline" href="/contact">Contactar a soporte</Link>
    </div>
  </main>
}
