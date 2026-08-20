import { ArrowLeft, Download } from 'lucide-react';
import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Species, Language } from '../types';
import { initialSpecies } from '../data/corcovado';
import { uticaSpecies } from '../data/utica';
import { getLocationConfig } from '../data/locations';


interface PrintablePosterProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  onClose: () => void;
  tourDate?: string;
  /** Location slug, e.g. 'corcovado' or 'utica'. Defaults to corcovado. */
  location?: string;
  /** "Starbucks effect" — the guest's name, printed on the poster itself. */
  guestName?: string;
}

// Extra vertical space each photo needs for the name/scientific-name block
// that now renders BELOW the image instead of overlaid on top of it.
const LABEL_H = 34;

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

export function PrintablePoster({ loggedSpecies, language, guideName, onClose, tourDate, location, guestName }: PrintablePosterProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const config = getLocationConfig(location);
  const masterList = location === 'utica' ? uticaSpecies : initialSpecies;

const POSTER_W = 850;
  const POSTER_H = 1100;
  const PADDING = 28;
  const HEADER_H = 118; // approx header + border
  const GRID_H = POSTER_H - PADDING * 2 - HEADER_H;
  const COL_W = (POSTER_W - PADDING * 2 - GAP * (NUM_COLS - 1)) / NUM_COLS;

 // Pad with extra species (from THIS location's master list) to make the
 // glob as full and balanced as possible!
  const seenIds = new Set(loggedSpecies.map(s => s.id));
  const extras = (masterList as Species[]).filter(s => !seenIds.has(s.id));
  const allSpecies = [...loggedSpecies, ...extras];

  // Sort by rarity descending
  const sorted = [...allSpecies]
    .sort((a, b) => (b.rarityScore || 0) - (a.rarityScore || 0));
  // Greedy column-fill: assign each species to the shortest column
  const colHeights = Array(NUM_COLS).fill(0);
  const columns: Species[][] = Array.from({ length: NUM_COLS }, () => []);

for (const species of sorted) {
    const ar = estimateAspectRatio(species);
    const imgH = COL_W / ar + LABEL_H;
    
   // Define custom target heights for our 4 columns to create the "Diamond" shape
    // Outer columns (0 and 3) stop early, inner columns (1 and 2) pack heavily
    // BUMPED UP: We made the math greedier so it grabs 1-2 more photos to fill those gaps!
    const targetHeights = [GRID_H + 200, GRID_H + 530, GRID_H + 530, GRID_H + 200];
    
    // Calculate which column has the most space left to reach its specific target
    const spaceLeft = colHeights.map((h, i) => targetHeights[i] - h);
    const maxSpace = Math.max(...spaceLeft);
    
    // If the column with the most space still needs photos, add one!
    if (maxSpace > 0) {
      const bestColIdx = spaceLeft.indexOf(maxSpace);
      columns[bestColIdx].push(species);
      colHeights[bestColIdx] += imgH + GAP;
    }
  }

  // Scale factor: stretch all columns proportionally to fill GRID_H
  // Each column gets its own scale so photos fill exactly
  const colScales = colHeights.map(h => h > 0 ? GRID_H / h : 1);

const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    try {
      // Switched to PNG and added cacheBust to prevent Cloudinary CORS fails
      const dataUrl = await toPng(posterRef.current, { 
        cacheBust: true, 
        pixelRatio: 4 
      });
      const link = document.createElement('a');
      link.download = `${config.slug}-Poster-${new Date().toISOString().split('T')[0]}.png`;
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
      <div className="w-full max-w-[800px] flex justify-center items-center mb-8">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-[#C86A27] text-white px-6 py-3 rounded-full font-bold hover:bg-[#b05a1f] transition-all disabled:opacity-50 shadow-lg shadow-[#C86A27]/20"
        >
          <Download className="w-5 h-5" />
          {isDownloading ? 'Generating High-Res...' : 'Download Print-Ready Poster'}
        </button>
      </div>

      {/* Mobile Side-Scroll Wrapper */}
      <div className="w-full max-w-[100vw] overflow-x-auto pb-8 flex justify-start md:justify-center items-start">
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
              fontSize: config.nameEN.length > 14 ? '48px' : '72px',
              letterSpacing: '0.12em',
              color: '#1C2B22',
              lineHeight: 1,
              textTransform: 'uppercase',
              marginBottom: '5px',
            }}>
              {language === 'EN' ? config.nameEN : config.nameES}
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
              {language === 'EN' ? config.posterRegionEN : config.posterRegionES}
            </div>
            <div style={{
              fontFamily: 'sans-serif',
              fontWeight: 600,
              fontSize: '10px',
              letterSpacing: '0.22em',
              color: 'rgba(44,62,53,0.55)',
              textTransform: 'uppercase',
            }}>
    {tourDate 
                ? tourDate.toUpperCase() 
                : new Date().toLocaleDateString(language === 'EN' ? 'en-US' : 'es-ES', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
            </div>
            {/* "Starbucks effect" — print the guest's name on their own poster */}
            {guestName && (
              <div style={{
                fontFamily: '"Georgia", serif',
                fontWeight: 700,
                fontStyle: 'italic',
                fontSize: '12px',
                letterSpacing: '0.05em',
                color: '#1C2B22',
                marginTop: '4px',
              }}>
                {language === 'EN' ? `${guestName}'s Collection` : `Colección de ${guestName}`}
              </div>
            )}
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
                  height: '100%',
                  width: `${COL_W}px`,
                  flexShrink: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${GAP}px`,
                    // Scales this column's naturally-stacked photo heights to
                    // exactly fill GRID_H, so every column bottoms out at the
                    // same line instead of the ragged edge you get from just
                    // stacking real (uneven) photo aspect ratios.
                    transform: `scaleY(${colScales[colIdx] || 1})`,
                    transformOrigin: 'center',
                  }}
                >
                {col.map((species) => {
                  const label = language === 'EN' ? species.nameEN : species.nameES;
                  const sci = species.scientificName || '';
                  return (
                    <div
                      key={species.id}
                      style={{
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
                      {/* Name/scientific-name now sits BELOW the photo, in normal
                          flow, instead of overlaid on top of it — so faces are
                          never covered by text. */}
                      <div style={{ padding: '4px 4px 0 4px' }}>
                        <div style={{
                          fontFamily: 'sans-serif',
                          fontWeight: 700,
                          fontSize: '7px',
                          letterSpacing: '0.08em',
                          color: '#1C2B22',
                          textTransform: 'uppercase',
                          textAlign: 'center',
                        }}>
                          {label}
                        </div>
                        {sci && (
                          <div style={{
                            fontFamily: '"Georgia", serif',
                            fontStyle: 'italic',
                            fontSize: '6px',
                            color: 'rgba(44,62,53,0.65)',
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
      </div>
  );
}
