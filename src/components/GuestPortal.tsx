import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import { initialSpecies } from '../data/corcovado';
import { uticaSpecies } from '../data/utica';
import { getLocationConfig } from '../data/locations';
import { Species } from '../types';
import { SocialStory } from './SocialStory'; // Reusing your fixed graphic component
import { WildlifePassport } from './WildlifePassport';
import { Download, Sparkles, Lock, Coffee, Map, BookOpen, MousePointerClick } from 'lucide-react';
import { toPng } from 'html-to-image';

export function GuestPortal() {
  const { tourId } = useParams();
  const [loading, setLoading] = useState(true);
  const [guideName, setGuideName] = useState('Your Guide');
  const [loggedSpecies, setLoggedSpecies] = useState<Species[]>([]);
  const [locKey, setLocKey] = useState('corcovado');
  const [guestName, setGuestName] = useState('');
  const [language, setLanguage] = useState<'EN' | 'ES'>('EN');
  const config = getLocationConfig(locKey);
  
  const snapshotRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const scrollToCheckout = () => checkoutRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    fetchTourDetails();
  }, [tourId]);

  const fetchTourDetails = async () => {
    if (!tourId) return;
    
    // 1. Get the tour, zone/location, and logged species IDs
    const { data: tourData } = await supabase
      .from('tours')
      .select('guide_id, zone, tour_logs(species_id)')
      .eq('id', tourId)
      .single();

    if (tourData) {
      // 2. Get the Guide's Name
      const { data: guideData } = await supabase
        .from('guides')
        .select('name')
        .eq('id', tourData.guide_id)
        .single();
        
      if (guideData) setGuideName(guideData.name);

      // 3. Determine dataset dynamically (Útica vs Corcovado)
      const isUtica = tourData.zone?.toLowerCase().includes('utica') || false;
      const resolvedLocKey = isUtica ? 'utica' : 'corcovado';
      setLocKey(resolvedLocKey);
      const masterList = isUtica ? uticaSpecies : initialSpecies;

      // 4. Match the logged IDs to species data
      const loggedIds = tourData.tour_logs.map((log: any) => log.species_id);
      const matchedSpecies = (masterList as Species[]).filter(s => loggedIds.includes(s.id));
      setLoggedSpecies(matchedSpecies);
    }
    setLoading(false);
  };

  const handleDownloadFreebie = async () => {
    if (!snapshotRef.current) return;
    try {
      // Flawless high-res download
      const dataUrl = await toPng(snapshotRef.current, { 
        quality: 1.0, 
        pixelRatio: 4,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      const link = document.createElement('a');
      link.download = `Corcovado-Snapshot-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0b170f] flex items-center justify-center text-[#C86A27] font-bold text-xl tracking-widest">LOADING ADVENTURE...</div>;
  }

  if (loggedSpecies.length === 0) {
    return <div className="min-h-screen bg-[#0b170f] flex items-center justify-center text-white">Tour not found or empty.</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans pb-24">
      
      {/* 1. HERO SECTION */}
      <div className="bg-[#162b1d] pt-12 pb-16 px-6 text-center rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-4 right-4 flex bg-black/20 rounded-full p-1 backdrop-blur-md">
          <button onClick={() => setLanguage('EN')} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${language === 'EN' ? 'bg-[#C86A27] text-white' : 'text-white/50'}`}>EN</button>
          <button onClick={() => setLanguage('ES')} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${language === 'ES' ? 'bg-[#C86A27] text-white' : 'text-white/50'}`}>ES</button>
        </div>
        
        <h2 className="text-[#C86A27] text-sm md:text-base font-bold uppercase tracking-widest mb-3">
          Nature's Index
        </h2>
        <h1 className="text-4xl font-black text-white mb-4 leading-tight">
          {language === 'EN' ? `Your ${config.nameEN} Adventure` : `Tu Aventura en ${config.nameES}`}
        </h1>
        <p className="text-emerald-400 text-lg font-medium">
          {language === 'EN' ? `Guided by ${guideName}` : `Guiado por ${guideName}`} • {loggedSpecies.length} {language === 'EN' ? 'Species Logged' : 'Especies'}
        </p>
      </div>

{/* 2. THE FREEBIE (SOCIAL STORY) */}
      <div className="max-w-md mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white p-4 rounded-3xl shadow-2xl border border-stone-100">
          <div className="text-center mb-4 mt-2">
            <h3 className="text-xl font-bold text-stone-800 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C86A27]" />
              {language === 'EN' ? 'A Gift From Us!' : '¡Un Regalo Nuestro!'}
            </h3>
            <p className="text-sm text-stone-500 mt-1">
              {language === 'EN' ? 'Your free social story — save and share your highlight.' : 'Tu historia social gratuita: guarda y comparte tu resumen.'}
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-inner bg-stone-100" ref={snapshotRef}>
            <SocialStory 
              loggedSpecies={loggedSpecies} 
              language={language} 
              guideName={guideName} 
              totalLogged={loggedSpecies.length} 
              location={locKey}
            />
          </div>

          <button 
            onClick={handleDownloadFreebie}
            className="w-full mt-4 bg-stone-100 text-stone-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-200 transition-colors"
          >
            <Download className="w-5 h-5" />
            {language === 'EN' ? 'Download Graphic' : 'Descargar Gráfico'}
          </button>
        </div>
      </div>

     {/* 3. THE PREMIUM UPGRADE / FEATURES */}
      <div className="max-w-md mx-auto px-6 mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#162b1d] mb-4 leading-tight">
            {language === 'EN' ? 'Unlock Your Interactive Passport' : 'Desbloquea tu Pasaporte Interactivo'}
          </h2>
          <p className="text-stone-600 font-medium">
            {language === 'EN'
              ? `Your sightings. Your ${config.showDistance ? 'trek' : 'outing'}. All in one interactive keepsake.`
              : `Tus avistamientos. Tu ${config.showDistance ? 'caminata' : 'salida'}. Todo en un recuerdo interactivo.`}
          </p>
        </div>

        {/* Features Breakdown */}
        <div className="grid grid-cols-1 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
            <div className="bg-[#C86A27]/10 p-3 rounded-xl text-[#C86A27]">
              <MousePointerClick className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-stone-800">{language === 'EN' ? 'Interactive Encyclopedia' : 'Enciclopedia Interactiva'}</h4>
              <p className="text-sm text-stone-500 leading-snug">{language === 'EN' ? 'Tap any species you spotted to explore its rarity ranking and what makes it special to find.' : 'Toca cualquier especie que hayas visto para explorar su nivel de rareza y qué la hace especial.'}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
            <div className="bg-[#C86A27]/10 p-3 rounded-xl text-[#C86A27]">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-stone-800">{language === 'EN' ? 'Expedition Map & Badges' : 'Mapa de Expedición e Insignias'}</h4>
              <p className="text-sm text-stone-500 leading-snug">{language === 'EN' ? 'A Strava-style visual breakdown of your route and milestones, with a shareable post ready to go.' : 'Un desglose visual estilo Strava de tu recorrido y logros, con una publicación lista para compartir.'}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
            <div className="bg-[#C86A27]/10 p-3 rounded-xl text-[#C86A27]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-stone-800">{language === 'EN' ? 'Printable Museum Poster' : 'Póster de Museo Imprimible'}</h4>
              <p className="text-sm text-stone-500 leading-snug">{language === 'EN' ? 'A high-resolution ID chart of the top species you spotted, ready for printing and framing, or saving and sharing.' : 'Una tabla de identificación en alta resolución de las mejores especies que viste, lista para imprimir y enmarcar, o guardar y compartir.'}</p>
            </div>
          </div>
        </div>

        {/* The REAL Blurred Preview Card */}
        <div 
          onClick={scrollToCheckout}
          className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white cursor-pointer group hover:shadow-3xl transition-all mb-12"
        >
          <div className="bg-[#162b1d] py-3 text-center">
             <span className="text-white/80 text-xs font-bold tracking-widest uppercase">{language === 'EN' ? 'Live Preview' : 'Vista Previa en Vivo'}</span>
          </div>
          {/* Real component, heavily blurred and faded */}
          <div className="relative h-[400px] overflow-hidden blur-[5px] opacity-70 select-none pointer-events-none transform scale-95 origin-top mt-2">
             <WildlifePassport loggedSpecies={loggedSpecies} language={language} guideName={guideName} location={locKey} />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white z-10"></div>
          </div>
          
          {/* Overlay Lock */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
            <div className="bg-[#162b1d] text-white p-5 rounded-full shadow-2xl mb-4 transform group-hover:scale-110 transition-transform">
              <Lock className="w-8 h-8" />
            </div>
            <span className="font-bold text-[#162b1d] text-lg tracking-wide uppercase bg-white/90 px-6 py-2 rounded-full shadow-lg">
               {language === 'EN' ? 'Click to Unlock' : 'Clic para Desbloquear'}
            </span>
          </div>
        </div>

        {/* 4. TIP THE GUIDE */}
        <div className="bg-[#162b1d] rounded-3xl p-6 shadow-xl relative overflow-hidden mb-8 text-center text-white">
           <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
             <Coffee className="w-24 h-24" />
           </div>
           <h3 className="text-xl font-bold mb-2 relative z-10">{language === 'EN' ? `Loved your trek with ${guideName}?` : `¿Te encantó tu caminata con ${guideName}?`}</h3>
           <p className="text-emerald-400 text-sm mb-4 relative z-10">{language === 'EN' ? '100% of tips go directly to your guide.' : 'El 100% de las propinas van a tu guía.'}</p>
           <div className="flex gap-2 relative z-10">
              {['$5', '$10', '$20'].map(amt => (
                <button key={amt} className="flex-1 bg-white/10 hover:bg-[#C86A27] transition-colors py-3 rounded-xl font-bold border border-white/20 hover:border-[#C86A27]">
                  {amt}
                </button>
              ))}
              <button className="flex-1 bg-white/10 hover:bg-white/20 transition-colors py-3 rounded-xl font-bold border border-white/20">
                {language === 'EN' ? 'Custom' : 'Otro'}
              </button>
           </div>
        </div>

        {/* 5. PERSONALIZATION & CHECKOUT */}
        <div ref={checkoutRef} className="bg-white rounded-3xl p-6 shadow-xl border border-stone-200 scroll-mt-6">
          <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wider">
             {language === 'EN' ? 'Who is this passport for?' : '¿Para quién es este pasaporte?'}
          </label>
          <input 
            type="text" 
            required
            placeholder={language === 'EN' ? 'e.g., The Smith Family, Jane Doe' : 'ej., Familia Smith'}
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-stone-800 outline-none focus:border-[#C86A27] focus:ring-2 focus:ring-[#C86A27]/20 transition-all font-medium mb-6"
          />

          <button 
            disabled={!guestName.trim()}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-3
              ${guestName.trim() 
                ? 'bg-[#C86A27] text-white hover:bg-[#b05a1f] hover:scale-[1.02] shadow-[#C86A27]/30' 
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
          >
            <Lock className="w-5 h-5" />
            {language === 'EN' ? `Purchase Passport - $${config.premiumPriceUSD}` : `Comprar Pasaporte - $${config.premiumPriceUSD}`}
          </button>
       <p className="text-center text-xs text-stone-400 mt-4 font-medium">
             {language === 'EN' ? 'Secure payment via Stripe. Instant access.' : 'Pago seguro vía Stripe. Acceso instantáneo.'}
          </p>
        </div>

      </div>
    </div>
  );
}
