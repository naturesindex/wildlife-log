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

// Seeded pseudo-random number generator — same species set always produces same layout
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// Collision-aware scatter layout
// Each species gets a cell in a loose grid, then is nudged by a seeded offset
// so it reads as organic but never actually overlaps its neighbours.
function buildLayout(count: number) {
  const COLS = 5;
  const ROWS = Math.ceil(count / COLS);

  // Canvas inner dimensions (matches poster content area in px at screen res)
  const W = 724; // 800px poster - 2*38px padding
  const H = 850; // approx content area height

  const cellW = W / COLS;
  const cellH = H / ROWS;

  const rand = seededRandom(count * 31 + 7);

  return Array.from({ length: count }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);

    // Base cell centre
    const cx = cellW * col + cellW / 2;
    const cy = cellH * row + cellH / 2;

    // Nudge: up to ±22% of cell size, keeping species away from edges
    const nudgeX = (rand() - 0.5) * cellW * 0.3;
    const nudgeY = (rand() - 0.5) * cellH * 0.22;

    // Size variation: alternate between small / medium / large
    // Rarer species (lower index = higher rarity from our sort) get slightly larger images
    const sizeVariants = [88, 78, 100, 72, 92];
    const imgWidth = sizeVariants[i % sizeVariants.length];

    // Tiny rotation for life — never more than ±2.5 deg, keeps text readable
    const rotation = (rand() - 0.5) * 5;

    return {
      x: Math.max(40, Math.min(W - imgWidth - 40, cx + nudgeX - imgWidth / 2)),
      y: Math.max(20, cy + nudgeY),
      imgWidth,
      rotation,
    };
  });
}

export function PrintablePoster({ loggedSpecies, language, guideName, onClose }: PrintablePosterProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Sort by rarity, cap at 20
  const premiumSpecies = [...loggedSpecies]
    .sort((a, b) => (b.rarityScore || 0) - (a.rarityScore || 0))
    .slice(0, 20);

  const layout = buildLayout(premiumSpecies.length);

  // Compute total height needed so nothing clips
  const contentH = Math.max(
    860,
    ...layout.map((l, i) => l.y + 90 + 32) // image bottom + label space
  );

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

      {/* ── POSTER CANVAS ── 8.5 × 11 at 800px screen width */}
      <div
        ref={posterRef}
        style={{
          width: '800px',
          height: '1035px',
          backgroundColor: '#F9F6F0',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Georgia', serif",
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Thin outer rule — just one, no double-border clutter */}
        <div style={{
          position: 'absolute',
          inset: '14px',
          border: '1px solid rgba(44,62,53,0.25)',
          pointerEvents: 'none',
        }} />

        {/* ── HEADER ── */}
        <div style={{
          textAlign: 'center',
          paddingTop: '40px',
          paddingBottom: '18px',
          borderBottom: '1px solid rgba(44,62,53,0.15)',
          marginLeft: '38px',
          marginRight: '38px',
        }}>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.25em',
            color: '#C86A27',
            fontFamily: "'Georgia', serif",
            fontWeight: 400,
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
            margin: '0 0 2px 0',
            lineHeight: 1,
          }}>
            Corcovado
          </h1>

          <div style={{
            fontSize: '13px',
            letterSpacing: '0.28em',
            color: '#2C3E35',
            textTransform: 'uppercase',
            fontWeight: 400,
            marginBottom: '10px',
          }}>
            National Park &nbsp;·&nbsp; Costa Rica
          </div>

          <div style={{
            fontSize: '9.5px',
            letterSpacing: '0.18em',
            color: 'rgba(44,62,53,0.55)',
            textTransform: 'uppercase',
          }}>
            {language === 'EN' ? 'Expedition Date' : 'Fecha'}: {dateStr}
            {guideName ? `  ·  ${guideName}` : ''}
          </div>
        </div>

        {/* ── SPECIES SCATTER FIELD ── */}
        <div style={{
          position: 'absolute',
          top: '138px',
          left: '38px',
          right: '38px',
          bottom: '52px',
        }}>
          {premiumSpecies.map((species, i) => {
            const { x, y, imgWidth, rotation } = layout[i];
            const name = language === 'EN' ? species.nameEN : species.nameES;
            const sci = species.scientificName || 'Species scientifica';

            return (
              <div
                key={species.id}
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${imgWidth}px`,
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: 'center top',
                  textAlign: 'center',
                }}
              >
                {/* Photo — no border, natural shadow */}
                <img
                  src={species.image}
                  alt={name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    // Soft lift — light, not dramatic. Gives depth without a frame.
                    filter: 'drop-shadow(0px 2px 6px rgba(0,0,0,0.22))',
                    // Very slight warm tone to match the cream bg
                    filter: 'drop-shadow(0px 2px 6px rgba(0,0,0,0.22)) sepia(8%)',
                  }}
                />

                {/* Label block — tight, no box */}
                <div style={{ marginTop: '5px', padding: '0 2px' }}>
                  <div style={{
                    fontSize: '7.5px',
                    fontWeight: 700,
                    color: '#1E2E25',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontFamily: "'Arial Narrow', 'Arial', sans-serif",
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {name}
                  </div>
                  <div style={{
                    fontSize: '6.5px',
                    fontStyle: 'italic',
                    color: 'rgba(44,62,53,0.65)',
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
            fontSize: '8px',
            letterSpacing: '0.22em',
            color: 'rgba(44,62,53,0.45)',
            textTransform: 'uppercase',
            fontFamily: "'Georgia', serif",
          }}>
            {language === 'EN'
              ? "Nature's Index · Official Wildlife Sighting Log"
              : "Nature's Index · Registro Oficial de Fauna Silvestre"}
          </div>
        </div>
      </div>
    </div>
  );
}

