export type Tier = 1 | 2 | 3;

/** Biological category — used for guide view filtering tabs */
export type BioCategory =
  | 'Mammals'
  | 'Birds'
  | 'Reptiles & Amphibians'
  | 'Flora'
  | 'Marine Life'
  | 'Insects & Invertebrates'
  // Útica Birding Categories — mirrors the passport section names 1:1,
  // since Útica's guide filter tabs and passport chapters use the same
  // birding taxonomy (unlike Corcovado, where category/section differ).
  | 'Raptors & Vultures'
  | 'Hummingbirds'
  | 'Tanagers & Songbirds'
  | 'Toucans & Motmots'
  | 'Woodpeckers & Barbets'
  | 'Waterbirds'
  | 'Other Discoveries';


/** Thematic passport section — used for passport grouping and category colors */
export type PassportSection =
  | 'Highlights'
  | 'The Canopy Crew'
  | 'The Forest Floor'
  | 'Sea and Shore'
  | 'Fascinating Flora'
  | 'Other Notables'
  // Útica Birding Passport Sections
  | 'Raptors & Vultures'
  | 'Hummingbirds'
  | 'Tanagers & Songbirds'
  | 'Toucans & Motmots'
  | 'Woodpeckers & Barbets'
  | 'Waterbirds'
  | 'Other Discoveries';

export type Language = 'EN' | 'ES';

export interface Species {
  id: string;
  tier: Tier;
  /** Biological category for guide-view filtering */
  category: BioCategory;
  /** Thematic section for passport grouping and color coding */
  section: PassportSection;
  isFavorite: boolean;
  isLogged: boolean;
  nameEN: string;
  nameES: string;
  scientificName?: string;
  rarityScore?: number;
  descEN?: string;
  descES?: string;
  image: string;
}

/** Dynamic titles earned based on what the guest saw */
export type ExpeditionTitle =
  | 'Primate Grand Slam' // All 4 monkeys
  | 'Elite Tracker'      // High rarity score or legendary finds
  | 'Canopy Scout'       // Bird/Canopy heavy
  | 'Micro-Explorer'     // Insects/Flora heavy
  | 'Jungle Navigator';  // Standard great day
