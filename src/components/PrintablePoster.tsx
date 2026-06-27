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

// Estimate aspect ratio from known photo orientations
// Falls back to 1.0 (square) if unknown
function estimateAspectRatio(species: Species): number {
  // You can enrich this later with actual metadata
  // For now we use a heuristic: rarityScore > 80 = tall wildlife shots
  const score = species.rarityScore || 50;
  if (score > 85) return 0.72; // tall portrait (bird on branch, sloth)
  if (score > 70) return 1.1;  // slight landscape
  return 0.9;                  // near-square default
}

const NUM_COLS = 4;
const GAP = 7; // px between photos and columns

export function PrintablePoster({ loggedSpecies, language, guideName, onClose }: PrintablePosterProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

const POSTER_W = 800;
  const POSTER_H = 1066;
  const PADDING = 28;
  const HEADER_H = 118; // approx header + border
  const GRID_H = POSTER_H - PADDING * 2 - HEADER_H;
  const COL_W = (POSTER_W - PADDING * 2 - GAP * (NUM_COLS - 1)) / NUM_COLS;

  // Sort by rarity descending
  const sorted = [...loggedSpecies]
    .sort((a, b) => (b.rarityScore || 0) - (a.rarityScore || 0));

  // Greedy column-fill: assign each species to the shortest column
  const colHeights = Array(NUM_COLS).fill(0);
  const columns: Species[][] = Array.from({ length: NUM_COLS }, () => []);

  for (const species of sorted) {
    const ar = estimateAspectRatio(species);
    const imgH = COL_W / ar;
    // Find shortest column
    const minIdx = colHeights.indexOf(Math.min(...colHeights));
  // Only add if it fits (increased buffer to fit more species!)
    if (colHeights[minIdx] + imgH + GAP <= GRID_H + 120) {
      columns[minIdx].push(species);
      colHeights[minIdx] += imgH + GAP;
    }
  }

  // Scale factor: stretch all columns proportionally to fill GRID_H
  // Each column gets its own scale so photos fill exactly
  const colScales = colHeights.map(h => h > 0 ? GRID_H / h : 1);

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

      {/* POSTER CANVAS */}
      <div
        ref={posterRef}
        style={{
          width: `${POSTER_W}px`,
          height: `${POSTER_H}px`,
          backgroundColor: '#FAF7F2',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          flexShrink: 0,
        }}
      >
        {/* Inset border */}
        <div style={{
          position: 'absolute', inset: '10px',
          border: '1.5px solid rgba(44,62,53,0.18)',
          pointerEvents: 'none', zIndex: 10,
        }} />

        <div style={{
          padding: `${PADDING}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}>

          {/* HEADER */}
          <div style={{
            textAlign: 'center',
            marginBottom: '14px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(44,62,53,0.15)',
            flexShrink: 0,
          }}>
            <div style={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 900,
              fontSize: '72px',
              letterSpacing: '0.12em',
              color: '#1C2B22',
              lineHeight: 1,
              textTransform: 'uppercase',
              marginBottom: '5px',
            }}>
              Corcovado
            </div>
            <div style={{
              fontFamily: '"Georgia", serif',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '0.32em',
              color: '#C86A27',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}>
              National Park • Costa Rica
            </div>
            <div style={{
              fontFamily: 'sans-serif',
              fontWeight: 600,
              fontSize: '10px',
              letterSpacing: '0.22em',
              color: 'rgba(44,62,53,0.55)',
              textTransform: 'uppercase',
            }}>
              {new Date().toLocaleDateString(language === 'EN' ? 'en-US' : 'es-ES', {
                month: 'long', day: 'numeric', year: 'numeric',
              }).toUpperCase()}
            </div>
          </div>

          {/* GRID */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: `${GAP}px`,
            flex: 1,
            overflow: 'hidden',
          }}>
            {columns.map((col, colIdx) => (
              <div
                key={colIdx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: `${GAP}px`,
                  width: `${COL_W}px`,
                  flexShrink: 0,
                }}
              >
                {col.map((species) => {
                  const label = language === 'EN' ? species.nameEN : species.nameES;
                  const sci = species.scientificName || '';
                  return (
                    <div
                      key={species.id}
                      style={{
                        position: 'relative',
                        width: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={species.image}
                        alt={label}
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                          filter: 'sepia(6%) saturate(108%)',
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(15,25,18,0.82) 0%, transparent 100%)',
                        padding: '20px 6px 5px 6px',
                      }}>
                        <div style={{
                          fontFamily: 'sans-serif',
                          fontWeight: 700,
                          fontSize: '7px',
                          letterSpacing: '0.08em',
                          color: '#FFFFFF',
                          textTransform: 'uppercase',
                          textAlign: 'center',
                          textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                        }}>
                          {label}
                        </div>
                        {sci && (
                          <div style={{
                            fontFamily: '"Georgia", serif',
                            fontStyle: 'italic',
                            fontSize: '6px',
                            color: 'rgba(255,255,255,0.72)',
                            textAlign: 'center',
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
