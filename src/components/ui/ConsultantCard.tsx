import Image from 'next/image'
import { FiArrowRight } from 'react-icons/fi'

interface ConsultantCardProps {
  id?: string;
  image: string;
  name: string;
  specialty: string;
  email?: string;
  bio?: string;
}

export default function ConsultantCard({ image, name, specialty }: ConsultantCardProps) {
  return (
    <div className="group rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-all duration-300 hover:border-neutral-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
      <div className="relative h-52 bg-neutral-900 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <span className="text-4xl font-bold text-neutral-600">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4 border-t border-neutral-800">
        <span className="text-xs font-semibold uppercase tracking-widest text-green-500/70">Consultor</span>
        <h4 className="text-base font-semibold text-white group-hover:text-green-300 transition-colors duration-200 mt-0.5">{name}</h4>
        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{specialty}</p>
        <button className="cursor-pointer mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-green-600/15 border border-green-800/30 px-4 py-2 text-sm font-semibold text-green-400 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-200">
          Ver perfil
          <FiArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
