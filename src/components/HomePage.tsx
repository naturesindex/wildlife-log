import { ArrowRight, Map, Waves, Leaf, Compass, UserCircle, Share2, HeartHandshake, DollarSign, Globe, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          <Leaf className="text-[#C86A27]" />
          <span className="text-[#C86A27]">NATURE'S INDEX</span>
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
      <main className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10 relative">
            <h1 className="text-6xl md:text-7xl font-black text-white leading-[1] tracking-tighter uppercase">
              Log The Wild. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Your Tour. Documented.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-md leading-relaxed">
              The wildlife logging tool for expedition guides. Log every sighting, generate guest highlights, and turn every tour into a shareable experience worth coming back for.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-all">
                Partner With Us <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
{/* Asymmetrical Image/Card Grid */}
          <div className="relative h-[400px] md:h-[500px] mt-10 md:mt-0">
            {/* Corcovado Card - Tilted Right */}
            <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden transform rotate-3 hover:rotate-0 hover:z-50 hover:scale-105 transition-all duration-500 z-20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop" alt="Jungle" className="w-full h-full object-cover opacity-60" />
              <div className="absolute bottom-6 left-6 z-20">
                <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">Wildlife Park Passport</div>
                <div className="text-2xl font-bold text-white">Corcovado National Park</div>
              </div>
            </div>
            
            {/* Dive Log Card - Tilted Left & Overlapping */}
            <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden transform -rotate-3 hover:rotate-0 hover:z-50 hover:scale-105 transition-all duration-500 shadow-2xl z-10">
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

{/* HOW IT WORKS - 3 Dead Simple Steps */}
      <section className="py-20 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">How It Works</h2>
            <p className="text-slate-400">Three dead simple steps to elevate your expedition.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Guide Logs Sightings</h3>
              <p className="text-slate-400">Your guides log what they see during the tour using our streamlined portal.</p>
            </div>
            <div className="p-6 relative">
              <div className="hidden md:block absolute top-1/4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-700 to-transparent -z-10"></div>
              <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Guest Receives Link</h3>
              <p className="text-slate-400">Guests get a personalized link containing their free social story, tipping options, and passport upsell.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Everyone Wins</h3>
              <p className="text-slate-400">Guests share the adventure, guides earn better tips, and operators grow effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY OPERATORS CARE - The B2B Pitch */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-16 tracking-tight max-w-2xl">The ultimate tool for elite operators.</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="flex gap-4">
              <div className="mt-1"><Share2 className="text-blue-500" size={28} /></div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">The Guest Wow Factor</h3>
                <p className="text-slate-400">Your guests leave with something shareable and personal. They post it. They tag you. That's free marketing requiring zero behavior change from your operation.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1"><HeartHandshake className="text-[#C86A27]" size={28} /></div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">The Tip Mechanic</h3>
                <p className="text-slate-400">Guides are incentivized to log more and better. The integrated tip flow improves the product quality automatically while rewarding your best staff.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1"><DollarSign className="text-emerald-500" size={28} /></div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Passive Upsell Revenue</h3>
                <p className="text-slate-400">Generate passive income per tour with no fulfillment work. Even a small percentage of guests buying the premium passport adds up across a season.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1"><Globe className="text-purple-400" size={28} /></div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Bilingual by Design</h3>
                <p className="text-slate-400">Built for international tourism. Outputs generate flawlessly in both English and Spanish to accommodate your diverse guest lists.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / 3 Cards Section */}
      <section className="bg-slate-900 py-24 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors group">
            <Map className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-2xl font-bold text-white mb-3">Expanding Parks</h3>
            <p className="text-slate-400 leading-relaxed">Scaling the Nature's Index ecosystem to parks and reserves worldwide. Give your guides the ultimate logging tool and your guests a souvenir worth keeping.</p>
          </div>
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors group">
            <Waves className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <div className="inline-block bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 uppercase tracking-wider">Coming Soon</div>
            <h3 className="text-2xl font-bold text-white mb-3">Ocean Bound</h3>
            <p className="text-slate-400 leading-relaxed">Taking the Index underwater. Dive guides will be able to log marine life and generate beautiful shareable dive profiles for every guest.</p>
          </div>
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors group">
            <BarChart3 className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <div className="inline-block bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 uppercase tracking-wider">Coming Soon (v2)</div>
            <h3 className="text-2xl font-bold text-white mb-3">Expedition Stats</h3>
            <p className="text-slate-400 leading-relaxed">Every tour builds your operation's species record. We're building guide performance insights and species trend tracking so your operation gets smarter over time.</p>
          </div>
        </div>
      </section>

      {/* Request a Park CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
         {/* Subtle background glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
         
         <div className="max-w-2xl mx-auto text-center relative z-10">
<h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Want Nature's Index in your area?</h2>
            <p className="text-xl text-slate-400 mb-10">We're partnering with tour operators and guide associations worldwide. Get on the list.</p>            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
