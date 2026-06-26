import { ArrowRight, Map, Waves, Leaf, Compass, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          <Leaf className="text-blue-500" />
          NATURE'S INDEX
        </div>
        <button 
          onClick={() => navigate('/corcovado/guide')}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all border border-slate-800 hover:border-slate-700"
        >
          <UserCircle size={18} />
          Guide Portal
        </button>
      </nav>

      {/* Hero Section - Asymmetrical */}
      <main className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10 relative">
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              LOG <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">THE WILD.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-md leading-relaxed">
              Elevating the expedition experience. From jungle trails to ocean depths, we turn your sightings into premium, interactive digital souvenirs.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-all">
                Explore Destinations <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Asymmetrical Image/Card Grid */}
          <div className="relative h-[400px] md:h-[500px] mt-10 md:mt-0">
            {/* Corcovado Card - Tilted Right */}
            <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden transform rotate-3 hover:rotate-0 transition-all duration-500 z-10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop" alt="Jungle" className="w-full h-full object-cover opacity-60" />
              <div className="absolute bottom-6 left-6 z-20">
                <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">Active</div>
                <div className="text-2xl font-bold text-white">Corcovado National Park</div>
              </div>
            </div>
            
            {/* Dive Log Card - Tilted Left & Overlapping */}
            <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden transform -rotate-3 hover:rotate-0 transition-all duration-500 shadow-2xl z-20">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop" alt="Diving" className="w-full h-full object-cover opacity-60" />
               <div className="absolute bottom-6 left-6 z-20">
                <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">Coming Soon</div>
                <div className="text-xl font-bold text-white">Digital Dive Logs</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mission / Stats Section */}
      <section className="bg-slate-900 py-24 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors group">
            <Map className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-2xl font-bold text-white mb-3">Expanding Parks</h3>
            <p className="text-slate-400 leading-relaxed">Scaling our digital passport ecosystem to global nature reserves. Giving guides the ultimate B2B2C souvenir tool.</p>
          </div>
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors group">
            <Waves className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-2xl font-bold text-white mb-3">Ocean Bound</h3>
            <p className="text-slate-400 leading-relaxed">Taking the index underwater. Soon, dive masters will be able to log marine life and generate beautiful dive profiles.</p>
          </div>
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors group">
            <Compass className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-2xl font-bold text-white mb-3">Expedition Stats</h3>
            <p className="text-slate-400 leading-relaxed">Building competitive, engaging statistics for guests. Turning every hike into a unique, visually stunning achievement.</p>
          </div>
        </div>
      </section>

      {/* Request a Park CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
         {/* Subtle background glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
         
         <div className="max-w-2xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Want Nature's Index in your area?</h2>
            <p className="text-xl text-slate-400 mb-10">We are actively partnering with elite tour operators and guide associations worldwide.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="text" 
                placeholder="Enter your park or region..." 
                className="bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-full outline-none focus:border-blue-500 transition-colors w-full sm:w-auto flex-1 max-w-md"
              />
              <button className="bg-blue-600 text-white hover:bg-blue-500 px-8 py-4 rounded-full font-bold transition-all">
                Submit Request
              </button>
            </div>
         </div>
      </section>
    </div>
  );
}
