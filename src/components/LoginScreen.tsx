import { useState } from 'react';
import { supabase } from '../supabase';

interface LoginProps {
  // 3rd arg: the location this company actually belongs to (from Supabase),
  // so the caller can route the guide to their real dataset instead of
  // whatever location happened to be in the URL when they logged in.
  onLogin: (guideId: string, guideName: string, companyLocation: string | null) => void;
  language: 'EN' | 'ES';
  setLanguage: (lang: 'EN' | 'ES') => void;
}

export function LoginScreen({ onLogin, language, setLanguage }: LoginProps) {
  // 1. Updated State: Now using companyHandle instead of a dropdown ID
  const [companyHandle, setCompanyHandle] = useState('');
  const [guideName, setGuideName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 2. Updated Logic: Find company by the handle they typed.
    // NOTE: `location` here is what actually decides which dataset/app-shell
    // the guide lands in — NOT the URL they happened to log in from.
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id, password, location')
      .eq('handle', companyHandle.toLowerCase().trim())
      .single();

    // Check if the handle was wrong
    if (companyError || !companyData) {
      setError(language === 'EN' ? 'Company ID not found' : 'ID de empresa no encontrado');
      setLoading(false);
      return;
    }

    // Check if the password was wrong
    if (companyData.password !== password) {
      setError(language === 'EN' ? 'Incorrect Company Password' : 'Clave de empresa incorrecta');
      setLoading(false);
      return;
    }

    // 3. Check if Guide exists, if not, create them (using the companyData.id we just looked up)
    let currentGuideId = '';
    const { data: existingGuide } = await supabase
      .from('guides')
      .select('id')
      .match({ company_id: companyData.id, name: guideName })
      .single();

    if (existingGuide) {
      currentGuideId = existingGuide.id;
    } else {
      const { data: newGuide } = await supabase
        .from('guides')
        .insert({ company_id: companyData.id, name: guideName })
        .select()
        .single();
      if (newGuide) currentGuideId = newGuide.id;
    }

    setLoading(false);
    onLogin(currentGuideId, guideName, companyData.location ?? null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 md:pt-16 p-6" style={{ background: '#0b170f' }}>
      
      {/* Language Toggle */}
      <div className="absolute top-6 right-6 flex bg-[#162b1d] rounded-full p-1">
        <button onClick={() => setLanguage('EN')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${language === 'EN' ? 'bg-[#C86A27] text-white' : 'text-white/50'}`}>EN</button>
        <button onClick={() => setLanguage('ES')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${language === 'ES' ? 'bg-[#C86A27] text-white' : 'text-white/50'}`}>ES</button>
      </div>

      {/* CARD CONTAINER BEGINS (Properly wraps the form now) */}
      <div className="w-full max-w-md bg-[#162b1d] p-8 rounded-3xl shadow-xl">
        
        {/* Updated Header UI */}
        <div className="text-center mb-8">
          <h2 className="text-[#C86A27] text-sm md:text-base font-bold uppercase tracking-widest mb-2">
            Nature's Index
          </h2>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {language === 'EN' ? 'Guide Portal' : 'Portal del Guía'}
          </h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          
          {/* New Typed Input for Company Handle */}
          <div>
            <label className="text-white/70 text-sm font-bold mb-2 block">
              {language === 'EN' ? 'Company ID' : 'ID de la Empresa'}
            </label>
            <input 
              required
              type="text" 
              value={companyHandle}
              onChange={(e) => setCompanyHandle(e.target.value)}
              placeholder="e.g. demo"
              className="w-full bg-[#0b170f] text-white rounded-xl p-4 outline-none border border-white/10 focus:border-[#C86A27] transition-colors"
            />
          </div>

          {/* Guide Name Input */}
          <div>
            <label className="text-white/70 text-sm font-bold mb-2 block">
              {language === 'EN' ? 'Your Name (Guide)' : 'Su Nombre (Guía)'}
            </label>
            <input 
              required
              type="text" 
              value={guideName}
              onChange={(e) => setGuideName(e.target.value)}
              placeholder="e.g. Juan Silva"
              className="w-full bg-[#0b170f] text-white rounded-xl p-4 outline-none border border-white/10 focus:border-[#C86A27] transition-colors"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-white/70 text-sm font-bold mb-2 block">
              {language === 'EN' ? 'Company Password' : 'Clave de Empresa'}
            </label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0b170f] text-white rounded-xl p-4 outline-none border border-white/10 focus:border-[#C86A27] transition-colors"
            />
          </div>

          {/* Error Message Display */}
          {error && <p className="text-red-400 text-sm text-center font-bold">{error}</p>}

          {/* Login Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#C86A27] text-white font-black text-lg p-4 rounded-xl mt-4 hover:bg-[#b05a1f] transition-colors"
          >
            {loading ? '...' : (language === 'EN' ? 'Access Portal' : 'Acceder al Portal')}
          </button>

        </form>
      </div> 
      {/* CARD CONTAINER ENDS */}

    </div>
  );
}
