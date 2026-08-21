import { ArrowLeft, Camera, MapPin, Footprints, Trophy, Map, Feather, Music2, Wind, Waves, Mountain } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Species, Language } from '../types';
import { PrintablePoster } from './PrintablePoster';
import { getLocationConfig, getSectionColor, getSectionLabel, resolveSectionOrder } from '../data/locations';
import { getBadges, BadgeIconKey } from '../data/badges';


// Custom Hook for counting up (or down) numbers smoothly!
function useCountUp(end: number, start: number = 0, duration: number = 4000, isFloat: boolean = false, startTrigger: boolean = true) {
  const [count, setCount] = useState(start);
  useEffect(() => {
    if (end === start || !startTrigger) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // Smooth deceleration
      setCount(start + (end - start) * ease);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
    // BUG FIX: `startTrigger` (statsInView) was missing from this dependency
    // array. It starts `false` at mount, the effect runs once, bails out on
    // the `!startTrigger` check above, and then never runs again once
    // `startTrigger` flips to `true` — so the counters were permanently stuck
    // at their starting value (0.0km, 0 species) any time the stat box
    // scrolled into view AFTER the initial render, which is the normal case.
  }, [end, start, duration, startTrigger]);
  return isFloat ? count.toFixed(1) : Math.floor(count);
}

// A tiny standalone reverse-counter (100 → score) for the rarity number shown
// on a flipped card. Keyed by the caller so it fully remounts — and its
// internal `count` state resets to 100 — every time a card is flipped open,
// instead of continuing from wherever a previous flip left off.
function RarityCountUp({ score, colorClass }: { score: number; colorClass: string }) {
  const value = useCountUp(score, 100, 1200, false, true);
  return <span className={colorClass}>{value}</span>;
}

// Maps a badge's icon key (from data/badges.ts) to the actual lucide component.
// Badges that already have Cloudinary artwork (`image`) skip this entirely.
const BADGE_ICONS: Record<BadgeIconKey, React.ComponentType<{ className?: string }>> = {
  Feather,
  Music2,
  Wind,
  Trophy,
  Waves,
  Mountain,
};

// Bird-ish categories across BOTH datasets. Corcovado just uses 'Birds'; Útica's
// dataset is split into finer categories (Hummingbirds, Raptors, Tanagers, etc.)
// since it's a birding-only tour. Counting all of them together keeps the
// "Canopy Scout" expedition rating meaningful for both locations.
const BIRD_CATEGORIES = ['Birds', 'Raptors & Vultures', 'Hummingbirds', 'Tanagers & Songbirds', 'Toucans & Motmots', 'Woodpeckers & Barbets', 'Waterbirds', 'Other Discoveries'];

interface SandboxProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  onBack: () => void;
  /** Lets the toolbar's EN/ES toggle actually change the language. */
  setLanguage?: (lang: Language) => void;
  /** Location slug, e.g. 'corcovado' or 'utica'. Defaults to corcovado for any
   *  older callers that haven't been updated to pass it yet. */
  location?: string;
  /** The expedition/trail the guest chose when the tour started (tours.zone). */
  expeditionType?: string;
  guestName?: string;
  tourDate?: string;
}

export function PassportSandbox({
  loggedSpecies: rawSpecies,
  language,
  guideName,
  onBack,
  setLanguage,
  location,
  expeditionType,
  guestName: guestNameProp,
  tourDate,
}: SandboxProps) {
  const config = getLocationConfig(location);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [mapFlipped, setMapFlipped] = useState(false);

  const loggedSpecies = rawSpecies || [];
  const totalSpecies = loggedSpecies.length;

  const guestName = guestNameProp || 'Explorer';
  const demoTourDate =
    tourDate ||
    new Date().toLocaleDateString(language === 'EN' ? 'en-US' : 'es-ES', { month: 'long', day: 'numeric', year: 'numeric' });

  // The ref that watches when the Stats box enters the screen
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  // Dynamic Trek Dictionary — only meaningful for trekking locations (showDistance: true).
  // Útica has no trail selection, so this whole dictionary is skipped for it.
  // NOTE on the descriptions below: expanded/lengthened per feedback, but I don't
  // have first-hand knowledge of these specific trails — please read these over
  // and correct any factual specifics (flora/fauna claims, terrain details) before
  // this goes live with guests.
  const trekData: Record<string, { kms: string; title: string; desc: string }> = {
    'Sirena Station (Day Tour)': {
      kms: '7.5',
      title: 'Sirena Trail',
      desc: "A deep dive into Corcovado's biological heart. The trail winds through dense secondary forest before opening onto the wild Pacific coastline, threading past river crossings and old-growth giants along the way — one of the most biodiverse single-day routes in the park.",
    },
    'San Pedrillo Station (Day Tour)': {
      kms: '6.5',
      title: 'San Pedrillo',
      desc: "A journey into ancient primary rainforest along the park's northern edge, where sunlight rarely reaches the forest floor. The route climbs toward a series of cascading waterfalls carved into volcanic rock — a cooler, quieter counterpart to the coastal trails further south.",
    },
    'Sirena Station (Overnight)': {
      kms: '10.0',
      title: 'Sirena Nocturnal',
      desc: 'The jungle after dark is an entirely different ecosystem. Nocturnal mammals emerge, insects light up the understory, and the soundscape shifts completely — an extended, overnight expedition for guests who want to experience Corcovado in its most raw, unfiltered state.',
    },
    'Combo: Sirena + San Pedrillo': {
      kms: '20.0',
      title: 'The Ultimate Trek',
      desc: "The grand dual-station expedition — Corcovado from edge to edge. From the ancient primary giants and waterfalls of San Pedrillo to the beating biological heart of Sirena, this route covers the fullest possible cross-section of the park's ecosystems in a single trip.",
    },
  };
  const activeTrek = trekData[expeditionType || ''] || trekData['Sirena Station (Day Tour)'];

  // --- 1. EXPEDITION TITLE LOGIC ---
  const birdCount = loggedSpecies.filter((s) => BIRD_CATEGORIES.includes(s.category)).length;
  const microCount = loggedSpecies.filter((s) => s.section === 'Fascinating Flora' || s.section === 'The Forest Floor').length;
  const eliteCount = loggedSpecies.filter((s) => s.tier === 1 || (s.rarityScore && s.rarityScore >= 90)).length;

  let expeditionRating = 'Jungle Voyager';
  let ratingColor = 'text-amber-400';
  let ratingBg = 'bg-amber-500/10';

  if (eliteCount >= 2) {
    expeditionRating = 'Elite Tracker';
    ratingColor = 'text-purple-400';
    ratingBg = 'bg-purple-500/10';
  } else if (birdCount > totalSpecies * 0.4 && birdCount > 3) {
    expeditionRating = 'Canopy Scout';
    ratingColor = 'text-sky-400';
    ratingBg = 'bg-sky-500/10';
  } else if (microCount > totalSpecies * 0.4 && microCount > 3) {
    expeditionRating = 'Micro-Explorer';
    ratingColor = 'text-emerald-400';
    ratingBg = 'bg-emerald-500/10';
  } else if (totalSpecies > 0 && totalSpecies <= 8) {
    expeditionRating = 'Stealth Tracker';
    ratingColor = 'text-stone-400';
    ratingBg = 'bg-stone-500/10';
  } else {
    expeditionRating = 'Jungle Navigator';
    ratingColor = 'text-amber-400';
    ratingBg = 'bg-amber-500/10';
  }

  // --- 2. BRAGGING RIGHTS MATH (Real Data Based!) ---
  let targetPercentile = 100;
  if (totalSpecies > 0) {
    const sortedRarity = [...loggedSpecies].sort((a, b) => (b.rarityScore || 0) - (a.rarityScore || 0));
    const topFinds = sortedRarity.slice(0, 5);
    const avgTopRarity = topFinds.reduce((sum, s) => sum + (s.rarityScore || 10), 0) / topFinds.length;
    targetPercentile = Math.max(1, Math.round(100 - avgTopRarity));
  }

  // Fire up the animation hooks! (5.5 seconds long — slowed down per feedback —
  // rarity percentile ticks down from 100)
  const animatedSpeciesCount = useCountUp(totalSpecies, 0, 5500, false, statsInView);
  const animatedPercentile = useCountUp(targetPercentile, 100, 5500, false, statsInView);
  const animatedKms = useCountUp(config.showDistance ? parseFloat(activeTrek.kms) : 0, 0, 5500, true, statsInView);

  const locationName = language === 'EN' ? config.nameEN : config.nameES;
  const rarityStat = totalSpecies > 0 ? `Top ${animatedPercentile}% in ${locationName}` : 'Standard Rank';

  // Badges for THIS location, filtered down to only the ones actually unlocked.
  const unlockedBadges = getBadges(location).filter((b) => b.check(loggedSpecies));

  // Group species by section using the shared location config, so Highlights
  // (Tier 1) always leads, and everything else follows the location's real
  // section order/colors/labels instead of a hardcoded, drift-prone copy.
  const tier1Species = loggedSpecies.filter((s) => s.tier === 1);
  const otherSpecies = loggedSpecies.filter((s) => s.tier !== 1);
  const groupedOthers = otherSpecies.reduce<Record<string, Species[]>>((acc, s) => {
    const sec = s.section || 'Other Notables';
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(s);
    return acc;
  }, {});
  const orderedSections = resolveSectionOrder(config, Object.keys(groupedOthers));

  const highlightsDesc = {
    en: `The best moments from ${guestName}'s trek. Breathtaking encounters that made this expedition unforgettable.`,
    es: `Los mejores momentos de la caminata de ${guestName}. Encuentros impresionantes que hicieron esta expedición inolvidable.`,
  };

  return (
    <div
      className="min-h-screen bg-[#060c08] text-white font-sans selection:bg-[#F0803C]/30 pb-32 select-none cursor-default relative overflow-hidden"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E")` }}
    >
      {/* Ambient Vines (Swaying) */}
      <motion.img src="YOUR_CLOUDINARY_LINK_HERE" animate={{ rotate: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }} className="absolute -top-10 -left-10 w-96 h-auto opacity-40 pointer-events-none z-0 transform origin-top-left" />
      <motion.img src="YOUR_CLOUDINARY_LINK_HERE" animate={{ rotate: [1, -1, 1] }} transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }} className="absolute top-1/4 -right-12 w-80 h-auto opacity-30 pointer-events-none z-0 transform origin-top-right" />

      {/* Dev Toolbar */}
      <div className="fixed top-0 left-0 w-full p-4 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="pointer-events-auto flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-[#337CA0]/40 transition-all text-xs font-bold uppercase tracking-wider border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Sandbox
          </button>
        </div>
        <div className="flex items-center gap-3 pointer-events-auto">
          {setLanguage && (
            <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/10">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${language === 'EN' ? 'bg-[#F0803C] text-white' : 'text-white/50'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ES')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${language === 'ES' ? 'bg-[#F0803C] text-white' : 'text-white/50'}`}
              >
                ES
              </button>
            </div>
          )}
          <div className="bg-[#F0803C] px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(240,128,60,0.5)]">
            Editorial Preview
          </div>
        </div>
      </div>

      {/* Hero Cover */}
      <div className="relative pt-32 pb-16 px-6 overflow-hidden flex flex-col items-start text-left max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#F0803C]/5 rounded-full blur-3xl translate-x-1/3 z-0" />

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
          className="relative z-10 w-full"
        >
          <motion.p variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="text-[#A0AF84] font-black tracking-widest uppercase text-sm mb-4">
            Nature's Index
          </motion.p>
          <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="text-7xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-2 transform -rotate-1">
            {guestName}'s
          </motion.h1>
          <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="text-6xl md:text-8xl font-black text-[#F0803C] mb-8 pl-8 md:pl-16 italic transform -rotate-2">
            Expedition
          </motion.h2>
          <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="inline-block bg-white/10 backdrop-blur-sm border border-white/10 px-6 py-2 rounded-full mb-10 ml-8 md:ml-20">
            <p className="text-white/80 text-sm font-bold tracking-widest uppercase text-center">{demoTourDate}</p>
          </motion.div>

          {/* The Personal Story Block */}
          <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.6 } } }} className="bg-[#230C0F]/60 backdrop-blur-md border border-[#423E28]/50 rounded-3xl p-8 md:p-10 text-left shadow-2xl relative overflow-hidden max-w-3xl ml-auto">
            <p className="text-xl md:text-2xl text-white font-light leading-relaxed mb-4">
              {language === 'EN' ? `Dear ${guestName},` : `Estimado ${guestName},`}
            </p>
            <p className="text-white/80 md:text-lg leading-relaxed font-light relative z-10">
              {language === 'EN' ? config.introEN(guestName, guideName) : config.introES(guestName, guideName)}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Map & Expedition Stats */}
      <div ref={statsRef} className="max-w-4xl mx-auto px-6 mb-20">
        <div className="bg-[#112217] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
          {/* Mock Map Side */}
          <div
            onClick={() => setMapFlipped(!mapFlipped)}
            className="w-full md:w-1/2 h-[250px] md:h-auto relative bg-[#0b170f] overflow-hidden group cursor-pointer"
          >
            {mapFlipped ? (
              <div className="absolute inset-0 bg-[#F0803C]/10 p-8 flex flex-col justify-center items-center text-center">
                <Map className="w-8 h-8 text-[#F0803C] mb-4" />
                <h4 className="text-xl font-black text-white mb-2">
                  {config.showDistance
                    ? activeTrek.title
                    : language === 'EN'
                    ? config.mapInfo?.titleEN
                    : config.mapInfo?.titleES}
                </h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  {config.showDistance
                    ? activeTrek.desc
                    : language === 'EN'
                    ? config.mapInfo?.descEN
                    : config.mapInfo?.descES}
                </p>
                <p className="text-[#F0803C]/50 text-[10px] uppercase tracking-widest font-bold mt-6">Tap to close</p>
              </div>
            ) : (
              <>
                <div
                  className="absolute inset-0 opacity-30 group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #F0803C 1px, transparent 1px)', backgroundSize: '30px 30px' }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#112217] via-transparent to-transparent z-10"></div>
                <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
                  {config.showDistance ? (
                    <div className="w-3 h-3 bg-[#F0803C] rounded-full animate-pulse shadow-[0_0_10px_#F0803C]"></div>
                  ) : (
                    <MapPin className="w-4 h-4 text-[#F0803C]" />
                  )}
                  <p className="text-[#F0803C] font-bold text-xs uppercase tracking-widest">
                    {config.showDistance ? `${activeTrek.title} Route` : locationName}
                  </p>
                </div>
                <div className="absolute top-6 right-6 z-20 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 text-white/50 text-[10px] uppercase tracking-widest font-bold">Tap for info</div>
              </>
            )}
          </div>

          {/* Stats Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 relative z-20 bg-gradient-to-br from-[#112217] to-[#0b170f]">
            <h3 className="text-2xl font-black text-white mb-6">
              {language === 'EN' ? (config.showDistance ? 'The Trek' : 'The Outing') : config.showDistance ? 'La Caminata' : 'La Salida'}
            </h3>

            <div className="space-y-6">
              {/* Distance stat only makes sense for trekking tours */}
              {config.showDistance && (
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-400">
                    <Footprints className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">
                      {animatedKms} <span className="text-lg text-white/50 font-normal">km</span>
                    </p>
                    <p className="text-sm text-white/50 uppercase tracking-wider font-bold mt-1">Distance Hiked</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="bg-[#F0803C]/10 p-3 rounded-full text-[#F0803C]">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">
                    {animatedSpeciesCount} <span className="text-lg text-white/50 font-normal">species</span>
                  </p>
                  <p className="text-sm text-white/50 uppercase tracking-wider font-bold mt-1">Unique Discoveries</p>
                  <p className="text-sm text-purple-300/80 font-bold mt-1">
                    {eliteCount} {language === 'EN' ? 'rare species' : 'especies raras'}
                  </p>
                </div>
              </div>

              {/* Rarity & Expedition Stat Row */}
              <div className="flex flex-col gap-6 mt-6 pt-6 border-t border-white/10">
                {/* Top Row: Expedition Rating */}
                <div className="flex items-start gap-4">
                  <div className={`${ratingBg} p-3 rounded-full ${ratingColor}`}>
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-2xl md:text-3xl font-black ${ratingColor}`}>{expeditionRating}</p>
                    <p className="text-sm text-white/50 uppercase tracking-wider font-bold mt-1">Expedition Rating</p>
                  </div>
                </div>

                {/* Bottom Row: Centered Rarity Score */}
                <div className="flex flex-col items-center justify-center bg-purple-500/5 rounded-2xl p-5 border border-purple-500/20 shadow-inner mt-2">
                  <p className="text-4xl md:text-5xl font-black text-purple-400 tracking-tight">{rarityStat}</p>
                  <p className="text-xs text-purple-400/70 uppercase tracking-widest font-bold mt-2">Rarity Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EXPEDITION BADGES ROW */}
      {unlockedBadges.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 md:px-6 mb-16">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Expedition Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {unlockedBadges.map((badge) => {
              const Icon = badge.icon ? BADGE_ICONS[badge.icon] : null;
              return (
                <div key={badge.id} className="bg-[#112217] border rounded-2xl p-4 flex items-center gap-4 shadow-lg" style={{ borderColor: `${badge.color}33` }}>
                  {badge.image ? (
                    <img src={badge.image} alt={language === 'EN' ? badge.titleEN : badge.titleES} className="w-12 h-12 object-contain drop-shadow-lg" />
                  ) : (
                    Icon && (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${badge.color}1A`, color: badge.color }}>
                        <Icon className="w-6 h-6" />
                      </div>
                    )
                  )}
                  <div>
                    <p className="font-black leading-tight" style={{ color: badge.color }}>
                      {language === 'EN' ? badge.titleEN : badge.titleES}
                    </p>
                    <p className="text-xs text-white/60 mt-1">{language === 'EN' ? badge.descEN : badge.descES}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* The Asymmetrical Gallery */}
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* Today's Highlights — always first, Tier 1 species only */}
        {tier1Species.length > 0 && (
          <div className="mb-16 md:mb-20">
            <div className="mb-6 md:mb-8 border-b border-white/10 pb-4">
              <div className="flex items-end justify-between mb-2">
                <h2 className="text-2xl md:text-4xl font-black text-white capitalize">{language === 'EN' ? "Today's Highlights" : 'Destacados de Hoy'}</h2>
                <span className="text-emerald-400 font-bold text-xs md:text-base mb-1">{tier1Species.length} spotted</span>
              </div>
              <p className="text-white/60 font-light italic text-sm md:text-base leading-relaxed pr-4">
                {language === 'EN' ? highlightsDesc.en : highlightsDesc.es}
              </p>
            </div>

            <div className="columns-1 sm:columns-2 gap-4 md:gap-6">
              {tier1Species.map((species) => {
                const isFlipped = flippedId === species.id;
                return (
                  <div
                    key={species.id}
                    onClick={() => setFlippedId(isFlipped ? null : species.id!)}
                    className="break-inside-avoid mb-4 md:mb-6 bg-[#112217] border border-[#F0803C]/30 rounded-3xl overflow-hidden shadow-2xl relative group flex flex-col cursor-pointer"
                  >
                    {/* ANTI-HOP FLIP OVERLAY */}
                    <div className={`absolute inset-0 z-30 bg-[#112217]/95 backdrop-blur-md p-6 md:p-8 flex flex-col justify-center items-center transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      <h3 className="text-2xl font-black text-[#F0803C] mb-4 text-center">{language === 'EN' ? species.nameEN : species.nameES}</h3>
                      <p className="text-white/80 italic text-sm md:text-base leading-relaxed text-center overflow-y-auto">
                        {language === 'EN' ? species.descEN || 'Description coming soon.' : species.descES || 'Descripción en breve.'}
                      </p>
                      {isFlipped && species.rarityScore != null && (
                        <p className="text-[#F0803C] text-xs font-black uppercase tracking-widest mt-4 shrink-0">
                          {language === 'EN' ? 'Rarity Score: ' : 'Puntaje de Rareza: '}
                          <RarityCountUp score={species.rarityScore} colorClass="text-[#F0803C]" />
                        </p>
                      )}
                      <p className="text-[#F0803C]/50 text-[10px] uppercase tracking-widest font-bold mt-4 shrink-0">Tap to close</p>
                    </div>

                    {/* BASE CARD (Always renders to hold height) */}
                    <div className="w-full relative overflow-hidden p-2 pb-0">
                      <img src={species.image} className="w-full h-auto object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-4 right-4 bg-[#F0803C] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_4px_15px_rgba(240,128,60,0.6)] z-20">
                        {language === 'EN' ? 'Highlight' : 'Destacado'}
                      </div>
                    </div>
                    <div className="p-5 pt-4">
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-1 leading-tight group-hover:text-emerald-400 transition-colors">{language === 'EN' ? species.nameEN : species.nameES}</h3>
                      <p className="text-white/50 text-sm italic font-serif">{species.scientificName}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Everything else, in the location's real section order */}
        {orderedSections.map((sectionName) => {
          const speciesInSection = groupedOthers[sectionName];
          if (!speciesInSection || speciesInSection.length === 0) return null;

          const color = getSectionColor(config, sectionName);
          const label = getSectionLabel(config, sectionName, language);
          const sectionDesc = config.sectionDescriptions[sectionName as keyof typeof config.sectionDescriptions];

          return (
            <div key={sectionName} className="mb-16 md:mb-20">
              {/* Chapter Header */}
              <div className="mb-6 md:mb-8 border-b border-white/10 pb-4">
                <div className="flex items-end justify-between mb-2">
                  <h2 className="text-2xl md:text-4xl font-black capitalize" style={{ color }}>
                    {label}
                  </h2>
                  <span className="text-emerald-400 font-bold text-xs md:text-base mb-1">{speciesInSection.length} spotted</span>
                </div>
                {sectionDesc && (
                  <p className="text-white/60 font-light italic text-sm md:text-base leading-relaxed pr-4">
                    {language === 'EN' ? sectionDesc.en : sectionDesc.es}
                  </p>
                )}
              </div>

              {/* Standard Pinterest-Style Columns */}
              <div className="columns-2 md:columns-3 gap-3 md:gap-6">
                {speciesInSection.map((species) => {
                  const isFlipped = flippedId === species.id;
                  return (
                    <div
                      key={species.id}
                      onClick={() => setFlippedId(isFlipped ? null : species.id!)}
                      className="break-inside-avoid mb-3 md:mb-6 bg-[#112217] border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-colors group cursor-pointer shadow-lg relative"
                    >
                      {/* ANTI-HOP FLIP OVERLAY */}
                      <div className={`absolute inset-0 z-30 bg-[#112217]/95 backdrop-blur-md p-4 flex flex-col justify-center items-center transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <h3 className="text-lg font-black text-emerald-400 mb-2 text-center leading-tight">{language === 'EN' ? species.nameEN : species.nameES}</h3>
                        <p className="text-white/80 italic text-xs md:text-sm leading-snug text-center overflow-y-auto">
                          {language === 'EN' ? species.descEN || 'Description coming soon.' : species.descES || 'Descripción en breve.'}
                        </p>
                        {isFlipped && species.rarityScore != null && (
                          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-3 shrink-0">
                            {language === 'EN' ? 'Rarity: ' : 'Rareza: '}
                            <RarityCountUp score={species.rarityScore} colorClass="text-emerald-400" />
                          </p>
                        )}
                      </div>

                      {/* BASE CARD (Always renders to hold height) */}
                      <div className="w-full relative overflow-hidden">
                        <img src={species.image} alt={species.nameEN} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="p-3 md:p-5">
                        <h3 className="text-sm md:text-xl font-black text-white leading-tight mb-1 group-hover:text-emerald-400 transition-colors">
                          {language === 'EN' ? species.nameEN : species.nameES}
                        </h3>
                        <p className="text-white/50 text-[10px] md:text-sm italic mb-1 md:mb-3 font-serif">
                          {species.scientificName ? species.scientificName : 'Species scientifica'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* THE POSTER MOUNT */}
      <div className="w-full mx-auto px-4 md:px-6 mb-20 mt-10 flex justify-center">
        <PrintablePoster loggedSpecies={loggedSpecies} language={language} guideName={guideName} onClose={() => {}} tourDate={demoTourDate} location={location} guestName={guestNameProp ? guestName : undefined} />
      </div>
    </div>
  );
}
