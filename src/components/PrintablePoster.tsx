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

// Extra vertical space each photo needs below it for the pill's overhang.
// The pill now holds BOTH the name and the scientific name stacked inside
// it (not sci-name as a separate line below) — same overlap trick as
// before (half in / half out of the photo), just a taller pill to fit
// both lines. Card-to-card spacing is handled by the wrapper's
// marginBottom below, not this constant.
const LABEL_H = 15;

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
const GAP = 4; // px between photos and columns — tightened further (was 5)

// The one consistent brand orange used everywhere else in the app (header
// dates, buttons, brand name) — using it here too instead of per-section
// colors, per your note that you want one solid color for consistency.
const BRAND_ORANGE = '#C86A27';

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

  // Sort so a guide's real sightings always win a spot before "filler"
  // extras do — if a column ever does run out of room, it's the filler
  // that gets left off, never something the guest actually saw. Rarer
  // species still lead within each group, same as before.
  const sorted = [...allSpecies].sort((a, b) => {
    const aLogged = seenIds.has(a.id) ? 1 : 0;
    const bLogged = seenIds.has(b.id) ? 1 : 0;
    if (aLogged !== bLogged) return bLogged - aLogged;
    return (b.rarityScore || 0) - (a.rarityScore || 0);
  });

  // Greedy column-fill: assign each species to the column that most wants it
  const colHeights = Array(NUM_COLS).fill(0);
  const columns: Species[][] = Array.from({ length: NUM_COLS }, () => []);

  // Target heights create the "Diamond" shape — inner columns (1, 2) fill
  // the full grid height, outer columns (0, 3) stop a bit shorter. These are
  // shaping preferences ONLY, and every one of them is <= GRID_H (the hard
  // cap below is what actually prevents overflow, not these numbers).
  // Bumped the outer columns from 0.82 -> 0.92 — with LABEL_H and GAP both
  // tightened above, and the hard cap still doing its job, this lands more
  // photos per poster while staying comfortably inside the visible area.
  const targetHeights = [GRID_H * 0.92, GRID_H, GRID_H, GRID_H * 0.92];

  for (const species of sorted) {
    const ar = estimateAspectRatio(species);
    const imgH = COL_W / ar + LABEL_H;

    // Hard cap: a column is only eligible if this photo would still fit
    // inside the real, visible GRID_H — not just "has room left toward its
    // target." This is what guarantees nothing ever overflows the poster,
    // no matter how the target heights are tuned.
    const eligible = colHeights
      .map((h, i) => ({ i, spaceLeft: targetHeights[i] - h, fits: h + imgH + GAP <= GRID_H }))
      .filter((c) => c.fits);

    if (eligible.length === 0) continue; // every column is genuinely full — stop

    const best = eligible.reduce((a, b) => (b.spaceLeft > a.spaceLeft ? b : a));
    columns[best.i].push(species);
    colHeights[best.i] += imgH + GAP;
  }

  // NOTE: this used to scaleY() each column's stack to force it to exactly
  // fill GRID_H. That stretched BOTH the photos and the name/scientific-name
  // text non-uniformly — exactly the "stretched, unreadable" look reported.
  // Fixed below by letting each column's real (undistorted) content size
  // itself, and filling leftover height as evenly-distributed gaps instead
  // (see `justifyContent: 'space-evenly'` on the column wrapper) — still
  // "fills the space" edge-to-edge, just without warping anything.

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
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    // Real, undistorted photos — leftover column height is
                    // absorbed as evenly-distributed gaps instead of warping
                    // the images/text, so every column still bottoms out
                    // together and stays centered/balanced top-to-bottom.
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
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
                        overflow: 'visible',
                        // Just enough room for the pill's overhang below the
                        // photo, plus a little breathing room before the
                        // next card — tightened way down from before.
                        marginBottom: '9px',
                      }}
                    >
                      <div style={{ position: 'relative' }}>
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
                        {/* Name + scientific name pill — ONE solid brand-orange
                            pill holding both lines, overlapping the bottom
                            edge of the photo (half in / half out). Sized to
                            actually fit both lines now instead of clipping
                            the second one. */}
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: 'translate(-50%, 50%)',
                          width: '92%',
                          padding: '3px 5px 4px',
                          borderRadius: '6px',
                          textAlign: 'center',
                          backgroundColor: BRAND_ORANGE,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.35)',
                        }}>
                          <div style={{
                            fontFamily: 'sans-serif',
                            fontWeight: 700,
                            fontSize: '6.5px',
                            letterSpacing: '0.06em',
                            color: '#FFFFFF',
                            textTransform: 'uppercase',
                            lineHeight: 1.25,
                          }}>
                            {label}
                          </div>
                          {sci && (
                            <div style={{
                              fontFamily: '"Georgia", serif',
                              fontStyle: 'italic',
                              fontSize: '5.5px',
                              color: 'rgba(255,255,255,0.85)',
                              lineHeight: 1.2,
                              marginTop: '1px',
                            }}>
                              {sci}
                            </div>
                          )}
                        </div>
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
