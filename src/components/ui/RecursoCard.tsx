import Image from 'next/image'
import { FiArrowRight } from 'react-icons/fi'

interface RecursoCardProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
}

export default function RecursoCard({ image, title, description, buttonText }: RecursoCardProps) {
  return (
    <div className="group rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-all duration-300 hover:border-neutral-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
      <div className="relative h-44 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
      </div>
      <div className="p-4 border-t border-neutral-800">
        <h4 className="text-base font-semibold text-white group-hover:text-green-300 transition-colors duration-200">{title}</h4>
        <p className="text-sm text-gray-500 mt-1 leading-snug">{description}</p>
        <button className="cursor-pointer mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-green-600/15 border border-green-800/30 px-4 py-2 text-sm font-semibold text-green-400 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-200">
          {buttonText}
          <FiArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
