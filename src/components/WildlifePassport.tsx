import { Species, Language } from '../types';

interface PassportProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
}

const PASSPORT_DATE = new Date().toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const HERO_ORANGE = '#C86A27';

const SECTION_COLORS: Record<string, string> = {
  Hero: '#C86A27',
  'Hero Sightings': '#C86A27',
  'The Canopy Crew': '#4A7256',
  'Canopy Crew': '#4A7256',
  'Wings of the Forest': '#5A8266',
  'The Forest Floor': '#B04A3C',
  'Forest Floor': '#B04A3C',
  'Sea and Shore': '#3A7CA5',
  'Sea & Shore': '#3A7CA5',
  'Fascinating Flora': '#8C5170',
  'Other Notables': '#636B66',
  'Other Notable': '#636B66',
};

const DEFAULT_SECTION_COLOR = '#636B66';

function getSectionColor(section: string): string {
  return SECTION_COLORS[section] ?? DEFAULT_SECTION_COLOR;
}

function PassportImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full rounded-2xl object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800';
      }}
    />
  );
}

function NameBadge({
  species,
  language,
  color,
}: {
  species: Species;
  language: Language;
  color: string;
}) {
  const primary = language === 'EN' ? species.nameEN : species.nameES;

  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10 px-4 py-2 rounded-full text-center shadow-xl whitespace-nowrap"
      style={{ backgroundColor: color }}
    >
      <p className="text-white font-bold text-sm leading-tight">{primary}</p>
    </div>
  );
}

function SectionHeader({ title, color }: { title: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-8 mt-10">
      <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <h2 className="text-white font-black text-xl tracking-widest uppercase">{title}</h2>
    </div>
  );
}

function HeroEntry({
  species,
  language,
  color,
}: {
  species: Species;
  language: Language;
  color: string;
  index: number;
}) {
  const desc = language === 'EN' ? species.descEN : species.descES;

  return (
    <div className="mb-12">
      <div className="relative mb-6">
        <PassportImage src={species.image} alt={language === 'EN' ? species.nameEN : species.nameES} />
        <NameBadge species={species} language={language} color={color} />
      </div>
      {desc && (
        <p className="text-[#c8d8c0] text-sm leading-relaxed text-center px-4">{desc}</p>
      )}
    </div>
  );
}

function Tier2Entry({
  species,
  language,
  color,
}: {
  species: Species;
  language: Language;
  color: string;
}) {
  const desc = language === 'EN' ? species.descEN : species.descES;

  return (
    <div className="break-inside-avoid mb-4">
      <div className="relative mb-6">
        <PassportImage src={species.image} alt={species.nameEN} />
        <NameBadge species={species} language={language} color={color} />
      </div>
      {desc && (
        <p className="text-[#b8c8b0] text-xs leading-relaxed text-center px-1">{desc}</p>
      )}
    </div>
  );
}

function Tier3Entry({
  species,
  language,
  color,
}: {
  species: Species;
  language: Language;
  color: string;
}) {
  return (
    <div className="break-inside-avoid mb-4">
      <div className="relative mb-6">
        <PassportImage src={species.image} alt={species.nameEN} />
        <NameBadge species={species} language={language} color={color} />
      </div>
    </div>
  );
}

export function WildlifePassport({ loggedSpecies, language, guideName }: PassportProps) {
  const sectionOrder = [
    'Hero',
    'Hero Sightings',
    'The Canopy Crew',
    'Canopy Crew',
    'Wings of the Forest',
    'The Forest Floor',
    'Forest Floor',
    'Sea and Shore',
    'Sea & Shore',
    'Fascinating Flora',
    'Other Notables',
    'Other Notable',
  ];

  // Group logged species by section ONCE, then order by priority
  const grouped = loggedSpecies.reduce<Record<string, Species[]>>((acc, s) => {
    const sec = s.section;
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(s);
    return acc;
  }, {});
  const orderedSections = sectionOrder.filter((sec) => grouped[sec]);

  return (
    <div className="bg-[#162b1d] rounded-2xl overflow-hidden">
      <div className="p-6">
        <p className="text-[#8FCB8C] text-sm font-semibold tracking-wide mb-4">
          Corcovado National Park — {PASSPORT_DATE}
        </p>

        <div className="flex items-start justify-between gap-4 mb-6">
          <h1
            className="font-serif text-white font-black leading-none"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 3.5rem)' }}
          >
            Wildlife
            <br />
            Passport
          </h1>
          <div className="flex-shrink-0 border-2 border-[#4A7A5A] rounded-xl p-3 text-center min-w-[100px]">
            <p className="text-[#6A9A7A] text-xs font-semibold leading-snug">
              [ YOUR LOGO HERE ]
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="text-[#8A9A88] text-sm">
            Guide:{' '}
            <span className="text-white font-bold">
              {guideName || '___________'}
            </span>
          </p>
        </div>
      </div>

      <div className="px-6 pb-8">
        {orderedSections.map((section) => {
          const animals = grouped[section];
          const color = getSectionColor(section);
          const tier1 = animals.filter((s) => s.tier === 1);
          const tier2 = animals.filter((s) => s.tier === 2);
          const tier3 = animals.filter((s) => s.tier === 3);

          return (
            <div key={section}>
              <SectionHeader title={section} color={color} />

              {tier1.map((s, i) => (
                <HeroEntry key={s.id} species={s} language={language} color={color} index={i} />
              ))}

              {tier2.length > 0 && (
                <div className="columns-1 md:columns-2 gap-4 mb-4">
                  {tier2.map((s) => (
                    <div key={s.id} className="break-inside-avoid mb-4">
                      <Tier2Entry species={s} language={language} color={color} />
                    </div>
                  ))}
                </div>
              )}

              {tier3.length > 0 && (
                <div className="columns-1 md:columns-2 gap-4 mb-4">
                  {tier3.map((s) => (
                    <div key={s.id} className="break-inside-avoid mb-4">
                      <Tier3Entry species={s} language={language} color={color} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {loggedSpecies.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[#4A6A4A]">No species logged yet.</p>
          </div>
        )}

        <div className="border-t border-white/10 pt-5 mt-6 text-center">
          <p className="text-[#4A6A4A] text-sm font-medium">© Nature's Index</p>
        </div>
      </div>
    </div>
  );
}
