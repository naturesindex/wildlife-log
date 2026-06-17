import { PassportSection } from '../types';

export const SECTION_COLORS: Record<PassportSection, string> = {
  'Hero Sightings': '#C86A27',
  'Canopy Crew': '#4A7256',
  'Sea & Shore': '#3A7CA5',
  'Forest Floor': '#B04A3C',
  'Fascinating Flora': '#8C5170',
  'Other Notable': '#636B66',
};

export const SECTION_ORDER: PassportSection[] = [
  'Hero Sightings',
  'Canopy Crew',
  'Forest Floor',
  'Sea & Shore',
  'Fascinating Flora',
];

export const BIO_CATEGORIES = [
  'Mammals',
  'Birds',
  'Reptiles & Amphibians',
  'Flora',
  'Marine Life',
  'Insects & Invertebrates',
] as const;
