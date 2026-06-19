import { ArrowLeft, Copy, Download, CheckCircle, Lock } from 'lucide-react';
import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Species, Language } from '../types';
import { WildlifePassport } from './WildlifePassport';
import { SocialStory } from './SocialStory';


interface ExportViewProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  tourId: string | null;
  onBack: () => void;
}

export function ExportView({ loggedSpecies, language, guideName, tourId, onBack }: ExportViewProps) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'passport' | 'story'>('passport');
  const [exportLang, setExportLang] = useState<Language>('EN'); 

  const handleCopyLink = () => {
    // This creates the custom link using their tourId!
    const link = tourId ? `${window.location.origin}/tour/${tourId}` : window.location.href;
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!exportRef.current) return;
    
    try {
     const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        backgroundColor: '#162b1d', 
        // 1. Set pixelRatio to 4 or 5 for much higher sharpness
        pixelRatio: 4, 
        // 2. Ensure it's not cutting off anything by specifying the width
        width: exportRef.current.offsetWidth * 4,
        height: exportRef.current.offsetHeight * 4,
        style: {
          transform: 'scale(4)',
          transformOrigin: 'top left',
          width: exportRef.current.offsetWidth + 'px',
          height: exportRef.current.offsetHeight + 'px',
        }
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = activeTab === 'passport' ? 'wildlife-passport.png' : 'social-story.png';
      link.click();

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };
  
  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom, #162b1d, #0b170f)' }}
    >
      {/* Top nav */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-[#162b1d]/80 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Guide
          </button>
          <span className="text-white/40 text-sm">
            {loggedSpecies.length} species logged
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5 pb-12">
        
        {/* Asset Type Switcher */}
        <div className="flex rounded-2xl bg-white/5 border border-white/10 p-1 mb-3">
          <button
            onClick={() => setActiveTab('passport')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'passport' ? 'bg-white/15 text-white' : 'text-white/40'
            }`}
          >
            Wildlife Passport
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'story' ? 'bg-white/15 text-white' : 'text-white/40'
            }`}
          >
            Social Story
          </button>
        </div>

        {/* Language Version Switcher */}
        <div className="flex rounded-2xl bg-white/5 border border-white/10 p-1 mb-6">
          <button
            onClick={() => setExportLang('EN')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              exportLang === 'EN' ? 'bg-[#4A7A5A] text-white' : 'text-white/40'
            }`}
          >
            English Version
          </button>
          <button
            onClick={() => setExportLang('ES')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              exportLang === 'ES' ? 'bg-[#4A7A5A] text-white' : 'text-white/40'
            }`}
          >
            Versión en Español
          </button>
        </div>

{/* The Camera Target Wrapper */}
      <div ref={exportRef} className="relative rounded-3xl overflow-hidden bg-[#162b1d]">
        {activeTab === 'passport' ? (
          <>
            <div className="blur-md opacity-50 select-none pointer-events-none transition-all duration-500">
              <WildlifePassport
                loggedSpecies={loggedSpecies}
                language={exportLang} 
                guideName={guideName}
              />
            </div>
            
            {/* Paywall Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-black/10">
              <div className="bg-[#162b1d]/90 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-xs">
                <div className="w-14 h-14 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-inner">
                  <Lock className="w-7 h-7 text-[#C86A27]" />
                </div>
                <h3 className="text-white font-serif font-black text-xl mb-2">
                  {language === 'EN' ? 'Premium Passport' : 'Pasaporte Premium'}
                </h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  {language === 'EN' 
                    ? 'Send the link to your guests so they can purchase their high-resolution wildlife passport!' 
                    : '¡Envía el enlace a tus invitados para que puedan comprar su pasaporte de alta resolución!'}
                </p>
                <button
                  onClick={handleCopyLink}
                  className="w-full bg-[#C86A27] hover:bg-[#b05a1f] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied 
                    ? (language === 'EN' ? 'Link Copied!' : '¡Enlace copiado!') 
                    : (language === 'EN' ? 'Copy Guest Link' : 'Copiar enlace')}
                </button>
              </div>
            </div>
          </>
        ) : (
          <SocialStory
            loggedSpecies={loggedSpecies}
            language={exportLang} 
            guideName={guideName}
            totalLogged={loggedSpecies.length}
          />
        )}
      </div>

      {/* Action buttons */}
        <div className="flex gap-3 mt-5 justify-center">
          {activeTab === 'story' ? (
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 text-white font-semibold text-sm py-3.5 px-12 rounded-2xl transition-all active:scale-95"
              style={{ backgroundColor: downloaded ? '#4ade80' : '#C86A27' }}
            >
              {downloaded ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Story</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 text-white font-semibold text-sm py-3.5 px-8 rounded-2xl transition-all active:scale-95"
              style={{ backgroundColor: copied ? '#4ade80' : '#4A7256' }}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>{language === 'EN' ? 'Link Copied!' : '¡Enlace Copiado!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{language === 'EN' ? 'Copy Link for Guests' : 'Copiar Enlace para Invitados'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
