import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface LoginProps {
  onLogin: (guideId: string, guideName: string) => void;
  language: 'EN' | 'ES';
  setLanguage: (lang: 'EN' | 'ES') => void;
}


export function LoginScreen({ onLogin, language, setLanguage }: LoginProps) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [guideName, setGuideName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch companies when the screen loads
// Add this inside your component, before the return statement
useEffect(() => {
  async function loadCompanies() {
    const { data, error } = await supabase
      .from('companies')
      .select('id, name');
      
    if (error) {
      console.error("Supabase Error:", error);
    } else {
      console.log("Data returned from Supabase:", data); // <-- ADD THIS
      setCompanies(data || []);
    }
  }
  loadCompanies();
}, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Verify Company Password
    const { data: companyData } = await supabase
      .from('companies')
      .select('password')
      .eq('id', selectedCompanyId)
      .single();

    if (!companyData || companyData.password !== password) {
      setError(language === 'EN' ? 'Incorrect Company Password' : 'Clave de empresa incorrecta');
      setLoading(false);
      return;
    }

    // 2. Check if Guide exists, if not, create them!
    let currentGuideId = '';
    const { data: existingGuide } = await supabase
      .from('guides')
      .select('id')
      .match({ company_id: selectedCompanyId, name: guideName })
      .single();

    if (existingGuide) {
      currentGuideId = existingGuide.id;
    } else {
      const { data: newGuide } = await supabase
        .from('guides')
        .insert({ company_id: selectedCompanyId, name: guideName })
        .select()
        .single();
      if (newGuide) currentGuideId = newGuide.id;
    }

    setLoading(false);
    onLogin(currentGuideId, guideName);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#0b170f' }}>
      {/* Language Toggle */}
      <div className="absolute top-6 right-6 flex bg-[#162b1d] rounded-full p-1">
        <button onClick={() => setLanguage('EN')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${language === 'EN' ? 'bg-[#C86A27] text-white' : 'text-white/50'}`}>EN</button>
        <button onClick={() => setLanguage('ES')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${language === 'ES' ? 'bg-[#C86A27] text-white' : 'text-white/50'}`}>ES</button>
      </div>

  <div className="text-center mb-8">
  {/* Nature's Index Branding - Smaller, using your Hero Orange */}
  <h2 className="text-[#C86A27] text-sm md:text-base font-bold uppercase tracking-widest mb-2">
    Nature's Index
  </h2>
  
  {/* Main Portal Title - Large and White */}
  <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
    Guide Portal
  </h1>
</div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="text-white/70 text-sm font-bold mb-2 block">
              {language === 'EN' ? 'Tour Company' : 'Empresa de Tour'}
            </label>
            <select 
              required
              value={selectedCompanyId} 
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full bg-[#0b170f] text-white rounded-xl p-4 outline-none border border-white/10 focus:border-[#C86A27]"
            >
              <option value="" disabled>{language === 'EN' ? 'Select your company...' : 'Seleccione su empresa...'}</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

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
              className="w-full bg-[#0b170f] text-white rounded-xl p-4 outline-none border border-white/10 focus:border-[#C86A27]"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm font-bold mb-2 block">
              {language === 'EN' ? 'Company Password' : 'Clave de Empresa'}
            </label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0b170f] text-white rounded-xl p-4 outline-none border border-white/10 focus:border-[#C86A27]"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center font-bold">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#C86A27] text-white font-black text-lg p-4 rounded-xl mt-4 hover:bg-[#b05a1f] transition-colors"
          >
            {loading ? '...' : (language === 'EN' ? 'Access Portal' : 'Acceder al Portal')}
          </button>
        </form>
      </div>
    </div>
  );
}
