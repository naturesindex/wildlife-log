import { ArrowLeft, Map, Trophy, Camera, Sparkles, ChevronRight } from 'lucide-react';
import { Species, Language } from '../types';

interface SandboxProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  onBack: () => void;
}

export function PassportSandbox({ loggedSpecies: rawSpecies, language, guideName, onBack }: SandboxProps) {
  // Safety Net: If rawSpecies is undefined (like when history is cleared), default to an empty array so it never crashes!
  const loggedSpecies = rawSpecies || [];
  
  // Let's create some dynamic "Wrapped" style stats based on their actual clicks
  const totalSpecies = loggedSpecies.length;
  const tier1Count = loggedSpecies.filter(s => s.tier === 1).length;
  
  // Grab a random or first species to feature as the "Rarest" or "Highlight"
  const highlightSpecies = loggedSpecies.find(s => s.tier === 1) || loggedSpecies[0];

  return (
    <div className="min-h-screen bg-[#060c08] text-white font-sans selection:bg-[#C86A27]/30 pb-20">
      
      {/* Dev Toolbar - Floating at the top so you can always escape */}
      <div className="fixed top-0 left-0 w-full p-4 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all text-xs font-bold uppercase tracking-wider border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Sandbox
        </button>
        <div className="bg-[#C86A27] px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(200,106,39,0.5)]">
          Preview Mode
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 px-6 overflow-hidden">
        {/* Abstract Topo Map Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 border-[1px] border-emerald-500/10"></div>
        <div className="absolute top-20 left-0 w-[600px] h-[600px] bg-[#C86A27]/5 rounded-full blur-3xl -translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-[#C86A27] font-bold tracking-[0.2em] text-sm mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> OFFICIAL EXPEDITION LOG
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Corcovado <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#C86A27]">
              National Park
            </span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-xl font-light">
            Guided by {guideName} • {new Date().toLocaleDateString(language === 'EN' ? 'en-US' : 'es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* The Stats "Wrapped" Section */}
      <div className="max-w-4xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-[#112217] border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Camera className="w-16 h-16" />
            </div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Species Seen</p>
            <p className="text-5xl font-black text-white">{totalSpecies}</p>
          </div>

          <div className="bg-[#112217] border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Trophy className="w-16 h-16" />
            </div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Highlights</p>
            <p className="text-5xl font-black text-[#C86A27]">{tier1Count}</p>
          </div>

          <div className="col-span-2 bg-gradient-to-br from-[#162b1d] to-[#0b170f] border border-emerald-500/20 rounded-3xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-emerald-400/80 text-xs font-bold uppercase tracking-wider mb-2">Expedition Rating</p>
              <p className="text-3xl font-black text-white">Elite Explorer</p>
              <p className="text-white/50 text-sm mt-1">Top 15% of all daily treks</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

        </div>
      </div>

      {/* The Interactive Map Module (Visual Mockup) */}
      <div className="max-w-4xl mx-auto px-6 mb-16">
        <div className="bg-[#112217] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative h-[300px] flex items-end p-8 group cursor-pointer">
          {/* Faux Map Background - We will replace this with a real topo SVG later */}
          <div className="absolute inset-0 opacity-20 transition-transform duration-700 group-hover:scale-105" 
               style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #C86A27 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#112217] via-[#112217]/50 to-transparent"></div>
          
          <div className="relative z-10 w-full flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-[#C86A27] rounded-full animate-pulse"></div>
                <p className="text-[#C86A27] font-bold text-xs uppercase tracking-widest">Sirena Station Trail</p>
              </div>
              <h2 className="text-3xl font-black text-white">View Expedition Map</h2>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full group-hover:bg-[#C86A27] transition-colors">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* The Species Gallery */}
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
          <Camera className="w-6 h-6 text-[#C86A27]" /> 
          Your Discoveries
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loggedSpecies.map((species, idx) => (
            <div key={idx} className="bg-[#112217] border border-white/5 rounded-3xl overflow-hidden flex shadow-lg hover:border-white/20 transition-colors cursor-pointer group">
              <div className="w-1/3 h-32 relative overflow-hidden">
                <img 
                  src={species.image} 
                  alt={language === 'EN' ? species.nameEN : species.nameES} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#112217]"></div>
              </div>
              <div className="p-5 flex flex-col justify-center w-2/3">
                <p className="text-[#C86A27] text-[10px] font-black uppercase tracking-widest mb-1">{species.section}</p>
                <h3 className="text-lg font-black text-white leading-tight mb-1">
                  {language === 'EN' ? species.nameEN : species.nameES}
                </h3>
                <p className="text-white/40 text-xs italic">{species.scientificName || "Scientific Name"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
