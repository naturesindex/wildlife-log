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
  const secondaryName = language === 'EN' ? species.nameES : species.nameEN;

  return (
    <div className="break-inside-avoid mb-2 relative">
      <img
        src={species.image}
        alt={species.nameEN}
        className="w-full rounded-2xl object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=500';
        }}
      />
      {/* All badges use unified hero orange */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10 px-3 py-1.5 rounded-full text-center shadow-lg whitespace-nowrap"
        style={{ backgroundColor: HERO_ORANGE }}
      >
        <p className="text-white font-bold text-xs leading-tight">{primaryName}</p>
        <p className="text-white/70 text-[10px] leading-tight">{secondaryName}</p>
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
  // Priority: tier 1 first, then tier 2, then tier 3 — max 6 featured
  const sorted = [
    ...loggedSpecies.filter((s) => s.tier === 1),
    ...loggedSpecies.filter((s) => s.tier === 2),
    ...loggedSpecies.filter((s) => s.tier === 3),
  ];
  const featured = sorted.slice(0, 6);
  const otherCount = totalLogged - featured.length;

  return (
    <div
      className="relative bg-[#162b1d] rounded-2xl overflow-hidden"
      style={{ aspectRatio: '9/16' }}
    >
      {/* Photo masonry — full width, 2-column */}
      <div className="absolute inset-0 pb-52 overflow-hidden">
        <div className="w-full h-full columns-2 gap-2 p-4">
          {featured.map((s) => (
            <StoryPhoto key={s.id} species={s} language={language} />
          ))}
          {featured.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/30 text-sm">No species logged</p>
            </div>
          )}
        </div>
      </div>

      {/* Frosted-glass footer — clean centered text stack */}
      <div className="absolute bottom-0 left-0 right-0 z-20 backdrop-blur-lg bg-[#0b170f]/75 border-t border-white/10 px-6 py-6 text-center flex flex-col items-center">
        <h2
          className="font-serif text-white font-black leading-tight mb-1.5"
          style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}
        >
          What I Saw Today
        </h2>

        <p className="text-white/60 text-sm font-light italic mb-1">
          With [Your Company Name]
        </p>

        {guideName && (
          <p className="text-white/40 text-xs mb-4">
            Guide: {guideName}
          </p>
        )}
        {!guideName && <div className="mb-4" />}

        {otherCount > 0 && (
          <div
            className="inline-block rounded-full px-5 py-2"
            style={{ backgroundColor: HERO_ORANGE }}
          >
            <p className="text-white font-bold text-sm">+ {otherCount} other species!</p>
          </div>
        )}
      </div>
    </div>
  );
}
