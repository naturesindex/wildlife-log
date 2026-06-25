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

// Sort by rarity and take the top 20 to fill a 5-column asymmetrical grid
  const premiumSpecies = [...loggedSpecies]
    .sort((a, b) => (b.rarityScore || 0) - (a.rarityScore || 0))
    .slice(0, 20);

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

        <div className="p-12 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-8 border-b border-[#2C3E35]/20 pb-6 mt-4">
            <h1 className="text-5xl font-black text-[#2C3E35] uppercase tracking-[0.15em] font-serif mb-2">
              Corcovado
            </h1>
            <h3 className="text-[#C86A27] font-bold tracking-[0.3em] text-lg uppercase mb-4">
              National Park • Costa Rica
            </h3>
            <div className="text-[#2C3E35]/70 text-xs tracking-widest uppercase font-bold">
              {language === 'EN' ? 'Expedition Date' : 'Fecha de Expedición'}: {new Date().toLocaleDateString(language === 'EN' ? 'en-US' : 'es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

{/* Species Gallery - Pinterest Asymmetrical Masonry Style */}
          <div className="columns-5 gap-4 flex-1 px-2">
            {premiumSpecies.map((species) => (
              <div key={species.id} className="break-inside-avoid mb-6 flex flex-col items-center">
                {/* Strict Border Frame - Natural Asymmetrical Height */}
                <div className="w-full border-[1.5px] border-[#2C3E35]/80 bg-[#F9F6F0] p-1.5 pb-3 shadow-md mb-2">
                  <img 
                    src={species.image} 
                    alt={species.nameEN} 
                    className="w-full h-auto block grayscale-[15%] sepia-[10%]" 
                  />
                </div>
                {/* Clean text underneath - no clipping! */}
                <h4 className="font-bold text-[#2C3E35] text-center text-[9px] leading-tight mb-0.5 uppercase tracking-wider px-1">
                  {language === 'EN' ? species.nameEN : species.nameES}
                </h4>
                <p className="italic text-[#2C3E35]/80 text-[8px] font-serif text-center leading-none">
                  {species.scientificName || "Species scientifica"}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Logo/Mark */}
          <div className="mt-6 text-center border-t border-[#2C3E35]/20 pt-6 pb-2">
            <p className="text-[#2C3E35]/50 text-[10px] uppercase tracking-[0.2em] font-bold">
              {language === 'EN' ? 'Official Sighting Log • Flora & Fauna' : 'Registro Oficial • Flora y Fauna'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
