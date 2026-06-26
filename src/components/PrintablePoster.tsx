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

  const premiumSpecies = [...loggedSpecies]
    .sort((a, b) => (b.rarityScore || 0) - (a.rarityScore || 0))
    .slice(0, 20);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    try {
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

      {/* POSTER CANVAS — 3:4 ratio for 18×24" */}
      <div
        ref={posterRef}
        style={{
          width: '800px',
          height: '1066px',
          backgroundColor: '#FAF7F2',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Thin outer border inset */}
        <div style={{
          position: 'absolute', inset: '10px',
          border: '1.5px solid rgba(44,62,53,0.18)',
          pointerEvents: 'none', zIndex: 10,
        }} />

        <div style={{ padding: '28px 28px 20px 28px', height: '100%', display: 'flex', flexDirection: 'column' }}>

          {/* ── HEADER ── */}
          <div style={{ textAlign: 'center', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid rgba(44,62,53,0.15)' }}>
            <div style={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 900,
              fontSize: '72px',
              letterSpacing: '0.12em',
              color: '#1C2B22',
              lineHeight: 1,
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}>
              Corcovado
            </div>
            <div style={{
              fontFamily: '"Georgia", serif',
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '0.32em',
              color: '#C86A27',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              National Park • Costa Rica
            </div>
            <div style={{
              fontFamily: 'sans-serif',
              fontWeight: 600,
              fontSize: '11px',
              letterSpacing: '0.22em',
              color: 'rgba(44,62,53,0.55)',
              textTransform: 'uppercase',
            }}>
              {new Date().toLocaleDateString(language === 'EN' ? 'en-US' : 'es-ES', {
                month: 'long', day: 'numeric', year: 'numeric'
              }).toUpperCase()}
            </div>
          </div>

          {/* ── MASONRY GRID ── */}
          <div style={{
            columns: '5',
            columnGap: '6px',
            flex: 1,
            overflow: 'hidden',
          }}>
            {premiumSpecies.map((species) => {
              const label = language === 'EN' ? species.nameEN : species.nameES;
              const sci = species.scientificName || '';
              return (
                <div
                  key={species.id}
                  style={{
                    breakInside: 'avoid',
                    marginBottom: '6px',
                    position: 'relative',
                    display: 'block',
                  }}
                >
                  {/* Photo — natural aspect ratio, no forced height */}
                  <img
                    src={species.image}
                    alt={label}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      filter: 'sepia(8%) saturate(105%)',
                    }}
                  />
                  {/* Gradient scrim + label overlaid on photo */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(20,30,24,0.78) 0%, rgba(20,30,24,0.0) 100%)',
                    padding: '18px 6px 5px 6px',
                  }}>
                    <div style={{
                      fontFamily: 'sans-serif',
                      fontWeight: 700,
                      fontSize: '7.5px',
                      letterSpacing: '0.08em',
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                    }}>
                      {label}
                    </div>
                    {sci && (
                      <div style={{
                        fontFamily: '"Georgia", serif',
                        fontStyle: 'italic',
                        fontSize: '6.5px',
                        color: 'rgba(255,255,255,0.75)',
                        textAlign: 'center',
                        lineHeight: 1.2,
                        marginTop: '1px',
                      }}>
                        {sci}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── FOOTER ── */}
          <div style={{
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(44,62,53,0.15)',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'sans-serif',
              fontWeight: 700,
              fontSize: '9px',
              letterSpacing: '0.25em',
              color: 'rgba(44,62,53,0.4)',
              textTransform: 'uppercase',
            }}>
              {language === 'EN'
                ? 'Official Sighting Log • Flora & Fauna'
                : 'Registro Oficial • Flora y Fauna'}
              {guideName && ` • ${guideName}`}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}



