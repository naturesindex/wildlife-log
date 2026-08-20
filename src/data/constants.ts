import { PassportSection, BioCategory } from '../types';


export const SECTION_COLORS: Record<PassportSection, string> = {
  'Highlights': '#C86A27',
  'The Canopy Crew': '#4A7256',
  'Sea and Shore': '#3A7CA5',
  'The Forest Floor': '#B04A3C',
  'Fascinating Flora': '#8C5170',
  'Other Notables': '#636B66',
  'Raptors & Vultures': '#C86A27',
  'Hummingbirds': '#8C5170',
  'Tanagers & Songbirds': '#4A7256',
  'Toucans & Motmots': '#B04A3C',
  'Woodpeckers & Barbets': '#3A7CA5',
  'Waterbirds': '#5DD9C1',
  'Other Discoveries': '#636B66',
};

export const SECTION_ORDER: PassportSection[] = [
  'Highlights',
  'The Canopy Crew',
  'The Forest Floor',
  'Sea and Shore',
  'Fascinating Flora',
];

/** Guide-view filter tabs — biological categories, Corcovado's cross-taxon set. */
export const BIO_CATEGORIES = [
  'Mammals',
  'Birds',
  'Reptiles & Amphibians',
  'Flora',
  'Insects & Invertebrates',
  'Marine Life',
] as const;

/** Guide-view filter tabs for Útica — an all-birds tour, so categories are
 *  bird families instead of cross-taxon groups. Mirrors the passport
 *  section names, since there's no separate "biological" vs "thematic"
 *  split needed when everything is a bird. */
export const UTICA_CATEGORIES = [
  'Raptors & Vultures',
  'Hummingbirds',
  'Tanagers & Songbirds',
  'Toucans & Motmots',
  'Woodpeckers & Barbets',
  'Waterbirds',
  'Other Discoveries',
] as const;

/** Picks the right filter-tab category list for a given location. */
export function getCategories(location?: string): readonly BioCategory[] {
  return location === 'utica' ? UTICA_CATEGORIES : BIO_CATEGORIES;
}
