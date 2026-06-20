import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import { initialSpecies } from '../data/species';
import { Species } from '../types';
import { SocialStory } from './SocialStory'; // Reusing your fixed graphic component
import { Download, Sparkles, Lock } from 'lucide-react';
import { toPng } from 'html-to-image';

export function GuestPortal() {
  const { tourId } = useParams();
  const [loading, setLoading] = useState(true);
  const [guideName, setGuideName] = useState('Your Guide');
  const [loggedSpecies, setLoggedSpecies] = useState<Species[]>([]);
  const [guestName, setGuestName] = useState('');
  const [language, setLanguage] = useState<'EN' | 'ES'>('EN');
  
  const snapshotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTourDetails();
  }, [tourId]);

  const fetchTourDetails = async () => {
    if (!tourId) return;
    
    // 1. Get the tour and the logged species IDs
    const { data: tourData } = await supabase
      .from('tours')
      .select('guide_id, tour_logs(species_id)')
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

      // 3. Match the logged IDs to our species data
      const loggedIds = tourData.tour_logs.map((log: any) => log.species_id);
      const matchedSpecies = (initialSpecies as Species[]).filter(s => loggedIds.includes(s.id));
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
          {language === 'EN' ? 'Your Corcovado Adventure' : 'Tu Aventura en Corcovado'}
        </h1>
        <p className="text-emerald-400 text-lg font-medium">
          {language === 'EN' ? `Guided by ${guideName}` : `Guiado por ${guideName}`} • {loggedSpecies.length} {language === 'EN' ? 'Species Logged' : 'Especies'}
        </p>
      </div>

      {/* 2. THE FREEBIE (TRAIL SNAPSHOT) */}
      <div className="max-w-md mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white p-4 rounded-3xl shadow-2xl border border-stone-100">
          <div className="text-center mb-4 mt-2">
            <h3 className="text-xl font-bold text-stone-800 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C86A27]" />
              {language === 'EN' ? 'Free Trail Snapshot' : 'Instantánea del Sendero'}
            </h3>
            <p className="text-sm text-stone-500 mt-1">
              {language === 'EN' ? 'Save and share this highlight to your story!' : '¡Guarda y comparte este resumen en tu historia!'}
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-inner bg-stone-100" ref={snapshotRef}>
             {/* We render your existing component here! */}
            <SocialStory 
              loggedSpecies={loggedSpecies} 
              language={language} 
              guideName={guideName} 
              totalLogged={loggedSpecies.length} 
            />
          </div>

          <button 
            onClick={handleDownloadFreebie}
            className="w-full mt-4 bg-stone-100 text-stone-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-200 transition-colors"
          >
            <Download className="w-5 h-5" />
            {language === 'EN' ? 'Download High-Res Graphic' : 'Descargar Gráfico'}
          </button>
        </div>
      </div>

      {/* 3. THE PAYWALL / SALES PITCH */}
      <div className="max-w-md mx-auto px-6 mt-12">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-[#162b1d] mb-3">
            {language === 'EN' ? 'Unlock Your Full Digital Passport' : 'Desbloquea tu Pasaporte Digital'}
          </h2>
          <p className="text-stone-600 font-medium">
            {language === 'EN' 
              ? 'Get a beautiful 20+ page interactive guide featuring high-res photos, rich facts, and the exact species you saw today.' 
              : 'Obtén una hermosa guía interactiva de más de 20 páginas con fotos en alta resolución, datos fascinantes y las especies exactas que viste hoy.'}
          </p>
        </div>

        {/* Blurred Preview Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200 bg-white p-4">
          <div className="blur-sm opacity-60 pointer-events-none select-none">
             {/* Mocked blurry background content to look like the passport */}
             <div className="h-40 bg-emerald-800 rounded-2xl mb-4"></div>
             <div className="flex gap-4 mb-4">
               <div className="w-1/2 h-32 bg-stone-300 rounded-xl"></div>
               <div className="w-1/2 h-32 bg-stone-300 rounded-xl"></div>
             </div>
             <div className="h-8 bg-stone-200 rounded-lg w-3/4 mb-2"></div>
             <div className="h-4 bg-stone-200 rounded-lg w-full mb-2"></div>
             <div className="h-4 bg-stone-200 rounded-lg w-5/6"></div>
          </div>
          
          {/* Overlay Lock */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
            <div className="bg-[#162b1d] text-white p-4 rounded-full shadow-2xl mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <span className="font-bold text-[#162b1d] text-lg tracking-wide uppercase">
               {language === 'EN' ? 'Premium Content' : 'Contenido Premium'}
            </span>
          </div>
        </div>

        {/* 4. PERSONALIZATION & CHECKOUT */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-100 mt-8">
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
            {language === 'EN' ? 'Purchase Passport - $15' : 'Comprar Pasaporte - $15'}
          </button>
          <p className="text-center text-xs text-stone-400 mt-4 font-medium">
             {language === 'EN' ? 'Secure payment via Stripe. Instant access.' : 'Pago seguro vía Stripe. Acceso instantáneo.'}
          </p>
        </div>

      </div>
    </div>
  );
}
