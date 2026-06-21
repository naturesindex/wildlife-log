import { Species, Language } from '../types';

interface SocialStoryProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  totalLogged: number;
}

const HERO_ORANGE = '#C86A27';

export function SocialStory({
  loggedSpecies,
  language,
  guideName,
  totalLogged,
}: SocialStoryProps) {
  // Calculate stats for the Strava-like dashboard
  const rareSpecies = loggedSpecies.filter((s) => s.tier === 1);
  const rareCount = rareSpecies.length;
  
  // Grab top 3 for the premium showcase (dynamic grid looks better than 4 cramped ones)
  const featured = [
    ...rareSpecies,
    ...loggedSpecies.filter((s) => s.tier === 2),
    ...loggedSpecies.filter((s) => s.tier === 3),
  ].slice(0, 3);
  
  const titleTextLine1 = language === 'EN' ? 'Corcovado National Park' : 'Parque Nacional Corcovado';
  const titleTextLine2 = language === 'EN' ? 'Deep Jungle Expedition' : 'Expedición en la Selva';
  const withText = language === 'EN' ? 'Guided by' : 'Guiado por';

  return (
    <div 
      className="relative bg-[#0b170f] rounded-2xl overflow-hidden flex flex-col font-sans border border-white/10" 
      style={{ aspectRatio: '9/16' }}
    >
      {/* Top Strava-Style Stat Block */}
      <div className="w-full shrink-0 bg-[#162b1d] p-5 border-b border-white/10 relative overflow-hidden">
        {/* Fake Topo Map texture using CSS gradients */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, transparent 20%, #C86A27 21%, transparent 22%), radial-gradient(circle at 100% 0%, transparent 40%, #C86A27 41%, transparent 42%), radial-gradient(circle at 100% 0%, transparent 60%, #C86A27 61%, transparent 62%)', backgroundSize: '100px 100px' }}></div>
        
        <h3 className="text-[#C86A27] font-black tracking-widest text-[10px] uppercase mb-3 relative z-10">
          {language === 'EN' ? 'Expedition Stats' : 'Estadísticas del Trek'}
        </h3>
        
        <div className="flex justify-between items-end relative z-10">
          <div className="flex flex-col">
            <span className="text-white/50 text-[10px] uppercase font-bold tracking-wider mb-0.5">
              {language === 'EN' ? 'Total Species' : 'Especies Total'}
            </span>
            <span className="text-white font-black text-4xl leading-none">{totalLogged}</span>
          </div>
          
          <div className="flex flex-col border-l border-white/20 pl-4">
            <span className="text-white/50 text-[10px] uppercase font-bold tracking-wider mb-0.5">
              {language === 'EN' ? 'Rare Sightings' : 'Avistamientos Raros'}
            </span>
            <span className="text-emerald-400 font-black text-3xl leading-none">{rareCount}</span>
          </div>
        </div>
      </div>

      {/* Photo Showcase (Dynamic Grid) */}
      <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden bg-[#0b170f]">
        {featured.length === 0 ? (
           <div className="flex items-center justify-center h-full border-2 border-dashed border-white/10 rounded-xl">
             <p className="text-white/30 text-sm font-semibold uppercase tracking-widest">
               {language === 'EN' ? 'No species logged' : 'No hay registros'}
             </p>
           </div>
        ) : (
          <div className={`w-full h-full grid gap-2 ${featured.length === 3 ? 'grid-cols-2 grid-rows-2' : featured.length === 2 ? 'grid-cols-1 grid-rows-2' : 'grid-cols-1 grid-rows-1'}`}>
            {featured.map((s, i) => {
              const isHero = featured.length === 3 && i === 0; // First photo takes top row
              return (
                <div key={s.id} className={`relative rounded-xl overflow-hidden ${isHero ? 'col-span-2 row-span-1' : ''}`}>
                  <img 
                    src={`${s.image}?v=1`} 
                    alt={s.nameEN} 
                    className="absolute inset-0 w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                  <p className="absolute bottom-2 left-3 text-white font-bold text-xs uppercase tracking-wide shadow-black drop-shadow-md z-10">
                    {language === 'EN' ? s.nameEN : s.nameES}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="w-full shrink-0 h-[90px] bg-gradient-to-t from-[#C86A27] to-[#b05a1f] px-5 flex flex-col justify-center relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute top-0 right-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
          <div className="w-32 h-32 rounded-full border-[16px] border-white"></div>
        </div>
        <h2 className="text-white font-black text-[18px] leading-tight m-0 uppercase tracking-wide relative z-10 drop-shadow-md">
          {titleTextLine1}
        </h2>
        <p className="text-white/90 text-[10px] font-bold uppercase tracking-wider mt-0.5 relative z-10 drop-shadow-md">
          {titleTextLine2} • {withText} {guideName}
        </p>
      </div>
    </div>
  );
}
