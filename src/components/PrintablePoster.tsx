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

  // Sort by rarity desc, cap at 20
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

  const dateStr = new Date().toLocaleDateString(
    language === 'EN' ? 'en-US' : 'es-ES',
    { month: 'long', day: 'numeric', year: 'numeric' }
  );

  // ── Column width for masonry ──
  // 5 columns, 12px gap, inside 724px content area (800 - 2*38)
  const COLS = 5;
  const GAP = 12;
  const CONTENT_W = 724;
  const colWidth = Math.floor((CONTENT_W - GAP * (COLS - 1)) / COLS); // ≈ 132px

  // ── Assign column widths by rarity tier ──
  // tier 1 (top 4): span 2 cols → displayed at full double width
  // tier 2 (next 8): span 1 col
  // tier 3 (rest):  span 1 col, slightly shorter images via maxHeight
  const getTier = (i: number) => {
    if (i < 4) return 1;
    if (i < 12) return 2;
    return 3;
  };

  const getItemWidth = (i: number) => {
    return getTier(i) === 1 ? colWidth * 2 + GAP : colWidth;
  };

  // ── Simple balanced masonry: track column heights, always place into shortest ──
  // For tier-1 items we use a "shortest adjacent pair" strategy.
  type LayoutItem = {
    species: Species;
    x: number;
    y: number;
    width: number;
    tier: number;
  };

  const colHeights = Array(COLS).fill(0);

  const getShortestCol = () => colHeights.indexOf(Math.min(...colHeights));

  const getShortestAdjacentPair = () => {
    let best = 0;
    let bestH = Infinity;
    for (let c = 0; c < COLS - 1; c++) {
      const h = Math.max(colHeights[c], colHeights[c + 1]);
      if (h < bestH) { bestH = h; best = c; }
    }
    return best;
  };

  const items: LayoutItem[] = premiumSpecies.map((species, i) => {
    const tier = getTier(i);
    const width = getItemWidth(i);

    let col: number;
    let y: number;

    if (tier === 1) {
      col = getShortestAdjacentPair();
      y = Math.max(colHeights[col], colHeights[col + 1]);
      // Estimate item height: double-wide image assumed ~0.65 aspect + 28px label
      const estH = Math.round(width * 0.65) + 28 + GAP;
      colHeights[col] = y + estH;
      colHeights[col + 1] = y + estH;
    } else {
      col = getShortestCol();
      y = colHeights[col];
      // Estimate item height: single image ~0.75 aspect + 24px label
      const estH = Math.round(width * 0.75) + 24 + GAP;
      colHeights[col] = y + estH;
    }

    const x = col * (colWidth + GAP);

    return { species, x, y, width, tier };
  });

  const totalContentH = Math.max(...colHeights);
  // Poster height = header (~130px) + content + footer (~52px) + padding
  const posterH = 130 + totalContentH + 52 + 40;

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center py-10 px-4">
      {/* Controls */}
      <div className="w-full max-w-[800px] flex justify-between items-center mb-8">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-[#C86A27] text-white px-6 py-3 rounded-full font-bold hover:bg-[#b05a1f] transition-all disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          {isDownloading ? 'Generating High-Res…' : 'Download Print-Ready Poster'}
        </button>
      </div>

      {/* ── POSTER CANVAS ── */}
      <div
        ref={posterRef}
        style={{
          width: '800px',
          height: `${posterH}px`,
          backgroundColor: '#F9F6F0',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Georgia', serif",
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Thin outer rule */}
        <div style={{
          position: 'absolute',
          inset: '14px',
          border: '1px solid rgba(44,62,53,0.22)',
          pointerEvents: 'none',
          zIndex: 10,
        }} />

        {/* ── HEADER ── */}
        <div style={{
          textAlign: 'center',
          paddingTop: '38px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(44,62,53,0.15)',
          marginLeft: '38px',
          marginRight: '38px',
        }}>
          <div style={{
            fontSize: '10px',
            letterSpacing: '0.26em',
            color: '#C86A27',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}>
            {language === 'EN' ? 'Expedition Sighting Log' : 'Registro de Avistamiento'}
          </div>
          <h1 style={{
            fontSize: '52px',
            fontWeight: 900,
            color: '#1E2E25',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily: "'Georgia', serif",
            margin: '0 0 3px 0',
            lineHeight: 1,
          }}>
            Corcovado
          </h1>
          <div style={{
            fontSize: '12px',
            letterSpacing: '0.28em',
            color: '#2C3E35',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            National Park &nbsp;·&nbsp; Costa Rica
          </div>
          <div style={{
            fontSize: '8.5px',
            letterSpacing: '0.18em',
            color: 'rgba(44,62,53,0.5)',
            textTransform: 'uppercase',
          }}>
            {language === 'EN' ? 'Expedition Date' : 'Fecha'}: {dateStr}
            {guideName ? `  ·  ${guideName}` : ''}
          </div>
        </div>

        {/* ── MASONRY GRID ── */}
        <div style={{
          position: 'absolute',
          top: '130px',
          left: '38px',
          right: '38px',
          bottom: '52px',
        }}>
          {items.map(({ species, x, y, width, tier }) => {
            const name = language === 'EN' ? species.nameEN : species.nameES;
            const sci = species.scientificName || 'Species scientifica';

            return (
              <div
                key={species.id}
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${width}px`,
                }}
              >
                <img
                  src={species.image}
                  alt={name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    filter: 'drop-shadow(0px 2px 6px rgba(0,0,0,0.22)) sepia(8%)',
                    // Tier 3: cap image height so tiny portrait shots don't dominate
                    ...(tier === 3 ? { maxHeight: '110px', objectFit: 'cover' } : {}),
                  }}
                />
                <div style={{ marginTop: '4px' }}>
                  <div style={{
                    fontSize: tier === 1 ? '8.5px' : '7px',
                    fontWeight: 700,
                    color: '#1E2E25',
                    letterSpacing: '0.11em',
                    textTransform: 'uppercase',
                    fontFamily: "'Arial Narrow', Arial, sans-serif",
                    lineHeight: 1.25,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {name}
                  </div>
                  <div style={{
                    fontSize: tier === 1 ? '7.5px' : '6.5px',
                    fontStyle: 'italic',
                    color: 'rgba(44,62,53,0.62)',
                    fontFamily: "'Georgia', serif",
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {sci}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          position: 'absolute',
          bottom: '22px',
          left: '38px',
          right: '38px',
          borderTop: '1px solid rgba(44,62,53,0.15)',
          paddingTop: '10px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '7.5px',
            letterSpacing: '0.22em',
            color: 'rgba(44,62,53,0.42)',
            textTransform: 'uppercase',
            fontFamily: "'Georgia', serif",
          }}>
            {language === 'EN'
              ? "Nature's Index · Official Wildlife Sighting Log · Flora & Fauna"
              : "Nature's Index · Registro Oficial de Fauna Silvestre"}
          </div>
        </div>
      </div>
    </div>
  );
}


