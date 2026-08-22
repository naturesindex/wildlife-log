import { LoginScreen } from './LoginScreen';
import { supabase } from '../supabase';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Species, BioCategory } from '../types';
import { initialSpecies } from '../data/corcovado';
import { uticaSpecies } from '../data/utica';
import { LOCATIONS, formatMoney } from '../data/locations';
import { Header } from './Header';
import { SearchBar, CategoryTabs } from './Filters';
import { SpeciesGrid } from './SpeciesGrid';
import { ExportView } from './ExportView';
import { PassportSandbox } from './PassportSandbox';
import { fetchGuideFavorites, setGuideFavorite } from '../data/favorites';
import { RotateCcw, Copy, Trash2, Eye } from 'lucide-react';

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
  // Traffic Cop: Check the URL to see which location we are in.
  // NOTE: this is only a starting guess — whichever company the guide
  // actually logs in as is what determines the real location (see onLogin
  // below). Falling back to 'corcovado' here just picks a default dataset
  // to render behind the login screen; it's never trusted post-login.
  const { location } = useParams<{ location: string }>();
  const navigate = useNavigate();
  const locKey = location || 'corcovado';
  const activeDataset = locKey === 'utica' ? uticaSpecies : initialSpecies;

  // 1. Database & Session States (Dynamic based on location!)
  const [tourId, setTourId] = useState<string | null>(() => {
    return localStorage.getItem(`${locKey}_tour_id`) || null;
  });
  
  const [guideId, setGuideId] = useState(() => {
    return localStorage.getItem(`${locKey}_guide_id`) || '';
  });

  const [sessionActive, setSessionActive] = useState(() => {
    return localStorage.getItem(`${locKey}_session_active`) !== 'false';
  });

  // 1b. Initialize species from localStorage OR default data
  const [species, setSpecies] = useState<Species[]>(() => {
    const saved = localStorage.getItem(`${locKey}_species_state`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved species state', e);
      }
    }
    return (activeDataset as Species[]).map(normalize);
  });

const [language, setLanguage] = useState<'EN' | 'ES'>('EN');
const [expeditionType, setExpeditionType] = useState(() => {
  const fallback = locKey === 'utica' ? 'Naturaleza Viva (Útica)' : 'Sirena Station (Day Tour)';
  return localStorage.getItem(`${locKey}_expedition_type`) || fallback;
});
const [showExpeditionModal, setShowExpeditionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('Favorites');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showExport, setShowExport] = useState(false);
  
  const [guideName, setGuideName] = useState(() => {
    return localStorage.getItem(`${locKey}_guide_name`) || '';
  });

 // Persist Guide ID and Tour ID to phone memory
  useEffect(() => {
    localStorage.setItem(`${locKey}_guide_id`, guideId);
  }, [guideId]);

  useEffect(() => {
    if (tourId) localStorage.setItem(`${locKey}_tour_id`, tourId);
    else localStorage.removeItem(`${locKey}_tour_id`);
  }, [tourId]);
// --- NEW: RECENT TOURS LOGIC ---
  const [recentTours, setRecentTours] = useState<any[]>([]);
 const [loadingTours, setLoadingTours] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxSpecies, setSandboxSpecies] = useState<Species[]>([]);
  const [sandboxMeta, setSandboxMeta] = useState<{ expeditionType?: string; tourDate?: string }>({});
  const [showArchive, setShowArchive] = useState(false); // NEW: Archive State

  // Real earnings data. Replaces the old `recentTours.length * 10` flat
  // stand-in — that number was never real revenue, just a tours-count
  // placeholder. Empty/zero here is the ACCURATE state until Stripe
  // checkout is actually wired up and the `sales` table starts getting
  // real rows (see locations.ts `commerce` config + the SQL note for the
  // `sales` table schema).
  const [sales, setSales] = useState<{ type: 'passport' | 'tip'; amount: number; created_at: string }[]>([]);

  useEffect(() => {
    if (guideId && !tourId) {
      fetchRecentTours();
      fetchSales();
    }
  }, [guideId, tourId]);

  const fetchSales = async () => {
    // Scoped to this guide only, same convention as `tours` below.
    const { data, error } = await supabase
      .from('sales')
      .select('type, amount, created_at')
      .eq('guide_id', guideId);

    // If the `sales` table doesn't exist yet in this Supabase project,
    // fail quietly to $0 rather than breaking the whole Lobby screen.
    if (!error && data) setSales(data as any);
  };

 useEffect(() => {
    localStorage.setItem(`${locKey}_session_active`, String(sessionActive));
  }, [sessionActive]);

  const fetchRecentTours = async () => {
    setLoadingTours(true);
    // Fetch completed tours, sorted newest first!
    // NOTE: scoped to this guide (.eq('guide_id', guideId)) — previously this
    // query had no filter at all, so every guide on every account could see
    // every other guide's tours in their Lobby. Now added `zone` too, since
    // the sandbox preview needs it to know which trail/expedition was run.
    const { data, error } = await supabase
      .from('tours')
      .select('id, created_at, zone, tour_logs(species_id)')
      .eq('guide_id', guideId)
      .order('created_at', { ascending: false }); // NEW: Sorts chronologically

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

  const handleOpenPastTour = (tour: any) => {
    // Extract just the species IDs from the logs
    const pastSpeciesIds = tour.tour_logs.map((log: any) => log.species_id);
    // Rebuild the logged list from our master dataset for this location
    const pastLogged = (activeDataset as Species[])
      .filter(s => pastSpeciesIds.includes(s.id))
      .map(s => ({ ...s, isLogged: true }));

    setSandboxSpecies(pastLogged);
    setSandboxMeta({
      expeditionType: tour.zone,
      tourDate: new Date(tour.created_at).toLocaleDateString(language === 'EN' ? 'en-US' : 'es-ES', { month: 'long', day: 'numeric', year: 'numeric' }),
    });
    setShowSandbox(true);
  };
  // --- END RECENT TOURS LOGIC ---
// --- NEW: Start Tour Logic ---
const startNewTour = async () => {
    // Save the chosen expedition type to phone memory!
    localStorage.setItem(`${locKey}_expedition_type`, expeditionType);
    const { data, error } = await supabase
      .from('tours')
      .insert({ guide_id: guideId, status: 'active', zone: expeditionType })
      .select()
      .single();

    if (error) {
      console.error("Error starting tour:", error);
      alert(language === 'EN' ? "Failed to start tour." : "Error al iniciar el tour.");
      return;
    }

    if (data) {
      setTourId(data.id);
      setSessionActive(true);
      setShowExpeditionModal(false); // Closes our sleek new popup!
      setSpecies(prev => prev.map(s => ({ ...s, isLogged: false })));
    }
  };
  // --- END NEW ---
// 2b. RESET STATE LOGIC ADDED
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const handleResetTour = () => {
    // Only reset logs so favorites are kept, and don't wipe tourId so we stay on the log!
    setSpecies(prev => prev.map(s => ({ ...s, isLogged: false })));
    setShowResetConfirm(false);
  };

  const handleLogout = () => {
    if (window.confirm(language === 'EN' ? "Wait! Have you saved your passport? Are you sure you want to log out?" : "¡Espera! ¿Has guardado tu pasaporte? ¿Estás seguro de que quieres cerrar sesión?")) {
setGuideId('');
      setGuideName('');
      setTourId(null);
      localStorage.removeItem(`${locKey}_guide_name`);
      localStorage.removeItem(`${locKey}_species_state`);
    }
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 140);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
 // 3. Save species to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`${locKey}_species_state`, JSON.stringify(species));
  }, [species]);

  // 4. Save guideName to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`${locKey}_guide_name`, guideName);
  }, [guideName]);

  // 5. Sync favorites from the guide's Supabase account so they follow the
  // guide across devices instead of living only in this browser's localStorage.
  // If the account has no favorites synced yet but this device does (an
  // existing guide who hasn't been through this flow before), push this
  // device's favorites up as a one-time backfill instead of wiping them.
  useEffect(() => {
    if (!guideId) return;
    (async () => {
      const remoteFavIds = await fetchGuideFavorites(guideId, locKey);
      setSpecies((prev) => {
        const localFavIds = prev.filter((s) => s.isFavorite).map((s) => s.id);
        if (remoteFavIds.size === 0 && localFavIds.length > 0) {
          localFavIds.forEach((id) => setGuideFavorite(guideId, locKey, id, true));
          return prev;
        }
        return prev.map((s) => ({ ...s, isFavorite: remoteFavIds.has(s.id) }));
      });
    })();
  }, [guideId, locKey]);

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
    setSpecies((prev) => {
      const target = prev.find((s) => s.id === id);
      const next = !(target?.isFavorite);
      setGuideFavorite(guideId, locKey, id, next);
      return prev.map((s) => (s.id === id ? { ...s, isFavorite: next } : s));
    });
  }, [guideId, locKey]);

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

    // Sort from least rare (lowest score) to most rare (highest score)
    // Defaulting to 50 if they don't have a score yet
    result = result.sort((a, b) => (a.rarityScore || 50) - (b.rarityScore || 50));

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
        onLogin={(id, name, companyLocation) => {
          // The company's actual location (from Supabase) wins — not
          // whatever :location happened to be in the URL. If they don't
          // match, stash the login under the CORRECT location's storage
          // keys and navigate there, so the guide lands on their real
          // dataset instead of whichever URL they logged in from.
          const resolvedLocation = companyLocation && LOCATIONS[companyLocation]
            ? companyLocation
            : locKey;

          if (resolvedLocation !== locKey) {
            localStorage.setItem(`${resolvedLocation}_guide_id`, id);
            localStorage.setItem(`${resolvedLocation}_guide_name`, name);
            navigate(`/${resolvedLocation}/guide`, { replace: true });
            return;
          }

          setGuideId(id);
          setGuideName(name);
        }} 
        language={language} 
        setLanguage={setLanguage} 
      />
    );
  }

// Phase 2: Logged in, but either NO tourId OR session not active? Show Lobby.
if (!tourId || !sessionActive) {

  // If they clicked a past tour, show the sandbox!
  if (showSandbox) {
    return (
      <PassportSandbox
        loggedSpecies={sandboxSpecies}
        language={language}
        guideName={guideName}
        onBack={() => setShowSandbox(false)}
        setLanguage={setLanguage}
        location={locKey}
        expeditionType={sandboxMeta.expeditionType}
        tourDate={sandboxMeta.tourDate}
      />
    );
  }

// --- STATS CALCULATIONS ---
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthTours = recentTours.filter(t => {
    const d = new Date(t.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  
  const monthName = new Date().toLocaleString(language === 'EN' ? 'en-US' : 'es-ES', { month: 'long' });

  // Real earnings — subdivided by the two actual revenue points (passport
  // sales vs. tips), each summed to the guide's own payout share, not the
  // guest-facing price. All-time only (not month-filtered) since a sale's
  // `created_at` is its own timestamp, independent of tour date.
  const passportSales = sales.filter((s) => s.type === 'passport');
  const tipSales = sales.filter((s) => s.type === 'tip');
  const passportEarnings = passportSales.reduce((sum, s) => sum + s.amount, 0);
  const tipEarnings = tipSales.reduce((sum, s) => sum + s.amount, 0);
  const allTimeEarnings = passportEarnings + tipEarnings;
  const locationCommerce = LOCATIONS[locKey]?.commerce ?? LOCATIONS.corcovado.commerce;
  
  // Calculate average species
  const totalSpeciesLogged = recentTours.reduce((sum, t) => sum + (t.tour_logs?.length || 0), 0);
  const avgSpeciesPerTour = recentTours.length > 0 ? (totalSpeciesLogged / recentTours.length).toFixed(1) : "0";

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
        <div className="w-full grid grid-cols-3 gap-2 mb-2">
          {/* Tours Block */}
          <div className="bg-[#162b1d] border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
            <p className="text-white/50 text-[9px] font-bold uppercase tracking-wider mb-1 text-center">
              {language === 'EN' ? 'Tours' : 'Recorridos'}
            </p>
            <p className="text-xl font-black text-white">{recentTours.length}</p>
          </div>

          {/* Earnings Block */}
          <div className="bg-[#162b1d] border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#C86A27]"></div>
            <p className="text-white/50 text-[9px] font-bold uppercase tracking-wider mb-1 text-center">
              {language === 'EN' ? 'Earnings' : 'Ganancias'}
            </p>
            <p className="text-xl font-black text-white">{formatMoney(allTimeEarnings, locationCommerce.currency)}</p>
            {/* Passport sales vs. tips breakdown — the two real revenue
                points. Both are genuinely $0 until Stripe checkout is
                wired up and `sales` rows start coming in for real. */}
            <p className="text-white/40 text-[8px] font-semibold mt-1 text-center leading-tight">
              {language === 'EN'
                ? `${passportSales.length} passport · ${tipSales.length} tips`
                : `${passportSales.length} pasaportes · ${tipSales.length} propinas`}
            </p>
          </div>

          {/* Avg Species Block */}
          <div className="bg-[#162b1d] border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
            <p className="text-white/50 text-[9px] font-bold uppercase tracking-wider mb-1 text-center leading-tight">
              {language === 'EN' ? 'Avg. Species/Tour' : 'Prom. Especies/Tour'}
            </p>
            <p className="text-xl font-black text-white">{avgSpeciesPerTour}</p>
          </div>
        </div>

{/* Start Tour Button (Intercepts with Modal) */}
        <button 
          onClick={() => (locKey === 'utica' ? startNewTour() : setShowExpeditionModal(true))}
          className="w-full bg-[#C86A27] text-white font-black text-2xl py-6 rounded-3xl shadow-[0_0_40px_rgba(200,106,39,0.3)] hover:bg-[#b05a1f] transition-all transform hover:scale-105 active:scale-95 mb-4 mt-4"
        >
          {language === 'EN' ? 'Start New Tour' : 'Iniciar Nuevo Tour'}
        </button>

{/* RECENT TOURS SECTION */}
        <div className="w-full">
          <h3 className="text-white/70 font-bold uppercase tracking-widest text-xs mb-4">
            {language === 'EN' ? 'This Month' : 'Este Mes'}
          </h3>
          
          {loadingTours ? (
            <p className="text-white/50 text-sm">{language === 'EN' ? 'Loading...' : 'Cargando...'}</p>
          ) : recentTours.length === 0 ? (
            <p className="text-white/50 text-sm italic">{language === 'EN' ? 'No completed tours yet.' : 'Aún no hay tours completados.'}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Only map through THIS month's tours first */}
              {thisMonthTours.map((tour) => (
                <div key={tour.id} className="bg-[#162b1d] border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                  <div onClick={() => handleOpenPastTour(tour)} className="cursor-pointer group flex-1">
                    <p className="text-white font-semibold text-sm group-hover:text-[#C86A27] transition-colors flex items-center gap-2">
                      {new Date(tour.created_at).toLocaleDateString(language === 'EN' ? 'en-US' : 'es-ES', { month: 'short', day: 'numeric' })}
                      <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <p className="text-emerald-400/80 text-xs mt-0.5 font-bold">
                      {tour.tour_logs.length} {language === 'EN' ? 'species' : 'especies'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleCopyTourLink(tour.id)} className="p-2 bg-[#C86A27] hover:bg-[#b05a1f] rounded-lg transition-colors text-white shadow-md">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteTour(tour.id)} className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors text-white/30 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* The Archive Folder for older tours */}
              {recentTours.length > thisMonthTours.length && (
                <div className="mt-4">
                  <button 
                    onClick={() => setShowArchive(!showArchive)}
                    className="w-full flex items-center justify-between p-4 bg-[#112217] border border-white/5 rounded-2xl text-white/50 hover:text-white transition-colors"
                  >
                    <span className="font-bold text-sm tracking-wide uppercase">
                      {language === 'EN' ? 'Past Tours Archive' : 'Archivo de Tours Pasados'}
                    </span>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                      {recentTours.length - thisMonthTours.length}
                    </span>
                  </button>

                  {/* Render Archived Tours if toggled open */}
                  {showArchive && (
                    <div className="flex flex-col gap-3 mt-3 opacity-70">
                      {recentTours.filter(t => !thisMonthTours.includes(t)).map((tour) => (
                        <div key={tour.id} className="bg-[#112217] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                          <div onClick={() => handleOpenPastTour(tour)} className="cursor-pointer group flex-1">
                            <p className="text-white/80 font-medium text-sm group-hover:text-[#C86A27] transition-colors flex items-center gap-2">
                              {new Date(tour.created_at).toLocaleDateString(language === 'EN' ? 'en-US' : 'es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
                              <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </p>
                            <p className="text-emerald-400/50 text-xs mt-0.5">
                              {tour.tour_logs.length} {language === 'EN' ? 'species' : 'especies'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleCopyTourLink(tour.id)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70">
                              <Copy className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteTour(tour.id)} className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors text-white/30 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => { setGuideId(''); setGuideName(''); }} 
          className="mt-8 text-white/30 font-semibold text-sm underline hover:text-white/60 transition-colors"
        >
{language === 'EN' ? 'Log out of Guide Portal' : 'Cerrar Sesión'}
        </button>

        {/* EXPEDITION SELECTOR MODAL */}
        {showExpeditionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#162b1d] border border-[#C86A27]/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-xl font-black text-white mb-1">
                {language === 'EN' ? 'Select Expedition' : 'Seleccionar Expedición'}
              </h3>
              <p className="text-white/60 mb-6 text-sm">
                {language === 'EN' ? 'Choose your route to start logging.' : 'Elige tu ruta para empezar.'}
              </p>
              <div className="flex flex-col gap-3 mb-6">
            {(locKey === 'utica' ? [
                  'Naturaleza Viva (Útica)'
                ] : [
                  'Sirena Station (Day Tour)',
                  'San Pedrillo Station (Day Tour)',
                  'Sirena Station (Overnight)',
                  'Combo: Sirena + San Pedrillo (day tour)',
                  'Combo: Sirena + San Pedrillo (overnight)',
                  'Combo: Sirena + San Pedrillo (3 day)'
                ]).map((exp) => (
                  <button
                    key={exp}
                    onClick={() => setExpeditionType(exp)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${expeditionType === exp ? 'bg-[#C86A27]/20 border-[#C86A27] text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                  >
                    <span className="font-bold text-sm leading-tight">{exp}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExpeditionModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  {language === 'EN' ? 'Cancel' : 'Cancelar'}
                </button>
                <button
                  onClick={startNewTour}
                  className="flex-1 py-3 px-4 rounded-xl font-black text-white bg-[#C86A27] hover:bg-[#b05a1f] transition-all"
                >
                  {language === 'EN' ? 'Begin' : 'Comenzar'}
                </button>
              </div>
            </div>
          </div>
        )}
        
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
  expeditionType={expeditionType}
setExpeditionType={(newType: string) => {
    setExpeditionType(newType);
    localStorage.setItem(`${locKey}_expedition_type`, newType);
  }}
  onBack={() => setShowExport(false)}
  setLanguage={setLanguage}
 onEndSession={() => {
    setShowExport(false);
    setTourId(null); // This triggers the Lobby view!
    localStorage.removeItem(`${locKey}_tour_id`);
    // Keep favorites safely intact, only reset the checks!
    setSpecies(prev => prev.map(s => ({ ...s, isLogged: false })));
  }}
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
        <CategoryTabs activeFilter={activeFilter} onChange={setActiveFilter} language={language} location={locKey} />
        
        {/* Empty Favorites Prompt */}
        {activeFilter === 'Favorites' && filteredSpecies.length === 0 ? (
          <div className="text-center py-16 px-6">
            <p className="text-stone-400 font-semibold text-lg mb-2">
              {language === 'EN' ? 'No favorites saved yet.' : 'Aún no hay favoritos guardados.'}
            </p>
            <p className="text-stone-500 text-sm leading-relaxed">
              {language === 'EN' 
                ? 'Tap the star icon on your frequent sightings so you do not have to scroll for them every day!' 
                : '¡Toca el icono de estrella en tus avistamientos frecuentes para no tener que buscarlos todos los días!'}
            </p>
          </div>
        ) : (
          <SpeciesGrid
            species={filteredSpecies}
            language={language}
            onToggleLog={toggleLog}
            onToggleFavorite={toggleFavorite}
          />
        )}
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
