import { Species, Language } from '../types';

interface SocialStoryProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  totalLogged: number;
}

const HERO_ORANGE = '#C86A27';

function StoryPhoto({
  species,
  language,
}: {
  species: Species;
  language: Language;
}) {
  const primaryName = language === 'EN' ? species.nameEN : species.nameES;

  return (
 <div className="relative mb-6">
      {/* 1. Added ?v=1 to the src to bypass the broken cache */}
      <img
        src={`${species.image}?v=1`}
        alt={primaryName}
        className="w-full rounded-2xl" 
        crossOrigin="anonymous"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=500';
        }}
      />
      
      {/* 2. Swapped -translate for flexbox centering so the camera reads it properly */}
      <div className="absolute -bottom-3 left-0 w-full flex justify-center z-10">
        <div
          className="w-[90%] px-2 py-1.5 rounded-xl text-center shadow-lg flex items-center justify-center min-h-[28px]"
          style={{ backgroundColor: HERO_ORANGE }}
        >
          <p className="text-white font-bold text-xs leading-tight break-words">{primaryName}</p>
        </div>
      </div>
    </div>
  );
}
export function SocialStory({
  loggedSpecies,
  language,
  guideName,
  totalLogged,
}: SocialStoryProps) {
  const sorted = [
    ...loggedSpecies.filter((s) => s.tier === 1),
    ...loggedSpecies.filter((s) => s.tier === 2),
    ...loggedSpecies.filter((s) => s.tier === 3),
  ];
  
  // The "Elite Four" layout lock
  const featured = sorted.slice(0, 4);
  const otherCount = totalLogged - featured.length;

  const leftColumn = featured.filter((_, index) => index % 2 === 0);
  const rightColumn = featured.filter((_, index) => index % 2 !== 0);

const titleText = language === 'EN' ? 'What I Saw Today in Corcovado National Park' : 'Lo Que Vi Hoy en el Parque Nacional Corcovado';
  const withText = language === 'EN' ? 'With [Your Company Name]' : 'Con [Your Company Name]';
  const guideText = language === 'EN' ? 'Guide:' : 'Guía:';
  const otherSpeciesText = language === 'EN' ? `+ ${otherCount} other species!` : `+ ¡${otherCount} otras especies!`;
  const noSpeciesText = language === 'EN' ? 'No species logged' : 'Aún no se han registrado especies';

  return (
    <div
      className="relative bg-[#162b1d] rounded-2xl overflow-hidden"
      style={{ aspectRatio: '9/16' }}
    >
      {/* Added flex, flex-col, and justify-center to float the grid perfectly in the middle */}
      <div className="absolute inset-0 pb-[200px] p-4 flex flex-col justify-center overflow-hidden">
        {featured.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/30 text-sm">{noSpeciesText}</p>
          </div>
        ) : (
          // Added items-center to align the two columns vertically with each other
          <div className="flex gap-4 items-center">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-4">
              {leftColumn.map((s) => (
                <StoryPhoto key={s.id} species={s} language={language} />
              ))}
            </div>
            {/* Right Column - Removed the pt-6 stagger */}
            <div className="flex-1 flex flex-col gap-4"> 
              {rightColumn.map((s) => (
                <StoryPhoto key={s.id} species={s} language={language} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Frosted-glass footer */}
      <div className="absolute bottom-0 left-0 right-0 h-[200px] z-20 backdrop-blur-lg bg-[#0b170f]/75 border-t border-white/10 px-6 flex flex-col justify-center items-center text-center">
        <h2
          className="font-serif text-white font-black leading-tight mb-1.5"
          style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}
        >
          {titleText}
        </h2>

        <p className="text-white/60 text-sm font-light italic mb-1">
          {withText}
        </p>

        {guideName && (
          <p className="text-white/40 text-xs mb-4">
            {guideText} {guideName}
          </p>
        )}
        {!guideName && <div className="mb-4" />}

        {otherCount > 0 && (
          <div
            className="inline-block rounded-full px-5 py-2"
            style={{ backgroundColor: HERO_ORANGE }}
          >
            <p className="text-white font-bold text-sm">{otherSpeciesText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
