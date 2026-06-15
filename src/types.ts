export type Tier = 1 | 2 | 3;

/** Biological category — used for guide view filtering tabs */
export type BioCategory =
  | 'Mammals'
  | 'Birds'
  | 'Reptiles & Amphibians'
  | 'Flora'
  | 'Marine Life';

/** Thematic passport section — used for passport grouping and category colors */
export type PassportSection =
  | 'Hero Sightings'
  | 'Canopy Crew'
  | 'Sea & Shore'
  | 'Forest Floor'
  | 'Fascinating Flora'
  | 'Other Notable';

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
  descEN?: string;
  descES?: string;
  image: string;
}
