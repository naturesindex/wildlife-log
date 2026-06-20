import { LoginScreen } from './LoginScreen';
import { supabase } from '../supabase';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Species, BioCategory } from '../types';
import { initialSpecies } from '../data/species';
import { Header } from './Header';
import { SearchBar, CategoryTabs } from './Filters';
import { SpeciesGrid } from './SpeciesGrid';
import { ExportView } from './ExportView';
import { RotateCcw, Copy, Trash2 } from 'lucide-react';

type ActiveFilter = BioCategory | 'Favorites' | null;

function fuzzyMatch(str: string | undefined, query: string): boolean {
  if (!str) return false;
  const s = str.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let i = 0; i < s.length && qi < q.length; i++) {
    if (s[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

/** Normalize a raw species record from the database by filling in UI-state defaults. */
function normalize(raw: Species): Species {
  return {
    ...raw,
    isLogged: raw.isLogged ?? false,
    isFavorite: raw.isFavorite ?? false,
  };
}

export function GuidePortal() {
  // 1. Database & Session States
  const [tourId, setTourId] = useState<string | null>(() => {
    return localStorage.getItem('corcovado_tour_id') || null;
  });
  const [guideId, setGuideId] = useState(() => {
    return localStorage.getItem('corcovado_guide_id') || '';
  });

  // 1b. Initialize species from localStorage OR default data
  const [species, setSpecies] = useState<Species[]>(() => {
    const saved = localStorage.getItem('corcovado_species_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved species state', e);
      }
    }
    return (initialSpecies as Species[]).map(normalize);
  });

  const [language, setLanguage] = useState<'EN' | 'ES'>('EN');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showExport, setShowExport] = useState(false);
  
  const [guideName, setGuideName] = useState(() => {
    return localStorage.getItem('corcovado_guide_name') || '';
  });

  // Persist Guide ID and Tour ID to phone memory
  useEffect(() => {
    localStorage.setItem('corcovado_guide_id', guideId);
  }, [guideId]);

  useEffect(() => {
    if (tourId) localStorage.setItem('corcovado_tour_id', tourId);
    else localStorage.removeItem('corcovado_tour_id');
  }, [tourId]);
// --- NEW: RECENT TOURS LOGIC ---
  const [recentTours, setRecentTours] = useState<any[]>([]);
  const [loadingTours, setLoadingTours] = useState(false);

  useEffect(() => {
    // Only fetch if we are in the Lobby (logged in, but no active tour)
    if (guideId && !tourId) {
      fetchRecentTours();
    }
  }, [guideId, tourId]);

  const fetchRecentTours = async () => {
    setLoadingTours(true);
    // Fetch completed tours and their attached logs
    const { data, error } = await supabase
      .from('tours')
      .select('id, created_at, tour_logs(id)')
      .eq('guide_id', guideId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (data) {
      // Filter out tours that have 0 logs (the empty misclicks)
      const validTours = data.filter((t: any) => t.tour_logs && t.tour_logs.length > 0);
      setRecentTours(validTours);
    }
    setLoadingTours(false);
  };

  const handleDeleteTour = async (idToDelete: string) => {
    if (!window.confirm(language === 'EN' ? "Are you sure you want to delete this tour?" : "¿Seguro que quieres eliminar este tour?")) return;
    
    // Delete logs first just in case Supabase isn't set to cascade delete
    await supabase.from('tour_logs').delete().eq('tour_id', idToDelete);
    await supabase.from('tours').delete().eq('id', idToDelete);
    
    // Remove it from the screen
    setRecentTours(prev => prev.filter(t => t.id !== idToDelete));
  };

  const handleCopyTourLink = (idToCopy: string) => {
    // You can customize this URL structure later!
    const guestLink = `${window.location.origin}/tour/${idToCopy}`;
    navigator.clipboard.writeText(guestLink);
    alert(language === 'EN' ? "Guest Link Copied!" : "¡Enlace Copiado!");
  };
  // --- END RECENT TOURS LOGIC ---
  // --- NEW: Start Tour Logic ---
  const startNewTour = async () => {
    const { data, error } = await supabase
      .from('tours')
      .insert({ guide_id: guideId, status: 'active' })
      .select()
      .single();

    if (error) {
      console.error("Error starting tour:", error);
      alert(language === 'EN' ? "Failed to start tour." : "Error al iniciar el tour.");
      return;
    }

    if (data) {
      setTourId(data.id); // This officially starts the hike!
      // Clear out yesterday's checked animals
      setSpecies(prev => prev.map(s => ({ ...s, isLogged: false })));
    }
  };
  // --- END NEW ---
  // 2b. RESET STATE LOGIC ADDED
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const handleResetTour = () => {
    localStorage.removeItem('corcovado_species_state');
    setSpecies(prev => prev.map(s => ({ ...s, isLogged: false })));
    setTourId(null);
    setShowResetConfirm(false);
  };

  const handleLogout = () => {
    if (window.confirm(language === 'EN' ? "Wait! Have you saved your passport? Are you sure you want to log out?" : "¡Espera! ¿Has guardado tu pasaporte? ¿Estás seguro de que quieres cerrar sesión?")) {
      setGuideId('');
      setGuideName('');
      setTourId(null);
      localStorage.removeItem('corcovado_guide_name');
      localStorage.removeItem('corcovado_species_state');
    }
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 140);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  // 3. Save species to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('corcovado_species_state', JSON.stringify(species));
  }, [species]);

  // 4. Save guideName to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('corcovado_guide_name', guideName);
  }, [guideName]);

  // --- UPGRADED TOGGLE LOG FUNCTION ---
  const toggleLog = async (id: string) => {
    const targetSpecies = species.find((s) => s.id === id);
    if (!targetSpecies) return;
    
    const isCurrentlyLogged = targetSpecies.isLogged;

    // Instantly update the UI so it feels fast
    setSpecies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isLogged: !s.isLogged } : s))
    );

    // If a tour is active, sync this click to the cloud!
    if (tourId) {
      if (!isCurrentlyLogged) {
        const { error } = await supabase.from('tour_logs').insert({
          tour_id: tourId,
          species_id: id,
        });
        if (error) console.error("Error logging species:", error);
      } else {
        const { error } = await supabase
          .from('tour_logs')
          .delete()
          .match({ tour_id: tourId, species_id: id });
        if (error) console.error("Error removing species:", error);
      }
    }
  };
  // --- END UPGRADED TOGGLE LOG FUNCTION ---

  const toggleFavorite = useCallback((id: string) => {
    setSpecies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  }, []);

  const loggedCount = useMemo(() => species.filter((s) => s.isLogged).length, [species]);
  const loggedSpecies = useMemo(() => species.filter((s) => s.isLogged), [species]);

  const filteredSpecies = useMemo(() => {
    let result = species;

    if (activeFilter === 'Favorites') {
      result = result.filter((s) => s.isFavorite);
    } else if (activeFilter !== null) {
      result = result.filter((s) => s.category === activeFilter);
    }

    if (searchQuery.trim()) {
      result = result.filter(
        (s) =>
          fuzzyMatch(s.nameEN, searchQuery) ||
          fuzzyMatch(s.nameES, searchQuery) ||
          fuzzyMatch(s.category, searchQuery)
      );
    }

    return result;
  }, [species, activeFilter, searchQuery]);

const handleGenerateClick = async () => {
    if (tourId) {
      const { error } = await supabase
        .from('tours')
        .update({ status: 'completed' })
        .eq('id', tourId);
      if (error) console.error("Error completing tour:", error);
    }
    setShowExport(true);
  };

  // --- NEW: APP FLOW ROUTING ---
  
  // Phase 1: Not logged in? Show Login Screen.
  if (!guideId) {
    return (
      <LoginScreen 
        onLogin={(id, name) => {
          setGuideId(id);
          setGuideName(name);
        }} 
        language={language} 
        setLanguage={setLanguage} 
      />
    );
  }

// Phase 2: Logged in, but haven't started a hike? Show Lobby.
  if (!tourId) {
    // --- STATS CALCULATIONS ---
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthTours = recentTours.filter(t => {
      const d = new Date(t.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    
    // Dynamically get the current month name based on EN/ES
    const monthName = new Date().toLocaleString(language === 'EN' ? 'en-US' : 'es-ES', { month: 'long' });
    
    // *Placeholder pricing: estimating $10 per logged tour for the visual stat for now
    const allTimeEarnings = recentTours.length * 10;
    const thisMonthEarnings = thisMonthTours.length * 10;

    return (
      <div className="min-h-screen flex flex-col items-center py-12 px-6" style={{ background: '#0b170f' }}>
        {/* Language Toggle */}
        <div className="absolute top-6 right-6 flex bg-[#162b1d] rounded-full p-1 shadow-lg">
          <button onClick={() => setLanguage('EN')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${language === 'EN' ? 'bg-[#C86A27] text-white' : 'text-white/50'}`}>EN</button>
          <button onClick={() => setLanguage('ES')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${language === 'ES' ? 'bg-[#C86A27] text-white' : 'text-white/50'}`}>ES</button>
        </div>

        <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto p-4 gap-6 mt-8">
          
          {/* Header Section */}
          <div className="text-center mb-2">
            <h1 className="text-3xl font-black text-white mb-2">
              {language === 'EN' ? 'Welcome' : 'Bienvenido'}, {guideName}
            </h1>
            <p className="text-emerald-400 text-lg font-semibold drop-shadow-md">
              {language === 'EN' ? 'Ready to hit the trail?' : '¿Listo para el sendero?'}
            </p>
          </div>

          {/* STATS DASHBOARD */}
          <div className="w-full grid grid-cols-2 gap-3 mb-2">
            {/* This Month Stat */}
            <div className="bg-[#162b1d] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-1 text-center">
                {language === 'EN' ? `${monthName} Tours` : `Tours de ${monthName}`}
              </p>
              <p className="text-3xl font-black text-white">{thisMonthTours.length}</p>
              <p className="text-emerald-400 text-xs font-bold mt-1">~${thisMonthEarnings}</p>
            </div>

            {/* All Time Stat */}
            <div className="bg-[#162b1d] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#C86A27]"></div>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-1 text-center">
                {language === 'EN' ? 'All-Time Tours' : 'Tours Totales'}
              </p>
              <p className="text-3xl font-black text-white">{recentTours.length}</p>
              <p className="text-[#C86A27] text-xs font-bold mt-1">~${allTimeEarnings}</p>
            </div>
          </div>

          {/* Start Tour Button */}
          <button 
            onClick={startNewTour}
            className="w-full bg-[#C86A27] text-white font-black text-2xl py-6 rounded-3xl shadow-[0_0_40px_rgba(200,106,39,0.3)] hover:bg-[#b05a1f] transition-all transform hover:scale-105 active:scale-95 mb-4"
          >
            {language === 'EN' ? 'Start New Tour' : 'Iniciar Nuevo Tour'}
          </button>

          {/* RECENT TOURS SECTION */}
          <div className="w-full">
            <h3 className="text-white/70 font-bold uppercase tracking-widest text-xs mb-4">
              {language === 'EN' ? 'Recent Tours' : 'Tours Recientes'}
            </h3>
            
            {loadingTours ? (
              <p className="text-white/50 text-sm">{language === 'EN' ? 'Loading...' : 'Cargando...'}</p>
            ) : recentTours.length === 0 ? (
              <p className="text-white/50 text-sm italic">{language === 'EN' ? 'No completed tours yet.' : 'Aún no hay tours completados.'}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentTours.map((tour) => (
                  <div key={tour.id} className="bg-[#162b1d] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {new Date(tour.created_at).toLocaleDateString(language === 'EN' ? 'en-US' : 'es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-emerald-400/80 text-xs mt-0.5">
                        {tour.tour_logs.length} {language === 'EN' ? 'species logged' : 'especies registradas'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleCopyTourLink(tour.id)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white" title={language === 'EN' ? 'Copy Link' : 'Copiar Enlace'}>
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteTour(tour.id)} className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors text-white/50 hover:text-red-400" title={language === 'EN' ? 'Delete Tour' : 'Eliminar Tour'}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => { setGuideId(''); setGuideName(''); }} 
            className="mt-8 text-white/30 font-semibold text-sm underline hover:text-white/60 transition-colors"
          >
            {language === 'EN' ? 'Log out of Guide Portal' : 'Cerrar Sesión'}
          </button>
        </div>
      </div>
    );
  }
  // --- END NEW ---
  
if (showExport) {
    return (
      <ExportView
        loggedSpecies={loggedSpecies}
        language={language}
        guideName={guideName}
        tourId={tourId}
        onBack={() => setShowExport(false)}
        onLanguageToggle={() => setLanguage((l) => (l === 'EN' ? 'ES' : 'EN'))}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header
        language={language}
        onLanguageToggle={() => setLanguage((l) => (l === 'EN' ? 'ES' : 'EN'))}
        loggedCount={loggedCount}
        isScrolled={isScrolled}
      />

   {/* TOP BUTTONS */}
      <div className="flex justify-between items-center px-4 pt-4 mb-2 max-w-lg mx-auto">
        <button
          onClick={handleLogout}
          className="text-stone-400 hover:text-stone-600 text-sm font-semibold transition-colors underline"
        >
          {language === 'EN' ? 'Log Out' : 'Cerrar Sesión'}
        </button>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-2 text-stone-700 hover:text-red-500 text-sm font-semibold transition-colors bg-stone-100 px-3 py-1.5 rounded-full"
        >
          <RotateCcw className="w-4 h-4" />
          {language === 'EN' ? 'Start New Tour' : 'Comenzar Nuevo Tour'}
        </button>
      </div>

      <div className="max-w-lg mx-auto">
        <SearchBar value={searchQuery} onChange={setSearchQuery} language={language} />
        <CategoryTabs activeFilter={activeFilter} onChange={setActiveFilter} language={language} />
        <SpeciesGrid
          species={filteredSpecies}
          language={language}
          onToggleLog={toggleLog}
          onToggleFavorite={toggleFavorite}
        />
      </div>

    {/* Sticky Generate Passport button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-4 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/90 to-transparent">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleGenerateClick}
            className="w-full text-white font-black text-base py-4 rounded-3xl shadow-lg shadow-[#C86A27]/25 transition-all active:scale-95"
            style={{ backgroundColor: '#C86A27' }}
          >
            {language === 'EN' ? 'End Tour & Get Link' : 'Finalizar Tour y Obtener Enlace'}
          </button>
        </div>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#162b1d] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">
              {language === 'EN' ? 'Start New Tour?' : '¿Comenzar Nuevo Tour?'}
            </h3>
            <p className="text-white/70 mb-6 text-sm leading-relaxed">
              {language === 'EN' 
                ? 'This will erase all your currently logged species and start a fresh passport. Are you sure you want to proceed?' 
                : 'Esto borrará todas las especies registradas y comenzará un pasaporte nuevo. ¿Estás seguro de que deseas continuar?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all"
              >
                {language === 'EN' ? 'Cancel' : 'Cancelar'}
              </button>
              <button
                onClick={handleResetTour}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all"
              >
                {language === 'EN' ? 'Erase & Start' : 'Borrar y Empezar'}
              </button>
            </div>
          </div>
        </div>
      )}

   </div>
  );
}
