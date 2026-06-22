import { CheckCircle, Copy, ArrowLeft, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Species, Language } from '../types';
import { PassportSandbox } from './PassportSandbox';
import { PrintablePoster } from './PrintablePoster';

interface ExportViewProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  tourId: string | null;
  onBack: () => void;
  onEndSession: () => void; // New prop to go back to lobby
  setLanguage: (lang: Language) => void; // New prop for the toggle
}

export function ExportView({ loggedSpecies, language, tourId, onBack, onEndSession, setLanguage }: ExportViewProps) {
  const [copied, setCopied] = useState(false);
const [showSandbox, setShowSandbox] = useState(false);
  const [showPoster, setShowPoster] = useState(false);

  if (showSandbox) {
    return (
      <PassportSandbox 
        loggedSpecies={loggedSpecies} 
        language={language} 
        guideName={guideName} 
        onBack={() => setShowSandbox(false)} 
      />
    );
  }

  if (showPoster) {
    return (
      <PrintablePoster 
        loggedSpecies={loggedSpecies} 
        language={language} 
        guideName={guideName} 
        onClose={() => setShowPoster(false)} 
      />
    );
  }

// Ensure we include the correct path for the Natures Index router
  const guestLink = tourId ? `${window.location.origin}/corcovado/tour/${tourId}` : window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(guestLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans relative" style={{ background: '#0b170f' }}>
      
      {/* Language Toggle */}
      <div className="absolute top-6 right-6 flex bg-white/10 rounded-full p-1 backdrop-blur-md">
        <button onClick={() => setLanguage('EN')} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${language === 'EN' ? 'bg-[#C86A27] text-white' : 'text-white/50'}`}>EN</button>
        <button onClick={() => setLanguage('ES')} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${language === 'ES' ? 'bg-[#C86A27] text-white' : 'text-white/50'}`}>ES</button>
      </div>

      <div className="w-full max-w-md bg-[#162b1d] p-8 rounded-3xl shadow-2xl border border-white/10 text-center mt-8">
        
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

        {/* Simplified Motivational Stats Box */}
        <div className="bg-black/30 rounded-2xl p-6 mb-8 flex flex-col items-center justify-center border border-white/5 shadow-inner">
          <p className="text-6xl font-black text-[#C86A27] mb-2">{loggedSpecies.length}</p>
          <p className="text-xs text-white/50 uppercase tracking-widest font-bold">
            {language === 'EN' ? 'Total Species Logged' : 'Especies Registradas'}
          </p>
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
          className="w-full py-4 rounded-xl font-bold text-white/70 hover:bg-white/5 transition-all flex items-center justify-center gap-2 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'EN' ? "Back to Today's Log" : 'Volver al Registro de Hoy'}
        </button>

        {/* End Session Button */}
        <button 
          onClick={onEndSession}
          className="w-full py-4 rounded-xl font-bold text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
   {language === 'EN' ? "End Session" : 'Finalizar Sesión'}
        </button>

        {/* DEV: SANDBOX TOGGLE */}
<button 
          onClick={() => setShowSandbox(true)}
          className="w-full py-4 mt-4 border-2 border-[#C86A27]/50 rounded-xl font-bold text-[#C86A27] hover:bg-[#C86A27]/10 transition-all flex items-center justify-center"
        >
          🛠️ Enter Web Sandbox (Dev)
        </button>

        <button 
          onClick={() => setShowPoster(true)}
          className="w-full py-4 mt-3 border-2 border-emerald-500/50 rounded-xl font-bold text-emerald-500 hover:bg-emerald-500/10 transition-all flex items-center justify-center"
        >
          🖼️ Preview Printable Poster (Dev)
        </button>
        
      </div>
    </div>
  );
}
