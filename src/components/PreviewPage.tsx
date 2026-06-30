import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, UserCircle, Map, Camera, HeartHandshake, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useRef } from 'react';

export function PreviewPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress through this specific container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // UI Opacity transitions based on scroll depth
  // 0.0 - 0.3: Guide Logging UI
  const guideOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  // 0.3 - 0.6: Guest Tipping/Link UI
  const guestOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.5, 0.6], [0, 1, 1, 0]);
  // 0.6 - 1.0: Final Passport UI
  const passportOpacity = useTransform(scrollYProgress, [0.6, 0.7, 1], [0, 1, 1]);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold">
          <ArrowLeft size={20} /> Back to Home
        </button>
        <div className="text-xl font-black tracking-tighter text-[#C86A27]">NATURE'S INDEX</div>
      </nav>

      {/* The Scrollable Story Container */}
      <div ref={containerRef} className="relative h-[400vh]">
        
        {/* Pinned Center Stage - The Phone */}
        <div className="sticky top-0 h-screen flex flex-col md:flex-row items-center justify-center gap-12 px-6 pt-20 overflow-hidden">
          
          {/* Left Side Text Content that changes as you scroll */}
          <div className="w-full md:w-1/3 space-y-24 relative h-64 md:h-96">
            <motion.div style={{ opacity: guideOpacity }} className="absolute inset-0 flex flex-col justify-center">
              <div className="bg-blue-500/20 text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full mb-6 w-max border border-blue-500/30">Step 1</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Fast logging for guides.</h2>
              <p className="text-xl text-slate-400">Guides simply tap what they see. Built for the jungle, requiring zero typing and barely any screen time.</p>
            </motion.div>

            <motion.div style={{ opacity: guestOpacity }} className="absolute inset-0 flex flex-col justify-center">
              <div className="bg-[#C86A27]/20 text-[#C86A27] text-sm font-bold px-4 py-1.5 rounded-full mb-6 w-max border border-[#C86A27]/30">Step 2</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Guests get the link.</h2>
              <p className="text-xl text-slate-400">At the end of the tour, a single link is shared. Guests can instantly tip their guide and view their free highlights.</p>
            </motion.div>

            <motion.div style={{ opacity: passportOpacity }} className="absolute inset-0 flex flex-col justify-center">
              <div className="bg-emerald-500/20 text-emerald-400 text-sm font-bold px-4 py-1.5 rounded-full mb-6 w-max border border-emerald-500/30">Step 3</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">The Premium Souvenir.</h2>
              <p className="text-xl text-slate-400">Guests upgrade to the full Passport to see all stats, maps, and generate a print-ready poster of their exact day.</p>
            </motion.div>
          </div>

          {/* Right Side - The Transforming Phone Interface */}
          <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden shrink-0">
            
            {/* Guide UI */}
            <motion.div style={{ opacity: guideOpacity }} className="absolute inset-0 bg-[#0b170f] p-4 flex flex-col">
              <div className="bg-[#162b1d] p-4 rounded-2xl mb-4 text-center mt-8">
                <span className="text-emerald-500 font-bold text-sm block">LIVE LOG</span>
                <span className="text-white text-3xl font-black">12 SPECIES</span>
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
                      <div className="h-4 w-24 bg-white/20 rounded"></div>
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center">✓</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Guest Tip UI */}
            <motion.div style={{ opacity: guestOpacity }} className="absolute inset-0 bg-slate-900 p-6 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full mb-4 flex items-center justify-center border-4 border-[#C86A27]">
                <UserCircle size={40} className="text-[#C86A27]" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Tip your guide, Juan!</h3>
              <p className="text-slate-400 text-sm mb-8">Juan logged 12 incredible species for you today.</p>
              <div className="grid grid-cols-3 gap-2 w-full mb-4">
                <div className="bg-slate-800 py-3 rounded-xl font-bold text-white">$5</div>
                <div className="bg-[#C86A27] py-3 rounded-xl font-bold text-white">$10</div>
                <div className="bg-slate-800 py-3 rounded-xl font-bold text-white">$20</div>
              </div>
              <button className="w-full bg-blue-600 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2">
                <HeartHandshake size={18} /> Send Tip
              </button>
            </motion.div>

            {/* Final Passport UI */}
            <motion.div style={{ opacity: passportOpacity }} className="absolute inset-0 bg-[#FDFBF7] text-stone-900 flex flex-col overflow-hidden">
              <div className="h-48 bg-stone-300 relative">
                <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover" alt="Jungle" />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#FDFBF7] to-transparent h-20"></div>
              </div>
              <div className="px-4 -mt-10 relative z-10 flex-1">
                <h3 className="text-3xl font-black text-stone-900 leading-tight mb-4">Wildlife Passport</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-white shadow-sm border border-stone-200 p-3 rounded-xl">
                    <span className="block text-[10px] text-stone-500 font-bold uppercase">Rating</span>
                    <span className="font-black text-emerald-600">Top 12%</span>
                  </div>
                  <div className="bg-white shadow-sm border border-stone-200 p-3 rounded-xl">
                    <span className="block text-[10px] text-stone-500 font-bold uppercase">Distance</span>
                    <span className="font-black text-stone-800">10 km</span>
                  </div>
                </div>
                <button className="w-full bg-[#C86A27] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#C86A27]/20">
                   <Download size={18} /> High-Res Poster
                </button>
                <div className="mt-4 grid grid-cols-2 gap-2">
                   <div className="h-24 bg-stone-200 rounded-xl"></div>
                   <div className="h-24 bg-stone-200 rounded-xl"></div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
