import { ArrowLeft, Download } from 'lucide-react';
import { useRef, useState } from 'react';
import { toJpeg } from 'html-to-image';
import { Species, Language } from '../types';

interface PrintablePosterProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  onClose: () => void;
}

export function PrintablePoster({ loggedSpecies, language, guideName, onClose }: PrintablePosterProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Filter to just Tier 1 and 2 to keep the poster looking premium and uncluttered
  const premiumSpecies = loggedSpecies
    .filter(s => s.tier === 1 || s.tier === 2)
    .slice(0, 9); // Limit to a perfect 3x3 grid for the poster

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    try {
      // pixelRatio: 4 creates a massive, ultra-crisp image perfect for printing
      const dataUrl = await toJpeg(posterRef.current, { quality: 1.0, pixelRatio: 4 });
      const link = document.createElement('a');
      link.download = `Corcovado-Expedition-${new Date().toISOString().split('T')[0]}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate poster', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center py-10 px-4">
      {/* Controls */}
      <div className="w-full max-w-[800px] flex justify-between items-center mb-8">
        <button onClick={onClose} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-[#C86A27] text-white px-6 py-3 rounded-full font-bold hover:bg-[#b05a1f] transition-all disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          {isDownloading ? 'Generating High-Res...' : 'Download Print-Ready Poster'}
        </button>
      </div>

      {/* THE POSTER CANVAS (Fixed Aspect Ratio 3:4 for 18x24" framing) */}
      <div 
        ref={posterRef}
        className="bg-[#F9F6F0] relative overflow-hidden shadow-2xl"
        style={{ width: '800px', height: '1066px' }} // Standard 3:4 poster ratio
      >
        {/* Border / Matting */}
        <div className="absolute inset-4 border-[1px] border-[#2C3E35] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-5 border-[3px] border-[#2C3E35] pointer-events-none"></div>

        <div className="p-16 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-12">
            <h3 className="text-[#C86A27] font-bold tracking-[0.2em] text-sm uppercase mb-4">
              Nature's Index Field Log
            </h3>
            <h1 className="text-5xl font-black text-[#2C3E35] uppercase tracking-wider font-serif mb-4">
              Corcovado
            </h1>
            <div className="flex items-center justify-center gap-4 text-[#2C3E35]/70 text-sm tracking-widest uppercase">
              <span>{new Date().toLocaleDateString(language === 'EN' ? 'en-US' : 'es-ES', { month: 'long', year: 'numeric' })}</span>
              <span>•</span>
              <span>Guide: {guideName}</span>
            </div>
          </div>

          {/* Species Grid */}
          <div className="grid grid-cols-3 gap-8 flex-1">
            {premiumSpecies.map((species) => (
              <div key={species.id} className="flex flex-col items-center">
                <div className="w-full aspect-square mb-4 overflow-hidden rounded-sm border border-[#2C3E35]/10">
                  <img src={species.image} alt={species.nameEN} className="w-full h-full object-cover grayscale-[20%] sepia-[10%]" />
                </div>
                <h4 className="font-bold text-[#2C3E35] text-center text-lg leading-tight mb-1">
                  {language === 'EN' ? species.nameEN : species.nameES}
                </h4>
                <p className="italic text-[#2C3E35]/60 text-sm font-serif text-center">
                  {species.scientificName || "Species scientifica"}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Logo/Mark */}
          <div className="mt-8 text-center border-t border-[#2C3E35]/10 pt-8">
            <p className="text-[#2C3E35]/40 text-xs uppercase tracking-widest font-bold">
              Verified Sighting Log • Osa Peninsula, Costa Rica
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
