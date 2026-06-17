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
    <div className="mb-8 flex flex-col items-center w-full">
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
      
      {/* Bulletproof centering: Using Grid ensures the text cannot be pushed to the bottom */}
      <div 
        className="-mt-4 z-10 w-[90%] h-12 rounded-xl shadow-lg flex items-center justify-center" 
  style={{ backgroundColor: HERO_ORANGE }}
      >
        <p className="text-white font-bold text-sm leading-none m-0 text-center">{primaryName}</p>
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
      {/* Main Content Area */}
      <div className="absolute inset-0 pb-[200px] p-4 flex flex-col justify-center overflow-hidden">
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

    {/* Frosted-glass footer - Fixed height and standard block layout */}
      {/* Frosted-glass footer - Fixed height and standard block layout */}
      <div className="absolute bottom-0 left-0 right-0 h-[220px] z-20 backdrop-blur-lg bg-[#0b170f]/75 border-t border-white/10 px-6 pt-6">
        
        {/* Title: Using a simple block with padding to keep it centered */}
        <div className="text-center mb-2">
          <h2 className="font-serif text-white font-black text-2xl leading-tight">
            What I Saw Today in<br />Corcovado National Park
          </h2>
        </div>

        {/* With Text */}
        <p className="text-white/60 text-sm font-light italic text-center mb-2">
          {withText}
        </p>

        {/* Guide Name */}
        {guideName && (
          <div className="text-center mb-4">
            <p className="text-white/40 text-xs">
              {guideText} {guideName}
            </p>
          </div>
        )}

        {/* Other Species Badge */}
        {otherCount > 0 && (
          <div className="text-center">
            <div
              className="inline-block rounded-full px-5 py-2"
              style={{ backgroundColor: HERO_ORANGE }}
            >
              <p className="text-white font-bold text-sm m-0">{otherSpeciesText}</p>
            </div>
          </div>
        )}
      </div>
