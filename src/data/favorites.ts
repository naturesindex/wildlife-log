import { supabase } from '../supabase';

/** Every favorite is scoped to (guide_id, location, species_id) — a guide's
 *  favorites at Corcovado are independent from their favorites at Útica. */
export async function fetchGuideFavorites(guideId: string, location: string): Promise<Set<string>> {
  if (!guideId) return new Set();

  const { data, error } = await supabase
    .from('guide_favorites')
    .select('species_id')
    .eq('guide_id', guideId)
    .eq('location', location);

  if (error) {
    console.error('Error fetching favorites:', error);
    return new Set();
  }

  return new Set((data || []).map((row: { species_id: string }) => row.species_id));
}

export async function setGuideFavorite(guideId: string, location: string, speciesId: string, isFavorite: boolean): Promise<void> {
  if (!guideId) return;

  if (isFavorite) {
    const { error } = await supabase
      .from('guide_favorites')
      .upsert({ guide_id: guideId, location, species_id: speciesId }, { onConflict: 'guide_id,location,species_id' });
    if (error) console.error('Error saving favorite:', error);
  } else {
    const { error } = await supabase
      .from('guide_favorites')
      .delete()
      .match({ guide_id: guideId, location, species_id: speciesId });
    if (error) console.error('Error removing favorite:', error);
  }
}
