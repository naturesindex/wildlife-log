import { LoginScreen } from './components/LoginScreen';
import { supabase } from './supabase';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Species, BioCategory } from './types';
import { initialSpecies } from './data/species';
import { Header } from './components/Header';
import { SearchBar, CategoryTabs } from './components/Filters';
import { SpeciesGrid } from './components/SpeciesGrid';
import { ExportView } from './components/ExportView';
import { RotateCcw } from 'lucide-react'; // 1. IMPORT ADDED

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

function GuideNameModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal box */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="font-serif text-stone-900 font-black text-2xl mb-2">
          Almost ready!
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          Enter your name for the passport and social story.
        </p>

        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
          Guide's Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onConfirm(name)}
          placeholder="e.g. Maria Rodríguez"
          autoFocus
          className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 text-stone-900 font-medium placeholder:text-stone-300 outline-none focus:border-stone-400 transition-colors mb-5 text-base"
        />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border-2 border-stone-200 text-stone-500 font-bold text-sm transition-all hover:border-stone-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(name)}
            className="flex-1 py-3 rounded-2xl text-white font-bold text-sm transition-all active:scale-95"
            style={{ backgroundColor: '#C86A27' }}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // 1. Database & Session States
  const [tourId, setTourId] = useState<string | null>(null);
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
  const [showModal, setShowModal] = useState(false);
  const [showExport, setShowExport] = useState(false);
  
  const [guideName, setGuideName] = useState(() => {
    return localStorage.getItem('corcovado_guide_name') || '';
  });

  // Persist Guide ID to phone memory
  useEffect(() => {
    localStorage.setItem('corcovado_guide_id', guideId);
  }, [guideId]);

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
    localStorage.removeItem('corcovado_guide_name');
    setSpecies(prev => prev.map(s => ({ ...s, isLogged: false })));
    setGuideName('');
    setShowResetConfirm(false);
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

  const handleGenerateClick = () => setShowModal(true);

  const handleModalConfirm = (name: string) => {
    setGuideName(name);
    setShowModal(false);
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#0b170f' }}>
        {/* Language Toggle */}
        <div className="absolute top-6 right-6 flex bg-[#162b1d] rounded-full p-1 shadow-lg">
          <button onClick={() => setLanguage('EN')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${language === 'EN' ? 'bg-[#C86A27] text-white' : 'text-white/50'}`}>EN</button>
          <button onClick={() => setLanguage('ES')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${language === 'ES' ? 'bg-[#C86A27] text-white' : 'text-white/50'}`}>ES</button>
        </div>

        <h1 className="text-3xl font-black text-white mb-2 text-center">
          {language === 'EN' ? 'Welcome' : 'Bienvenido'}, {guideName}
        </h1>
        <p className="text-emerald-400 text-xl font-semibold drop-shadow-md">
          {language === 'EN' ? 'Ready to hit the trail?' : '¿Listo para el sendero?'}
        </p>

        <button 
          onClick={startNewTour}
          className="bg-[#C86A27] text-white font-black text-2xl px-12 py-6 rounded-3xl shadow-[0_0_40px_rgba(200,106,39,0.3)] hover:bg-[#b05a1f] transition-all transform hover:scale-105 active:scale-95"
        >
          {language === 'EN' ? 'Start New Tour' : 'Iniciar Nuevo Tour'}
        </button>

        <button 
          onClick={() => { setGuideId(''); setGuideName(''); }} 
          className="mt-16 text-white/30 font-semibold text-sm underline hover:text-white/60 transition-colors"
        >
          {language === 'EN' ? 'Log out of Guide Portal' : 'Cerrar Sesión'}
        </button>
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
        onBack={() => setShowExport(false)}
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

     {/* START NEW TOUR BUTTON */}
      <div className="flex justify-end px-4 pt-4 mb-2 max-w-lg mx-auto">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-2 text-stone-700 hover:text-red-500 text-sm font-semibold transition-colors bg-stone-100 px-3 py-1.5 rounded-full"
        >
          <RotateCcw className="w-4 h-4" />
          {language === 'EN' ? 'Start New Tour' : 'Comenzar Nuevo Tour'}
        </button>
      </div>

      <div className="max-w-lg mx-auto">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryTabs activeFilter={activeFilter} onChange={setActiveFilter} />
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
            {language === 'EN' ? 'Generate Passport' : 'Generar Pasaporte'}
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

      {/* Guide name modal */}
      {showModal && (
        <GuideNameModal
          onConfirm={handleModalConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
