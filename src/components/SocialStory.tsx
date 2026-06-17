import { Species, Language } from '../types';

interface SocialStoryProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  totalLogged: number;
}

const HERO_ORANGE = '#C86A27';

function StoryPhoto({ species, language }: { species: Species; language: Language; }) {
  const primaryName = language === 'EN' ? species.nameEN : species.nameES;
  return (
    <div className="w-full relative mb-6">
      <img
        src={`${species.image}?v=1`}
        alt={primaryName}
        className="w-full rounded-2xl"
        crossOrigin="anonymous"
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=500'; }}
      />
      <div className="absolute -bottom-4 left-0 w-full flex justify-center z-20">
        <div className="w-[75%] py-1.5 px-3 rounded-lg shadow-md flex items-center justify-center" style={{ backgroundColor: HERO_ORANGE }}>
          <p className="text-white font-bold text-[10px] leading-none m-0 text-center truncate">{primaryName}</p>
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
  
  const featured = sorted.slice(0, 4);
  const otherCount = totalLogged - featured.length;

  const leftColumn = featured.filter((_, index) => index % 2 === 0);
  const rightColumn = featured.filter((_, index) => index % 2 !== 0);

  const titleTextLine1 = language === 'EN' ? 'What I Saw Today in' : 'Lo Que Vi Hoy en el';
  const titleTextLine2 = language === 'EN' ? 'Corcovado National Park' : 'Parque Nacional Corcovado';
  const withText = language === 'EN' ? 'With [Your Company Name]' : 'Con [Your Company Name]';
  const guideText = language === 'EN' ? 'Guide:' : 'Guía:';
  const otherSpeciesText = language === 'EN' ? `+ ${otherCount} other species!` : `+ ¡${otherCount} otras especies!`;
  const noSpeciesText = language === 'EN' ? 'No species logged' : 'Aún no se han registrado especies';

  return (
    <div
      className="relative bg-[#162b1d] rounded-2xl overflow-hidden"
      style={{ aspectRatio: '9/16' }}
    >
      <div className="absolute inset-0 pb-[220px] p-4 flex flex-col justify-center overflow-hidden">
        {featured.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/30 text-sm">{noSpeciesText}</p>
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <div className="flex-1 flex flex-col gap-4">
              {leftColumn.map((s) => (
                <StoryPhoto key={s.id} species={s} language={language} />
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-4"> 
              {rightColumn.map((s) => (
                <StoryPhoto key={s.id} species={s} language={language} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer - Fixed height with standard block flow for reliable rendering */}
      <div className="absolute bottom-0 left-0 right-0 h-[220px] z-20 backdrop-blur-lg bg-[#0b170f]/75 border-t border-white/10 px-6 pt-6">
        <div className="text-center mb-2">
          <h2 className="font-serif text-white font-black text-2xl leading-tight">
            {titleTextLine1}<br />{titleTextLine2}
          </h2>
        </div>

        <p className="text-white/60 text-sm font-light italic text-center mb-2">
          {withText}
        </p>

        {guideName && (
          <div className="text-center mb-4">
            <p className="text-white/40 text-xs">
              {guideText} {guideName}
            </p>
          </div>
        )}

        {otherCount > 0 && (
          <div className="text-center">
            <div className="inline-block rounded-full px-5 py-2" style={{ backgroundColor: HERO_ORANGE }}>
              <p className="text-white font-bold text-sm m-0">{otherSpeciesText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
