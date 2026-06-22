import { ArrowLeft, Camera, Sparkles, MapPin, Footprints, Leaf, Trophy } from 'lucide-react';
import { Species, Language } from '../types';

interface SandboxProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  onBack: () => void;
}

export function PassportSandbox({ loggedSpecies: rawSpecies, language, guideName, onBack }: SandboxProps) {
  const loggedSpecies = rawSpecies || [];
  const totalSpecies = loggedSpecies.length;
  
// Fake data for the demo (Phase 2 will make this dynamic)
  const mapKms = "8.5";
  const guestName = "Explorer"; 

  // --- 1. EXPEDITION TITLE LOGIC ---
  const monkeyNames = ["Squirrel Monkey", "Howler Monkey", "Spider Monkey", "White-faced Capuchin"];
  const loggedNames = loggedSpecies.map(s => s.nameEN);
  const hasGrandSlam = monkeyNames.every(monkey => loggedNames.includes(monkey));

  const birdCount = loggedSpecies.filter(s => s.category === 'Birds').length;
  // Checking if they looked closely at the ground/small things
  const microCount = loggedSpecies.filter(s => s.section === 'Fascinating Flora' || s.section === 'The Forest Floor').length;
  // Counting their highly rare finds
  const eliteCount = loggedSpecies.filter(s => s.tier === 1 || (s.rarityScore && s.rarityScore >= 90)).length;

  let expeditionRating = "Jungle Voyager";
  let ratingColor = "text-amber-400";
  let ratingBg = "bg-amber-500/10";

  if (hasGrandSlam) {
    expeditionRating = "Primate Grand Slam";
    ratingColor = "text-yellow-400";
    ratingBg = "bg-yellow-500/20";
  } else if (eliteCount >= 2) {
    expeditionRating = "Elite Tracker";
    ratingColor = "text-purple-400";
    ratingBg = "bg-purple-500/10";
  } else if (birdCount > totalSpecies * 0.4 && birdCount > 3) {
    expeditionRating = "Canopy Scout";
    ratingColor = "text-sky-400";
    ratingBg = "bg-sky-500/10";
  } else if (microCount > totalSpecies * 0.4 && microCount > 3) {
    expeditionRating = "Micro-Explorer";
    ratingColor = "text-emerald-400";
    ratingBg = "bg-emerald-500/10";
  } else if (totalSpecies <= 8) {
    expeditionRating = "Stealth Tracker";
    ratingColor = "text-stone-400";
    ratingBg = "bg-stone-500/10";
  } else {
    expeditionRating = "Jungle Navigator";
    ratingColor = "text-amber-400";
    ratingBg = "bg-amber-500/10";
  }

  // --- 2. BRAGGING RIGHTS MATH (Calculates their best stat) ---
  let rarityStat = "Top 25% Overall";
  const mammalCount = loggedSpecies.filter(s => s.category === 'Mammals').length;
  
  if (eliteCount >= 3) {
    rarityStat = "Top 1% for Rare Finds";
  } else if (hasGrandSlam) {
    rarityStat = "Top 2% of Explorers";
  } else if (eliteCount > 0) {
    // Math tricks it into sounding highly specific (e.g., Top 12%, Top 9%)
    rarityStat = `Top ${Math.max(2, 15 - (eliteCount * 3))}% for Rare Finds`;
  } else if (mammalCount >= 5) {
    rarityStat = `Top 8% in Mammal Sightings`;
  } else if (birdCount >= 10) {
    rarityStat = `Top 10% in Bird Sightings`;
  } else if (totalSpecies > 0) {
    rarityStat = `Top ${Math.max(10, 40 - totalSpecies)}% Overall`;
  } else {
    rarityStat = "Standard Rank";
  }

  // Group species by section, but FORCE Tier 1 into "Today's Highlights"
  const groupedSpecies = loggedSpecies.reduce((acc, species) => {
    const sec = species.tier === 1 ? "Today's Highlights" : (species.section || 'Other Notables');
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(species);
    return acc;
  }, {} as Record<string, Species[]>);

  // Preferred order for our chapters
  const sectionOrder = [
    "Today's Highlights", 
    "The Canopy Crew", 
    "The Forest Floor", 
    "Sea and Shore", 
    "Fascinating Flora", 
    "Other Notables"
  ];

  return (
    <div className="min-h-screen bg-[#060c08] text-white font-sans selection:bg-[#C86A27]/30 pb-32">
      
      {/* Dev Toolbar */}
      <div className="fixed top-0 left-0 w-full p-4 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all text-xs font-bold uppercase tracking-wider border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Sandbox
        </button>
        <div className="bg-[#C86A27] px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(200,106,39,0.5)]">
          Editorial Preview
        </div>
      </div>

      {/* Hero Cover */}
      <div className="relative pt-32 pb-16 px-6 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute top-20 left-0 w-[600px] h-[600px] bg-[#C86A27]/5 rounded-full blur-3xl -translate-x-1/2"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-[#C86A27] font-bold tracking-[0.2em] text-sm mb-6 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> VOLUME I • OFFICIAL SOUVENIR
          </p>
<h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-8">
  {guestName}'s <br className="md:hidden" />
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#C86A27] italic">Expedition</span>
</h1>
          
          {/* The Personal Story Block */}
          <div className="bg-[#112217]/60 backdrop-blur-sm border border-emerald-500/10 rounded-3xl p-8 md:p-10 text-left shadow-2xl relative overflow-hidden">
            <Leaf className="absolute -bottom-6 -right-6 w-32 h-32 text-emerald-900/20" />
            <p className="text-xl md:text-2xl text-white font-light leading-relaxed mb-4">
              {language === 'EN' ? `Dear ${guestName},` : `Estimado ${guestName},`}
            </p>
            <p className="text-white/70 md:text-lg leading-relaxed font-light">
              {language === 'EN' 
                ? `Today, you set foot in one of the most biodiverse places on Earth. Containing 2.5% of the planet's biodiversity, Corcovado National Park is a living, breathing jungle. Guided by ${guideName}, you kept your eyes peeled for the big and the small, traversing ancient trails and uncovering the secrets of the rainforest.`
                : `Hoy, pusiste un pie en uno de los lugares más biodiversos de la Tierra. Conteniendo el 2.5% de la biodiversidad del planeta, el Parque Nacional Corcovado es una selva viva. Guiado por ${guideName}, mantuviste los ojos bien abiertos para lo grande y lo pequeño, recorriendo senderos antiguos.`}
            </p>
          </div>
        </div>
      </div>

      {/* Map & Expedition Stats */}
      <div className="max-w-4xl mx-auto px-6 mb-20">
        <div className="bg-[#112217] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
          
          {/* Mock Map Side */}
          <div className="w-full md:w-1/2 h-[250px] md:h-auto relative bg-[#0b170f] overflow-hidden group">
            <div className="absolute inset-0 opacity-30 group-hover:scale-105 transition-transform duration-700" 
                 style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #C86A27 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#112217] via-transparent to-transparent z-10"></div>
            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
              <div className="w-3 h-3 bg-[#C86A27] rounded-full animate-pulse shadow-[0_0_10px_#C86A27]"></div>
              <p className="text-[#C86A27] font-bold text-xs uppercase tracking-widest">Sirena Trail Route</p>
            </div>
          </div>

{/* Stats Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 relative z-20 bg-gradient-to-br from-[#112217] to-[#0b170f]">
            <h3 className="text-2xl font-black text-white mb-6">
              {language === 'EN' ? "The Trek" : "La Caminata"}
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-400">
                  <Footprints className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">{mapKms} <span className="text-lg text-white/50 font-normal">km</span></p>
                  <p className="text-sm text-white/50 uppercase tracking-wider font-bold mt-1">Distance Hiked</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#C86A27]/10 p-3 rounded-full text-[#C86A27]">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">{totalSpecies} <span className="text-lg text-white/50 font-normal">species</span></p>
                  <p className="text-sm text-white/50 uppercase tracking-wider font-bold mt-1">Unique Discoveries</p>
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
      {(hasGrandSlam || birdCount >= 10 || loggedSpecies.some(s => ["Baird's Tapir", "Collared Peccary", "Jaguar", "Puma"].includes(s.nameEN))) && (
        <div className="max-w-5xl mx-auto px-4 md:px-6 mb-16">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Expedition Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hasGrandSlam && (
              <div className="bg-[#112217] border border-yellow-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                <div className="bg-yellow-500/10 p-3 rounded-full text-yellow-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-yellow-400 leading-tight">Primate Grand Slam</p>
                  <p className="text-xs text-white/60 mt-1">Spotted all 4 Corcovado monkeys!</p>
                </div>
              </div>
            )}
            {birdCount >= 10 && (
              <div className="bg-[#112217] border border-sky-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                <div className="bg-sky-500/10 p-3 rounded-full text-sky-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-sky-400 leading-tight">Eagle Eye</p>
                  <p className="text-xs text-white/60 mt-1">Logged over 10 different bird species.</p>
                </div>
              </div>
            )}
            {loggedSpecies.some(s => ["Baird's Tapir", "Collared Peccary", "Jaguar", "Puma"].includes(s.nameEN)) && (
              <div className="bg-[#112217] border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-400">
                  <Footprints className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-emerald-400 leading-tight">Titan Tracker</p>
                  <p className="text-xs text-white/60 mt-1">Encountered Corcovado's heavyweights.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* The Asymmetrical Gallery */}
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        
        {/* Iterate over our chapters in the preferred order */}
        {sectionOrder.map((sectionName) => {
          const speciesInSection = groupedSpecies[sectionName];
          if (!speciesInSection || speciesInSection.length === 0) return null;

          // Our new "Poetic Blurbs" dictionary!
          const descriptions: Record<string, {en: string, es: string}> = {
"Today's Highlights": { en: `The best moments from ${guestName}'s trek. Breathtaking encounters that made this expedition unforgettable.`, es: `Los mejores momentos de la caminata de ${guestName}. Encuentros impresionantes que hicieron esta expedición inolvidable.` },
            "The Canopy Crew": { en: "Life from the treetops. Looking up reveals a vibrant world of climbers and flyers.", es: "Vida desde las copas de los árboles. Mirar hacia arriba revela un mundo vibrante." },
            "The Forest Floor": { en: "The foundation of the jungle. A bustling metropolis of shadows, leaves, and stealth.", es: "Los cimientos de la selva. Una bulliciosa metrópolis de sombras, hojas y sigilo." },
            "Sea and Shore": { en: "Where the jungle meets the tide. A unique ecosystem of coastal wanderers.", es: "Donde la selva se encuentra con la marea. Un ecosistema único de vagabundos costeros." },
            "Fascinating Flora": { en: "The ancient giants and complex botanicals that breathe life into Corcovado.", es: "Los antiguos gigantes y complejos botánicos que dan vida a Corcovado." },
            "Other Notables": { en: "Every detail matters. The supporting cast that makes this ecosystem thrive.", es: "Cada detalle importa. El elenco de apoyo que hace prosperar este ecosistema." }
          };

          const sectionDesc = descriptions[sectionName] || descriptions["Other Notables"];

          return (
            <div key={sectionName} className="mb-16 md:mb-20">
              {/* Chapter Header */}
              <div className="mb-6 md:mb-8 border-b border-white/10 pb-4">
                <div className="flex items-end justify-between mb-2">
                  <h2 className="text-2xl md:text-4xl font-black text-white capitalize">
                    {language === 'EN' ? sectionName : sectionName}
                  </h2>
                  <span className="text-emerald-400 font-bold text-xs md:text-base mb-1">{speciesInSection.length} spotted</span>
                </div>
                {/* The personalized section blurb */}
                <p className="text-white/60 font-light italic text-sm md:text-base leading-relaxed pr-4">
                  {language === 'EN' ? sectionDesc.en : sectionDesc.es}
                </p>
              </div>

{/* Special Layout for Highlights */}
{sectionName === "Today's Highlights" ? (
  <div className="columns-1 sm:columns-2 gap-4 md:gap-6">
    {speciesInSection.map((species, idx) => (
      <div key={idx} className="break-inside-avoid mb-4 md:mb-6 bg-[#112217] border border-[#C86A27]/30 rounded-3xl overflow-hidden shadow-2xl relative group flex flex-col">
        <div className="w-full relative overflow-hidden p-2 pb-0">
          <img src={species.image} className="w-full h-auto object-cover rounded-2xl" />
        <div className="absolute top-4 right-4 bg-[#C86A27] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
            {language === 'EN' ? 'Highlight' : 'Destacado'}
          </div>
        </div>
        <div className="p-5 pt-4">
          <h3 className="text-2xl md:text-3xl font-black text-white mb-1 leading-tight">{language === 'EN' ? species.nameEN : species.nameES}</h3>
          <p className="text-white/50 text-sm italic font-serif">{species.scientificName}</p>
        </div>
      </div>
    ))}
  </div>
) : (
  /* Standard Pinterest-Style Columns for others */
  <div className="columns-2 md:columns-3 gap-3 md:gap-6">
    {speciesInSection.map((species, idx) => (
      <div key={idx} className="break-inside-avoid mb-3 md:mb-6 bg-[#112217] border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-colors group cursor-pointer shadow-lg">
                    <div className="w-full relative overflow-hidden">
                      <img 
                        src={species.image} 
                        alt={species.nameEN} 
                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Species Info */}
                    <div className="p-3 md:p-5">
                      <h3 className="text-sm md:text-xl font-black text-white leading-tight mb-1 group-hover:text-emerald-400 transition-colors">
                        {language === 'EN' ? species.nameEN : species.nameES}
                      </h3>
                      {/* Forced Scientific Name (with a fallback if empty!) */}
                      <p className="text-white/50 text-[10px] md:text-sm italic mb-1 md:mb-3 font-serif">
                        {species.scientificName ? species.scientificName : "Species scientifica"}
                      </p>
                      
                  {species.tier === 1 && (
                        <p className="text-white/60 text-[10px] md:text-sm leading-relaxed mt-2 border-t border-white/10 pt-2 hidden md:block">
                          {language === 'EN' ? "A standout moment from today's journey." : "Un momento destacado del viaje de hoy."}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
              </div>
            )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
