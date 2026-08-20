import { PassportSection } from '../types';

export interface LocationConfig {
  slug: string;
  nameEN: string;
  nameES: string;
  /** Line 2 on the social story / passport subheader */
  taglineEN: string;
  taglineES: string;
  /** Distance/km stat only makes sense for trekking tours, not birding */
  showDistance: boolean;
  premiumPriceUSD: number;
  /** Preferred display order for sections. Any section NOT listed here still
   *  renders — it's just appended at the end — so new/unexpected section
   *  values never get silently dropped. */
  sectionOrder: PassportSection[];
  sectionColors: Partial<Record<PassportSection, string>>;
  sectionTranslationsES: Partial<Record<PassportSection, string>>;
  sectionDescriptions: Partial<Record<PassportSection, { en: string; es: string }>>;
}

const FALLBACK_COLOR = '#636B66';

export const LOCATIONS: Record<string, LocationConfig> = {
  corcovado: {
    slug: 'corcovado',
    nameEN: 'Corcovado National Park',
    nameES: 'Parque Nacional Corcovado',
    taglineEN: 'Deep Jungle Expedition',
    taglineES: 'Expedición en la Selva',
    showDistance: true,
    premiumPriceUSD: 15,
    sectionOrder: ['The Canopy Crew', 'The Forest Floor', 'Sea and Shore', 'Fascinating Flora', 'Other Notables'],
    sectionColors: {
      'The Canopy Crew': '#4A7256',
      'The Forest Floor': '#B04A3C',
      'Sea and Shore': '#3A7CA5',
      'Fascinating Flora': '#8C5170',
      'Other Notables': FALLBACK_COLOR,
    },
    sectionTranslationsES: {
      'The Canopy Crew': 'El Equipo del Dosel',
      'The Forest Floor': 'El Suelo del Bosque',
      'Sea and Shore': 'Mar y Costa',
      'Fascinating Flora': 'Flora Fascinante',
      'Other Notables': 'Otros Notables',
    },
    sectionDescriptions: {
      'The Canopy Crew': { en: 'Life from the treetops. Looking up reveals a vibrant world of climbers and flyers.', es: 'Vida desde las copas de los árboles. Mirar hacia arriba revela un mundo vibrante.' },
      'The Forest Floor': { en: 'The foundation of the jungle. A bustling metropolis of shadows, leaves, and stealth.', es: 'Los cimientos de la selva. Una bulliciosa metrópolis de sombras, hojas y sigilo.' },
      'Sea and Shore': { en: 'Where the jungle meets the tide. A unique ecosystem of coastal wanderers.', es: 'Donde la selva se encuentra con la marea. Un ecosistema único de vagabundos costeros.' },
      'Fascinating Flora': { en: 'The ancient giants and complex botanicals that breathe life into Corcovado.', es: 'Los antiguos gigantes y complejos botánicos que dan vida a Corcovado.' },
      'Other Notables': { en: 'Every detail matters. The supporting cast that makes this ecosystem thrive.', es: 'Cada detalle importa. El elenco de apoyo que hace prosperar este ecosistema.' },
    },
  },

  utica: {
    slug: 'utica',
    nameEN: 'Útica, Cundinamarca',
    nameES: 'Útica, Cundinamarca',
    taglineEN: 'Naturaleza Viva Birding Tour',
    taglineES: 'Tour de Aves Naturaleza Viva',
    showDistance: false,
    premiumPriceUSD: 2.99,
    sectionOrder: ['Feathered Royalty', 'Jewels of the Air', 'Canopy Color', 'Forest Songbirds', 'Woodland Wonders', 'Other Discoveries'],
    sectionColors: {
      'Feathered Royalty': '#C86A27',
      'Jewels of the Air': '#8C5170',
      'Canopy Color': '#4A7256',
      'Forest Songbirds': '#B04A3C',
      'Woodland Wonders': '#3A7CA5',
      'Other Discoveries': FALLBACK_COLOR,
    },
    sectionTranslationsES: {
      'Feathered Royalty': 'Realeza Emplumada',
      'Jewels of the Air': 'Joyas del Aire',
      'Canopy Color': 'Color del Dosel',
      'Forest Songbirds': 'Aves Cantoras del Bosque',
      'Woodland Wonders': 'Maravillas del Bosque',
      'Other Discoveries': 'Otros Descubrimientos',
    },
    sectionDescriptions: {
      'Feathered Royalty': { en: "The showstoppers — the birds that stop guests mid-step every time.", es: 'Las estrellas del recorrido: las aves que detienen a los visitantes en seco.' },
      'Jewels of the Air': { en: 'Tiny, fast, and dazzling — hummingbirds in constant motion.', es: 'Pequeños, veloces y deslumbrantes: colibríes en constante movimiento.' },
      'Canopy Color': { en: 'Bright plumage moving through the mid and upper canopy.', es: 'Plumaje brillante que se mueve por el dosel medio y alto.' },
      'Forest Songbirds': { en: 'The voices of the forest, more often heard than seen.', es: 'Las voces del bosque, más escuchadas que vistas.' },
      'Woodland Wonders': { en: 'Woodpeckers, barbets, and other wood-loving specialists.', es: 'Carpinteros, torito-capitanes y otros especialistas del bosque.' },
      'Other Discoveries': { en: 'Every sighting adds to the picture of a healthy forest.', es: 'Cada avistamiento suma al retrato de un bosque saludable.' },
    },
  },
};

export function getLocationConfig(locKey?: string | null): LocationConfig {
  return LOCATIONS[locKey || 'corcovado'] || LOCATIONS.corcovado;
}

export function getSectionColor(config: LocationConfig, section: string): string {
  return config.sectionColors[section as PassportSection] ?? FALLBACK_COLOR;
}

export function getSectionLabel(config: LocationConfig, section: string, language: 'EN' | 'ES'): string {
  if (language === 'EN') return section;
  return config.sectionTranslationsES[section as PassportSection] ?? section;
}

/** Section order for a *specific* set of logged species: config order first,
 *  then any section present in the data but not in the config, so nothing
 *  ever gets silently dropped just because a config entry is missing. */
export function resolveSectionOrder(config: LocationConfig, sectionsPresent: string[]): string[] {
  const known = config.sectionOrder.filter((s) => sectionsPresent.includes(s));
  const unknown = sectionsPresent.filter((s) => !config.sectionOrder.includes(s as PassportSection));
  return [...known, ...unknown];
}
