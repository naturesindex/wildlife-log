import { PassportSection } from '../types';


export const SECTION_COLORS: Record<PassportSection, string> = {
  'Highlights': '#C86A27',
  'The Canopy Crew': '#4A7256',
  'Sea and Shore': '#3A7CA5',
  'The Forest Floor': '#B04A3C',
  'Fascinating Flora': '#8C5170',
  'Other Notables': '#636B66',
  'Feathered Royalty': '#C86A27',
  'Jewels of the Air': '#8C5170',
  'Canopy Color': '#4A7256',
  'Forest Songbirds': '#B04A3C',
  'Woodland Wonders': '#3A7CA5',
  'Other Discoveries': '#636B66',
};

export const SECTION_ORDER: PassportSection[] = [
  'Highlights',
  'The Canopy Crew',
  'The Forest Floor',
  'Sea and Shore',
  'Fascinating Flora',
];

export const BIO_CATEGORIES = [
  'Mammals',
  'Birds',
  'Reptiles & Amphibians',
  'Flora',
  'Insects & Invertebrates',
  'Marine Life',
] as const;
