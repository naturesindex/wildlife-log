import { Species } from '../types';

/** Which lucide-react icon to render for a badge that has no custom Cloudinary
 *  artwork yet. Corcovado badges use real icon images; Útica's are brand-new
 *  so they fall back to a lucide icon until custom art is ready. */
export type BadgeIconKey = 'Feather' | 'Music2' | 'Wind' | 'Trophy' | 'Waves' | 'Mountain';

export interface BadgeDef {
  id: string;
  titleEN: string;
  titleES: string;
  descEN: string;
  descES: string;
  /** Accent color used for the badge card border/text. */
  color: string;
  /** Cloudinary artwork, if we have it. */
  image?: string;
  /** Fallback lucide icon, used when `image` isn't set. */
  icon?: BadgeIconKey;
  /** Given everything logged on the tour, does this badge unlock? */
  check: (species: Species[]) => boolean;
}

const nameIncludes = (s: Species, terms: string[]) => {
  const en = s.nameEN.toLowerCase();
  const es = s.nameES.toLowerCase();
  return terms.some((t) => en.includes(t) || es.includes(t));
};

const distinctCount = (species: Species[], predicate: (s: Species) => boolean) =>
  new Set(species.filter(predicate).map((s) => s.id)).size;

// ---------------------------------------------------------------------------
// CORCOVADO — jungle trekking badges
// ---------------------------------------------------------------------------
export const corcovadoBadges: BadgeDef[] = [
  {
    id: 'primate-grand-slam',
    titleEN: 'Primate Grand Slam',
    titleES: 'Grand Slam de Primates',
    descEN: 'Spotted all 4 Corcovado monkeys!',
    descES: '¡Avistaste los 4 monos de Corcovado!',
    color: '#FE654F',
    image: 'https://res.cloudinary.com/dcysfuoig/image/upload/v1783109116/monkey.png',
    check: (species) => {
      const monkeyNames = ['Squirrel Monkey', 'Howler Monkey', 'Spider Monkey', 'White-faced Capuchin'];
      const logged = species.map((s) => s.nameEN);
      return monkeyNames.every((m) => logged.includes(m));
    },
  },
  {
    id: 'eagle-eye',
    titleEN: 'Eagle Eye',
    titleES: 'Ojo de Águila',
    descEN: 'Logged over 10 different bird species.',
    descES: 'Registraste más de 10 especies de aves.',
    color: '#5DD9C1',
    image: 'https://res.cloudinary.com/dcysfuoig/image/upload/v1783109116/Eagle.png',
    check: (species) => species.filter((s) => s.category === 'Birds').length >= 10,
  },
  {
    id: 'jungle-ninja',
    titleEN: 'Jungle Ninja',
    titleES: 'Ninja de la Selva',
    descEN: 'Found elusive reptiles & amphibians.',
    descES: 'Encontraste esquivos reptiles y anfibios.',
    color: '#7da7d9',
    image: 'https://res.cloudinary.com/dcysfuoig/image/upload/v1783109128/ninja.png',
    check: (species) => species.filter((s) => s.category === 'Reptiles & Amphibians').length >= 2,
  },
  {
    id: 'bug-whisperer',
    titleEN: 'Bug Whisperer',
    titleES: 'Susurrador de Insectos',
    descEN: 'Investigated the tiny giants of the floor.',
    descES: 'Investigaste a los pequeños gigantes del suelo.',
    color: '#F7D08A',
    image: 'https://res.cloudinary.com/dcysfuoig/image/upload/v1783109120/Macro.png',
    // NOTE: previously checked category === 'Insects', which never matched —
    // the real category string is 'Insects & Invertebrates'.
    check: (species) => species.filter((s) => s.category === 'Insects & Invertebrates').length >= 3,
  },
  {
    id: 'myth-seeker',
    titleEN: 'Myth Seeker',
    titleES: 'Buscador de Mitos',
    descEN: 'Logged a near-mythical rarity species!',
    descES: '¡Registraste una especie de rareza casi mítica!',
    color: '#c084fc',
    image: 'https://res.cloudinary.com/dcysfuoig/image/upload/v1783184523/Mystic.png',
    check: (species) => species.some((s) => (s.rarityScore ?? 0) >= 90),
  },
  {
    id: 'gentle-giant',
    titleEN: 'Gentle Giant',
    titleES: 'Gigante Gentil',
    descEN: "Spotted Corcovado's legendary Tapir!",
    descES: '¡Avistaste al legendario Tapir de Corcovado!',
    color: '#716A5C',
    image: 'https://res.cloudinary.com/dcysfuoig/image/upload/v1783109115/tapir_-_Copy.png',
    check: (species) => species.some((s) => s.id === 'bairds-tapir' || nameIncludes(s, ['tapir'])),
  },
  {
    id: 'slow-and-steady',
    titleEN: 'Slow & Steady',
    titleES: 'Lento y Constante',
    descEN: "Spotted one of the canopy's most relaxed residents.",
    descES: 'Avistaste a uno de los residentes más relajados del dosel.',
    color: '#8F2D56',
    image: 'https://res.cloudinary.com/dcysfuoig/image/upload/v1783109122/slow_-_Copy.png',
    check: (species) => species.some((s) => nameIncludes(s, ['sloth', 'perezoso'])),
  },
];

// ---------------------------------------------------------------------------
// ÚTICA — Naturaleza Viva birding badges
// ---------------------------------------------------------------------------
export const uticaBadges: BadgeDef[] = [
  {
    id: 'hummingbird-whisperer',
    titleEN: 'Hummingbird Whisperer',
    titleES: 'Susurrador de Colibríes',
    descEN: 'Spot and log at least 3 different hummingbird species.',
    descES: 'Registra al menos 3 especies diferentes de colibríes.',
    color: '#8C5170',
    icon: 'Feather',
    check: (species) => distinctCount(species, (s) => s.category === 'Hummingbirds') >= 3,
  },
  {
    id: 'canyon-chorus',
    titleEN: 'Canyon Chorus',
    titleES: 'Coro del Cañón',
    descEN: 'Log 5+ songbirds or vocal species typical of the region.',
    descES: 'Registra 5 o más aves cantoras típicas de la región.',
    color: '#B04A3C',
    icon: 'Music2',
    check: (species) =>
      distinctCount(
        species,
        (s) => s.category === 'Tanagers & Songbirds' || s.category === 'Other Discoveries' || nameIncludes(s, ['wren', 'oriole', 'tanager'])
      ) >= 5,
  },
  {
    id: 'raptor-royalty',
    titleEN: 'Raptor Royalty',
    titleES: 'Realeza Rapaz',
    descEN: 'Spot at least 1 raptor riding the thermal currents.',
    descES: 'Avista al menos 1 rapaz surcando las corrientes térmicas.',
    color: '#C86A27',
    icon: 'Wind',
    check: (species) => species.some((s) => s.category === 'Raptors & Vultures'),
  },
  {
    id: 'magdalena-master',
    titleEN: 'Magdalena Master',
    titleES: 'Maestro del Magdalena',
    descEN: 'Log 10 total bird species during a single Útica excursion.',
    descES: 'Registra 10 especies de aves en una sola excursión en Útica.',
    color: '#4A7256',
    icon: 'Trophy',
    check: (species) => species.length >= 10,
  },
  {
    id: 'riverbank-ranger',
    titleEN: 'Riverbank Ranger',
    titleES: 'Guardián del Río',
    descEN: 'Spot at least 2 water-adjacent or riverside bird species.',
    descES: 'Avista al menos 2 especies de aves ribereñas.',
    color: '#3A7CA5',
    icon: 'Waves',
    check: (species) => distinctCount(species, (s) => nameIncludes(s, ['kingfisher', 'heron', 'egret', 'martín pescador', 'garza'])) >= 2,
  },
  {
    id: 'valley-trailblazer',
    titleEN: 'Valley Trailblazer',
    titleES: 'Pionero del Valle',
    descEN: 'Complete a full Útica excursion and log 15+ total species.',
    descES: 'Completa una excursión completa en Útica con 15+ especies.',
    color: '#F0803C',
    icon: 'Mountain',
    check: (species) => species.length >= 15,
  },
];

export function getBadges(location?: string): BadgeDef[] {
  return location === 'utica' ? uticaBadges : corcovadoBadges;
}
