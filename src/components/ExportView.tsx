import { ArrowLeft, Copy, CheckCircle, Lock } from 'lucide-react';
import { useState } from 'react';
import { Species, Language } from '../types';
import { WildlifePassport } from './WildlifePassport';

interface ExportViewProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  tourId: string | null;
  onBack: () => void;
  onLanguageToggle: () => void;
}

export function ExportView({ loggedSpecies, language, guideName, tourId, onBack, onLanguageToggle }: ExportViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    // This creates the custom link using their tourId
    const link = tourId ? `${window.location.origin}/tour/${tourId}` : window.location.href;
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#162b1d]">
      {/* Top nav */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-[#162b1d]/80 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'EN' ? 'Back to Guide' : 'Volver a la Guía'}
          </button>

          {/* Standard Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center rounded-full bg-white/10 p-1 gap-0.5 select-none shrink-0 border border-white/5"
          >
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${language === 'EN' ? 'bg-[#C86A27] text-white' : 'text-white/40'}`}>EN</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${language === 'ES' ? 'bg-[#C86A27] text-white' : 'text-white/40'}`}>ES</span>
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 pb-12">
        {/* Simple Instructions for the Guide */}
        <div className="text-center mb-6">
           <h2 className="text-2xl font-black text-white mb-2 font-serif">
             {language === 'EN' ? 'Tour Completed!' : '¡Tour Completado!'}
           </h2>
           <p className="text-white/70 text-sm leading-relaxed">
             {language === 'EN'
               ? 'Copy the link below and send it to your guests. They can download their free Social Story and purchase this premium Wildlife Passport.'
               : 'Copia el enlace a continuación y envíalo a tus invitados. Podrán descargar su Historia Social gratis y comprar este Pasaporte Premium.'}
           </p>
        </div>

        {/* The Faded Blur Container */}
        <div className="relative rounded-3xl overflow-hidden bg-[#162b1d] shadow-2xl ring-1 ring-white/10">
          
          {/* 1. Clear Passport Underneath */}
          <div className="select-none pointer-events-none">
            <WildlifePassport
              loggedSpecies={loggedSpecies}
              language={language}
              guideName={guideName}
            />
          </div>

          {/* 2. Gradient Blur Overlay */}
          <div
            className="absolute inset-0 backdrop-blur-md bg-[#0b170f]/50 z-10"
            style={{
              // This CSS trick keeps the top 8% crystal clear, then smoothly fades into the heavy blur by 25%
              maskImage: 'linear-gradient(to bottom, transparent 8%, black 25%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 8%, black 25%)'
            }}
          />

          {/* 3. Locked Paywall Card - Positioned at the top! */}
          <div className="absolute top-28 left-0 right-0 flex flex-col items-center p-6 text-center z-20">
            <div className="bg-[#162b1d]/95 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-xs">
              <div className="w-14 h-14 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-inner">
                <Lock className="w-7 h-7 text-[#C86A27]" />
              </div>
              <h3 className="text-white font-serif font-black text-xl mb-2">
                {language === 'EN' ? 'Premium Passport' : 'Pasaporte Premium'}
              </h3>
              <button
                onClick={handleCopyLink}
                className="w-full bg-[#C86A27] hover:bg-[#b05a1f] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied
                  ? (language === 'EN' ? 'Link Copied!' : '¡Enlace copiado!')
                  : (language === 'EN' ? 'Copy Guest Link' : 'Copiar enlace')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
