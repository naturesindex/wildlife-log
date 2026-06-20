import { CheckCircle, Copy, ArrowLeft, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Species, Language } from '../types';

interface ExportViewProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  tourId: string | null;
  onBack: () => void;
  onLanguageToggle: () => void;
}

export function ExportView({ loggedSpecies, language, tourId, onBack }: ExportViewProps) {
  const [copied, setCopied] = useState(false);

  // Fallback to the current window URL if test mode doesn't have a tourId
  const guestLink = tourId ? `${window.location.origin}/tour/${tourId}` : window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(guestLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find how many "Tier 1" (Highlights) they saw!
  const tier1Count = loggedSpecies.filter(s => s.tier === 1).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans" style={{ background: '#0b170f' }}>
      <div className="w-full max-w-md bg-[#162b1d] p-8 rounded-3xl shadow-2xl border border-white/10 text-center">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-500/20 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-white mb-2">
          {language === 'EN' ? 'Tour Completed!' : '¡Tour Completado!'}
        </h1>
        <p className="text-white/70 mb-8 text-sm leading-relaxed">
          {language === 'EN' 
            ? 'Great job out there. Share this link with your guests so they can access their digital passport.'
            : 'Buen trabajo. Comparte este enlace con tus invitados para que accedan a su pasaporte digital.'}
        </p>

        {/* Motivational Stats Box */}
        <div className="bg-black/30 rounded-2xl p-4 mb-8 flex items-center justify-around border border-white/5 shadow-inner">
          <div className="text-center w-1/2">
            <p className="text-4xl font-black text-[#C86A27] mb-1">{loggedSpecies.length}</p>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
              {language === 'EN' ? 'Total Species' : 'Especies Totales'}
            </p>
          </div>
          <div className="w-px h-12 bg-white/10"></div>
          <div className="text-center w-1/2">
            <p className="text-4xl font-black text-emerald-400 flex items-center justify-center gap-1 mb-1">
              {tier1Count} <Trophy className="w-6 h-6 mb-1 text-emerald-500" />
            </p>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
              {language === 'EN' ? 'Rare Finds' : 'Hallazgos Raros'}
            </p>
          </div>
        </div>

        {/* The Link Button */}
        <button 
          onClick={handleCopyLink}
          className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-3 mb-6
            ${copied ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-[#C86A27] text-white hover:bg-[#b05a1f] active:scale-95 shadow-[#C86A27]/20'}`}
        >
          {copied ? <CheckCircle className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
          {copied 
            ? (language === 'EN' ? 'Guest Link Copied!' : '¡Enlace Copiado!')
            : (language === 'EN' ? 'Copy Guest Link' : 'Copiar Enlace')}
        </button>

        {/* Back Button */}
        <button 
          onClick={onBack}
          className="text-white/40 hover:text-white transition-colors flex items-center justify-center gap-2 w-full font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'EN' ? 'Back to Portal Lobby' : 'Volver al Inicio'}
        </button>
        
      </div>
    </div>
  );
}
