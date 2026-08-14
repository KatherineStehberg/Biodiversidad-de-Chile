"use client";

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function DiagnosticPricing() {
  const starterCheckoutUrl =
    'https://www.flow.cl/app/web/pagarBtnPago.php?token=v7526ff1ec2707bb0f0fd9414568d37b4a895be6';
  const proCheckoutUrl =
    'https://www.flow.cl/btn.php?token=e6397bc248704bcf10bec67e5b66e13e48f3c770';
  const businessCheckoutUrl =
    'https://www.flow.cl/btn.php?token=eacef2b537ca2e532165974b8290934744f75e88';

  return (
    <section className="py-20 bg-[#0F1115] text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Diagnóstico Ambiental Express</h2>
          <p className="text-neutral-400 mt-3">Elige el alcance que mejor se ajusta a tu proyecto.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <PricingCard title="Starter" url={starterCheckoutUrl} />
          <PricingCard title="Pro" url={proCheckoutUrl} featured />
          <PricingCard title="Business" url={businessCheckoutUrl} />
        </div>
      </div>
    </section>
  );
}

function PricingCard({ title, url, featured = false }: { title: string; url: string; featured?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={`rounded-2xl border p-6 ${featured ? 'border-green-500 bg-neutral-900' : 'border-neutral-800 bg-neutral-950'}`}>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <button type="button" onClick={() => setOpen((value) => !value)} className="mt-5 inline-flex items-center gap-2 text-sm text-neutral-300">
        Ver detalles {open ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {open && <p className="mt-3 text-sm text-neutral-400">Incluye revisión inicial, levantamiento de antecedentes y entrega de diagnóstico según el alcance contratado.</p>}
      <a href={url} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full justify-center rounded-lg bg-green-600 hover:bg-green-500 px-4 py-3 font-medium">
        Contratar
      </a>
    </article>
  );
}
