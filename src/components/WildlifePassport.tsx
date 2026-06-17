import { Species, Language } from '../types';

interface PassportProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
}

// We keep a single unified color map based on the English section keys
const SECTION_COLORS: Record<string, string> = {
  "Today's Highlights": '#C86A27',
  'The Canopy Crew': '#4A7256',
  'The Forest Floor': '#B04A3C',
  'Sea and Shore': '#3A7CA5',
  'Fascinating Flora': '#8C5170',
  'Other Notables': '#636B66',
};

function getSectionColor(section: string): string {
  return SECTION_COLORS[section] ?? '#636B66';
}

// Helper to translate section headers dynamically
function translateSection(section: string, language: Language): string {
  if (language === 'EN') return section;
  
  const translations: Record<string, string> = {
    "Today's Highlights": "Destacados de Hoy",
    "The Canopy Crew": "El Equipo del Dosel",
    "The Forest Floor": "El Suelo del Bosque",
    "Sea and Shore": "Mar y Costa",
    "Fascinating Flora": "Flora Fascinante",
    "Other Notables": "Otros Notables"
  };
  
  return translations[section] || section;
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
    <div className="absolute -bottom-4 left-0 w-full flex justify-center z-10">
      <div
        className="w-[90%] px-3 py-2 rounded-xl text-center shadow-xl min-h-[32px]"
        style={{ backgroundColor: color }}
      >
        <p className="text-white font-bold text-xs leading-none">{primary}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, color }: { title: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-8 mt-10">
      {/* Set the bar to a fixed height and use flex-shrink-0 to lock it */}
      <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      {/* Use grid or flex with items-center to force the title to look at the center of the bar */}
      <h2 className="text-white font-black text-xl tracking-widest uppercase flex items-center h-8 leading-none">
        {title}
      </h2>
    </div>
  );
}

// Hero Entry is exclusively for Tier 1 species (includes description)
function HeroEntry({
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
    <div className="mb-12">
     {/* Added mb-8 so taller text badges don't crowd the description below */}
      <div className="relative mb-8">
        {/* Added ?v=1 cache buster to the image src */}
        <img
          src={`${species.image}?v=1`}
          alt={language === 'EN' ? species.nameEN : species.nameES}
          className="w-full rounded-2xl"
          crossOrigin="anonymous"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <NameBadge species={species} language={language} color={color} />
      </div>
      {desc && (
        <p className="text-[#c8d8c0] text-sm leading-relaxed text-center px-4">{desc}</p>
      )}
    </div>
  );
}

// Grid Entry is for Tier 2/3 (Photo and Name only, no description)
function GridEntry({
  species,
  language,
  color,
}: {
  species: Species;
  language: Language;
  color: string;
}) {
  return (
    // Increased mb-6 to mb-8 to account for taller wrapping badges sticking into the gap
    <div className="break-inside-avoid mb-8">
      <div className="relative">
        {/* Added ?v=1 cache buster to the image src */}
        <img
          src={`${species.image}?v=1`}
          alt={language === 'EN' ? species.nameEN : species.nameES}
          className="w-full rounded-2xl"
          crossOrigin="anonymous"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <NameBadge species={species} language={language} color={color} />
      </div>
    </div>
  );
}

export function WildlifePassport({ loggedSpecies, language, guideName }: PassportProps) {
  // Generate the date dynamically based on the current language tab
  const dateLocale = language === 'EN' ? 'en-US' : 'es-ES';
  const passportDate = new Date().toLocaleDateString(dateLocale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // 1. Extract all Tier 1 species for the Highlights section
  const tier1Species = loggedSpecies.filter((s) => s.tier === 1);
  
  // 2. Extract non-Tier 1 species and group them by section
  const otherSpecies = loggedSpecies.filter((s) => s.tier !== 1);
  const groupedOthers = otherSpecies.reduce<Record<string, Species[]>>((acc, s) => {
    const sec = s.section;
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(s);
    return acc;
  }, {});

  const sectionOrder = [
    'The Canopy Crew',
    'The Forest Floor',
    'Sea and Shore',
    'Fascinating Flora',
    'Other Notables'
  ];
  
  const orderedSections = sectionOrder.filter((sec) => groupedOthers[sec]);

  return (
    <div className="bg-[#162b1d] rounded-2xl overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="p-6">
        <div className="mb-5">
          <p className="text-[#8FCB8C] text-sm font-bold tracking-wide">
            {language === 'EN' ? 'Corcovado National Park' : 'Parque Nacional Corcovado'}
          </p>
          <p className="text-[#6A9A7A] text-xs font-medium mt-1 capitalize">
            {passportDate}
          </p>
        </div>

        <div className="flex items-start justify-between gap-4 mb-6">
          <h1
            className="font-serif text-white font-black leading-none"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 3.5rem)' }}
          >
            {language === 'EN' ? (
              <>Wildlife<br />Passport</>
            ) : (
              <>Pasaporte<br />de Fauna</>
            )}
          </h1>
          
          <div className="flex-shrink-0 border-2 border-[#4A7A5A] rounded-xl w-20 h-20 flex flex-col items-center justify-center bg-black/20">
            <p className="text-[#6A9A7A] text-[10px] font-black leading-tight text-center">
              [ YOUR LOGO ]<br />HERE
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="text-[#8A9A88] text-sm">
            {language === 'EN' ? 'Guide:' : 'Guía:'}{' '}
            <span className="text-white font-bold">
              {guideName || '___________'}
            </span>
          </p>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="px-6 pb-8">
        
        {/* Render "Today's Highlights" if there are any Tier 1 species */}
        {tier1Species.length > 0 && (
          <div className="mb-10">
            <SectionHeader 
              title={translateSection("Today's Highlights", language)} 
              color={getSectionColor("Today's Highlights")} 
            />
            {tier1Species.map((s) => (
              <HeroEntry 
                key={s.id} 
                species={s} 
                language={language} 
                color={getSectionColor("Today's Highlights")} 
              />
            ))}
          </div>
        )}

        {/* Render the Photo Grids for everything else */}
        {orderedSections.map((section) => {
          const animals = groupedOthers[section];
          const color = getSectionColor(section);

          return (
            <div key={section} className="mb-8">
              <SectionHeader title={translateSection(section, language)} color={color} />
              
              <div className="columns-2 gap-4">
                {animals.map((s) => (
                  <GridEntry key={s.id} species={s} language={language} color={color} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {loggedSpecies.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[#4A6A4A]">
              {language === 'EN' ? 'No species logged yet.' : 'Aún no se han registrado especies.'}
            </p>
          </div>
        )}

        <div className="border-t border-white/10 pt-5 mt-6 text-center">
          <p className="text-[#4A6A4A] text-sm font-medium">© Nature's Index</p>
        </div>
      </div>
    </div>
  );
}
