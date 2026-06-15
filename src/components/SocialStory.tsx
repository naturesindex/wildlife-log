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
    // Removed the bottom margin since the flex gap handles it now
    <div className="relative">
      <img
        src={species.image}
        alt={primaryName}
        // Removed aspect ratio and object-cover to allow natural photo height
        className="w-full rounded-2xl" 
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=500';
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10 px-3 py-1.5 rounded-full text-center shadow-lg whitespace-nowrap"
        style={{ backgroundColor: HERO_ORANGE }}
      >
        <p className="text-white font-bold text-xs leading-tight">{primaryName}</p>
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
  
  const featured = sorted.slice(0, 6);
  const otherCount = totalLogged - featured.length;

  // --- JS Split Logic for True Masonry ---
  // We split the images into two distinct arrays so CSS doesn't get confused
  const leftColumn = featured.filter((_, index) => index % 2 === 0);
  const rightColumn = featured.filter((_, index) => index % 2 !== 0);

  // --- Dynamic Translations ---
  const titleText = language === 'EN' ? 'What I Saw Today' : 'Lo Que Vi Hoy';
  const withText = language === 'EN' ? 'With [Your Company Name]' : 'Con [Your Company Name]';
  const guideText = language === 'EN' ? 'Guide:' : 'Guía:';
  const otherSpeciesText = language === 'EN' ? `+ ${otherCount} other species!` : `+ ¡${otherCount} otras especies!`;
  const noSpeciesText = language === 'EN' ? 'No species logged' : 'Aún no se han registrado especies';

  return (
    <div
      className="relative bg-[#162b1d] rounded-2xl overflow-hidden"
      style={{ aspectRatio: '9/16' }}
    >
      {/* Container for images with padding at the bottom for the footer */}
      <div className="absolute inset-0 pb-[200px] p-4 overflow-hidden">
        {featured.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/30 text-sm">{noSpeciesText}</p>
          </div>
        ) : (
          // The Two-Column Flexbox Setup
          <div className="flex gap-4 content-start">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-6">
              {leftColumn.map((s) => (
                <StoryPhoto key={s.id} species={s} language={language} />
              ))}
            </div>
            {/* Right Column */}
            <div className="flex-1 flex flex-col gap-6 pt-6"> 
              {/* Note: 'pt-6' gives the right column a slight offset for that authentic Pinterest look */}
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
