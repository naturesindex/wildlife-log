import { Species, Language } from '../types';
import { getLocationConfig, getSectionColor, getSectionLabel, resolveSectionOrder } from '../data/locations';

interface PassportProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  location?: string;
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
      // Removed whitespace-nowrap, added w-[90%] to force wrapping, changed to rounded-xl
      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10 w-[90%] px-3 py-1.5 rounded-xl text-center shadow-xl flex items-center justify-center min-h-[32px]"
      style={{ backgroundColor: color }}
    >
      <p className="text-white font-bold text-xs leading-tight break-words">{primary}</p>
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
        <img
          src={species.image}
          alt={language === 'EN' ? species.nameEN : species.nameES}
          className="w-full rounded-2xl"
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
        <img
          src={species.image}
          alt={language === 'EN' ? species.nameEN : species.nameES}
          className="w-full rounded-2xl"
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

export function WildlifePassport({ loggedSpecies, language, guideName, location }: PassportProps) {
  const config = getLocationConfig(location);

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

  // Config order first, then any section present in the data but missing from
  // config — so a typo'd or new section value still renders instead of vanishing.
  const orderedSections = resolveSectionOrder(config, Object.keys(groupedOthers));

  return (
    <div className="bg-[#162b1d] rounded-2xl overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="p-6">
        <div className="mb-5">
          <p className="text-[#8FCB8C] text-sm font-bold tracking-wide">
            {language === 'EN' ? config.nameEN : config.nameES}
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
              {language === 'EN' ? (
                <>
                  [ YOUR LOGO ]<br />HERE
                </>
              ) : (
                <>
                  [ TU LOGO ]<br />AQUÍ
                </>
              )}
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
              title={language === 'EN' ? "Today's Highlights" : 'Destacados de Hoy'} 
              color="#C86A27" 
            />
            {tier1Species.map((s) => (
              <HeroEntry 
                key={s.id} 
                species={s} 
                language={language} 
                color="#C86A27" 
              />
            ))}
          </div>
        )}

        {/* Render the Photo Grids for everything else */}
        {orderedSections.map((section) => {
          const animals = groupedOthers[section];
          const color = getSectionColor(config, section);

          return (
            <div key={section} className="mb-8">
              <SectionHeader title={getSectionLabel(config, section, language)} color={color} />
              
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
