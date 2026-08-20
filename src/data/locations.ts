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
  /** Small-caps line under the big poster title, e.g. "National Park • Costa Rica" */
  posterRegionEN: string;
  posterRegionES: string;
  /** Passport hero-page narrative. Called with the guest & guide names already
   *  resolved, so each location can tell its own story. */
  introEN: (guestName: string, guideName: string) => string;
  introES: (guestName: string, guideName: string) => string;
  /** For locations WITHOUT a trekking map (showDistance: false), this is the
   *  flip-card content shown when guests tap the map. Locations WITH a map
   *  (showDistance: true) use the per-expedition trekData dictionary instead,
   *  since their map content changes with the chosen trail/station. */
  mapInfo?: { titleEN: string; titleES: string; descEN: string; descES: string };
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
    taglineEN: 'Jungle Expedition',
    taglineES: 'Expedición en la Selva',
    showDistance: true,
    premiumPriceUSD: 15,
    posterRegionEN: 'National Park • Costa Rica',
    posterRegionES: 'Parque Nacional • Costa Rica',
    introEN: (_guestName, guideName) =>
      `Today, you set foot in one of the most biodiverse places on Earth. Corcovado National Park holds an astonishing 2.5% of the entire planet's biodiversity inside a single, living, breathing jungle — jaguars move unseen through the undergrowth, scarlet macaws blaze across the canopy, and trails wind past trees that were already ancient centuries before this park existed. Guided by ${guideName}, you kept your eyes peeled for the big and the small, traversing ancient trails, crossing rivers, and uncovering the secrets of the rainforest one sighting at a time.`,
    introES: (_guestName, guideName) =>
      `Hoy, pusiste un pie en uno de los lugares más biodiversos de la Tierra. El Parque Nacional Corcovado alberga un asombroso 2.5% de toda la biodiversidad del planeta dentro de una sola selva viva y palpitante — jaguares se mueven sin ser vistos entre la maleza, las lapas rojas cruzan el dosel en llamas de color, y los senderos pasan junto a árboles que ya eran ancestrales siglos antes de que existiera este parque. Guiado por ${guideName}, mantuviste los ojos bien abiertos para lo grande y lo pequeño, recorriendo senderos antiguos, cruzando ríos, y descubriendo los secretos de la selva avistamiento tras avistamiento.`,
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
    taglineEN: 'Naturaleza Viva',
    taglineES: 'Naturaleza Viva',
    showDistance: false,
    premiumPriceUSD: 2.99,
    posterRegionEN: 'Cundinamarca • Colombia',
    posterRegionES: 'Cundinamarca • Colombia',
    introEN: (_guestName, guideName) =>
      `Today, you slowed down in one of Cundinamarca's richest birding valleys. Along the warm slopes above the Magdalena river basin, the Naturaleza Viva route reveals a world in motion — hummingbirds flashing between blossoms, tanagers lighting up the canopy in impossible color, and raptors carving slow circles on the canyon's rising thermals. Guided by ${guideName}, you kept your eyes — and ears — open for every flash of color and every call echoing off the valley walls, one patient sighting at a time.`,
    introES: (_guestName, guideName) =>
      `Hoy, bajaste el ritmo en uno de los valles de aviturismo más ricos de Cundinamarca. En las cálidas laderas sobre la cuenca del río Magdalena, la ruta Naturaleza Viva revela un mundo en movimiento — colibríes destellando entre las flores, tangaras iluminando el dosel con colores imposibles, y rapaces trazando círculos lentos sobre las corrientes térmicas del cañón. Guiado por ${guideName}, mantuviste los ojos — y los oídos — abiertos a cada destello de color y cada canto que resonaba en las paredes del valle, un avistamiento paciente a la vez.`,
    mapInfo: {
      titleEN: 'Útica Birding Grounds',
      titleES: 'Zona de Aviturismo de Útica',
      descEN: "A gentle, slow-paced route through Útica's valley trails, garden edges, and riverside canopy — prime habitat for the tour's signature species. No rush, no distance to chase, just time to look and listen.",
      descES: 'Una ruta suave y pausada por los senderos del valle de Útica, bordes de jardín y dosel ribereño: hábitat privilegiado para las especies emblemáticas del tour. Sin prisa, sin distancia que perseguir, solo tiempo para observar y escuchar.',
    },
    sectionOrder: ['Raptors & Vultures', 'Hummingbirds', 'Tanagers & Songbirds', 'Toucans & Motmots', 'Woodpeckers & Barbets', 'Waterbirds', 'Other Discoveries'],
    sectionColors: {
      'Raptors & Vultures': '#C86A27',
      'Hummingbirds': '#8C5170',
      'Tanagers & Songbirds': '#4A7256',
      'Toucans & Motmots': '#B04A3C',
      'Woodpeckers & Barbets': '#3A7CA5',
      'Waterbirds': '#5DD9C1',
      'Other Discoveries': FALLBACK_COLOR,
    },
    sectionTranslationsES: {
      'Raptors & Vultures': 'Rapaces y Buitres',
      'Hummingbirds': 'Colibríes',
      'Tanagers & Songbirds': 'Tangaras y Aves Cantoras',
      'Toucans & Motmots': 'Tucanes y Botorros',
      'Woodpeckers & Barbets': 'Carpinteros y Toritos',
      'Waterbirds': 'Aves Acuáticas',
      'Other Discoveries': 'Otros Descubrimientos',
    },
    sectionDescriptions: {
      'Raptors & Vultures': { en: "Sharp-eyed hunters riding the canyon's thermal currents.", es: 'Cazadores de vista aguda que surcan las corrientes térmicas del cañón.' },
      'Hummingbirds': { en: 'Tiny, fast, and dazzling — hummingbirds in constant motion.', es: 'Pequeños, veloces y deslumbrantes: colibríes en constante movimiento.' },
      'Tanagers & Songbirds': { en: 'Bright plumage and constant chatter through the mid canopy.', es: 'Plumaje brillante y canto constante en el dosel medio.' },
      'Toucans & Motmots': { en: "Oversized bills and pendulum tails — the valley's showiest residents.", es: 'Picos enormes y colas pendulares: los residentes más vistosos del valle.' },
      'Woodpeckers & Barbets': { en: 'Woodpeckers, barbets, and other wood-loving specialists.', es: 'Carpinteros, torito-capitanes y otros especialistas del bosque.' },
      'Waterbirds': { en: "Riverside waders and divers working the Magdalena's edge.", es: 'Zancudas y buceadoras ribereñas que trabajan la orilla del Magdalena.' },
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
