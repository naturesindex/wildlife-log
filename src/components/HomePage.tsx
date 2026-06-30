import { ArrowRight, Map, Waves, Leaf, Compass, UserCircle, Share2, HeartHandshake, DollarSign, Globe, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React from 'react';

// --- ANIMATION COMPONENTS ---
// Ambient background particles (leaves/bubbles)
function AmbientParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-emerald-500/20 rounded-full blur-[1px]"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100,
            opacity: Math.random() * 0.5 + 0.1
          }}
          animate={{
            y: -100,
            x: `+=${Math.random() * 100 - 50}`
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
        />
      ))}
    </div>
  );
}

// This handles the 3D mouse tracking AND the infinite ambient float
function TiltCard({ children, className, delay = 0 }: { children: React.ReactNode, className: string, delay?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Cranked up the physics so the tilt is much more obvious
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });
  // Doubled the rotation angles from 12 to 25 degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["25deg", "-25deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-25deg", "25deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      animate={{ y: [0, -15, 0] }}
      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay }}
      className={className}
    >
      <div style={{ transform: "translateZ(50px)" }} className="w-full h-full relative">
        {children}
      </div>
    </motion.div>
  );
}

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

{/* Hero Section - Animated & Asymmetrical */}
      <main className="relative max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-20 overflow-hidden min-h-[90vh] flex items-center">
        <AmbientParticles />
        <div className="grid md:grid-cols-2 gap-12 items-center w-full relative z-10">
          
          {/* Left Column: Typography */}
          <div className="space-y-8 z-10 relative">
            <motion.div 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                // Slowed down the stagger from 0.15 to 0.4 for drama
                show: { opacity: 1, transition: { staggerChildren: 0.4 } } 
              }}
              className="flex flex-col"
            >
              {/* Added scale: 0.9 to 1 to create the "grow on scroll" effect */}
              <motion.h1 variants={{ hidden: { opacity: 0, y: 30, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: "easeOut" } } }} className="text-6xl md:text-7xl font-black text-white leading-[1] tracking-tighter uppercase">
                LOG THE WILD.
              </motion.h1>
              <motion.h1 variants={{ hidden: { opacity: 0, y: 30, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: "easeOut" } } }} className="text-6xl md:text-7xl font-black text-white leading-[1] tracking-tighter uppercase mt-2">
                EVERY SIGHTING.
              </motion.h1>
              {/* WOWED is now massive, colored in your brand orange/amber, and dropshadowed */}
              <motion.h1 variants={{ hidden: { opacity: 0, y: 30, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: "easeOut" } } }} className="text-7xl md:text-9xl font-black leading-[0.9] tracking-tighter uppercase mt-4 text-transparent bg-clip-text bg-gradient-to-br from-[#C86A27] via-amber-500 to-yellow-600 drop-shadow-2xl">
                WOWED.
              </motion.h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1.2, duration: 1 }}
              className="text-xl text-slate-400 max-w-md leading-relaxed"
            >
              The wildlife logging tool for expedition guides. Log every sighting, generate guest highlights, and turn every tour into something worth sharing.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1.5 }}
              className="flex gap-4"
            >
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                Bring It To Your Park <ArrowRight size={20} />
              </button>
            </motion.div>
          </div>
          
          {/* Right Column: 3D Floating Cards */}
          <div className="relative h-[450px] md:h-[550px] mt-10 md:mt-0 perspective-[1200px]">
            {/* Front Card - Jungle Passport (Offset delay 0) */}
            <TiltCard className="absolute top-0 right-0 w-3/4 h-3/4 bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden z-20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent z-10 pointer-events-none"></div>
              <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop" alt="Lush Jungle" className="w-full h-full object-cover opacity-70" />
              <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">
                  Active
                </div>
                <div className="text-2xl font-bold text-white shadow-sm">Wildlife Park Logs</div>
              </div>
            </TiltCard>
            
            {/* Back Card - Dive Log (Offset delay 1.5s so they float out of sync) */}
            <TiltCard delay={1.5} className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl z-10">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent z-10 pointer-events-none"></div>
              <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop" alt="Deep Ocean Dive" className="w-full h-full object-cover opacity-40 grayscale-[30%]" />
               <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-3 py-1 rounded-full mb-2 inline-block uppercase tracking-wider">
                  Coming Soon
                </div>
                <div className="text-xl font-bold text-white/80">Digital Dive Logs</div>
              </div>
            </TiltCard>
          </div>
        </div>
      </main>

      {/* HOW IT WORKS - Asymmetrical Timeline */}
      <section className="py-32 bg-slate-900/50 border-t border-slate-800/50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-24 relative inline-block"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight relative z-10">
              How It Works
            </h2>
            {/* Underline Draw-on Effect */}
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
              className="absolute -bottom-2 left-0 w-full h-3 bg-blue-600/50 -z-0 origin-left rounded-full"
            />
          </motion.div>

          <div className="flex flex-col gap-16 md:gap-0 relative">
            {/* Connecting Background Line (Desktop only) */}
            <div className="hidden md:block absolute left-[4.5rem] top-10 bottom-10 w-[2px] bg-gradient-to-b from-blue-500/50 via-slate-700/50 to-transparent -z-10" />

            {/* Step 1 - Left Aligned */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="flex gap-8 items-start md:w-2/3">
              <div className="w-20 h-20 shrink-0 bg-slate-950 border-2 border-blue-500/30 text-blue-400 rounded-full flex items-center justify-center text-3xl font-black shadow-[0_0_30px_rgba(59,130,246,0.2)]">1</div>
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-white mb-4">Guide Logs Sightings</h3>
                <p className="text-lg text-slate-400 leading-relaxed text-left">Guides log species in real time through a fast, mobile-friendly portal, built for the trail, not the office.</p>
              </div>
            </motion.div>

            {/* Step 2 - Offset Right */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="flex gap-8 items-start md:w-2/3 md:ml-auto md:mt-20">
              <div className="w-20 h-20 shrink-0 bg-slate-950 border-2 border-[#C86A27]/30 text-[#C86A27] rounded-full flex items-center justify-center text-3xl font-black shadow-[0_0_30px_rgba(200,106,39,0.2)] order-1 md:order-2">2</div>
              <div className="pt-4 order-2 md:order-1 md:text-right">
                <h3 className="text-2xl font-bold text-white mb-4">Guest Receives Link</h3>
                <p className="text-lg text-slate-400 leading-relaxed md:text-right text-left">At tour's end, every guest gets a personal link, their free highlight reel, a tip button for their guide, and access to purchase their Wildlife Passport.</p>
              </div>
            </motion.div>

            {/* Step 3 - Offset Further Left */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="flex gap-8 items-start md:w-2/3 md:mt-20">
              <div className="w-20 h-20 shrink-0 bg-slate-950 border-2 border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center text-3xl font-black shadow-[0_0_30px_rgba(16,185,129,0.2)]">3</div>
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-white mb-4">The Ripple Effect</h3>
                <p className="text-lg text-slate-400 leading-relaxed text-left">Guests share their adventure. Guides earn recognition and tips. Operators get content, data, and loyalty, all without lifting a finger.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY OPERATORS CARE - The B2B Pitch */}
      <section className="py-24 bg-slate-950 border-t border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-white mb-16 tracking-tight max-w-2xl"
          >
            The ultimate tool for tour operators.
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex gap-4">
              <div className="mt-1"><Share2 className="text-blue-500" size={28} /></div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">The Guest Wow Factor</h3>
                <p className="text-slate-400">Your guests leave with something shareable and personal. They post it. They tag you. That's free marketing requiring zero behavior change from your operation.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex gap-4">
              <div className="mt-1"><HeartHandshake className="text-[#C86A27]" size={28} /></div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">The Tip Mechanic</h3>
                <p className="text-slate-400">Guides are incentivized to log more and better. The integrated tip flow improves the product quality automatically while rewarding your best staff.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex gap-4">
              <div className="mt-1"><DollarSign className="text-emerald-500" size={28} /></div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Passive Upsell Revenue</h3>
                <p className="text-slate-400">Generate passive income per tour with no fulfillment work. Even a small percentage of guests buying the premium passport adds up across a season.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex gap-4">
              <div className="mt-1"><Globe className="text-purple-400" size={28} /></div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Bilingual by Design</h3>
                <p className="text-slate-400">Built for international guides and guests. Currently English and Español, with more languages coming.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission / 3 Cards Section */}
      <section className="bg-slate-900 py-24 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <motion.div whileHover={{ y: -5 }} className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors group">
            <Map className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-2xl font-bold text-white mb-3">Expanding Parks</h3>
            <p className="text-slate-400 leading-relaxed">Scaling the Nature's Index ecosystem to parks and reserves worldwide. Give your guides the ultimate logging tool and your guests a souvenir worth keeping.</p>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors group">
            <Waves className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <div className="inline-block bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 uppercase tracking-wider">Coming Soon</div>
            <h3 className="text-2xl font-bold text-white mb-3">Ocean Bound</h3>
            <p className="text-slate-400 leading-relaxed">Taking the Index underwater. Dive guides will be able to log marine life and generate beautiful shareable dive profiles for every guest.</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors group">
            <BarChart3 className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <div className="inline-block bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 uppercase tracking-wider">Coming Soon</div>
            <h3 className="text-2xl font-bold text-white mb-3">Expedition Stats</h3>
            <p className="text-slate-400 leading-relaxed">Every tour builds your operation's species record. We're building guide performance insights and species trend tracking so your operation gets smarter over time.</p>
          </motion.div>
        </div>
      </section>

      {/* Request a Park CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
         
         <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center relative z-10"
         >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Want Nature's Index in your area?</h2>
            <p className="text-xl text-slate-400 mb-2">We're partnering with tour operators and guide associations worldwide.</p>
            <p className="text-sm text-slate-500 mb-10 font-medium tracking-wide uppercase">No commitment. We'll reach out with partnership details.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="text" 
                placeholder="Enter your park or region..." 
                className="bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-xl sm:rounded-l-full sm:rounded-r-none outline-none focus:border-blue-500 transition-colors w-full sm:w-1/2"
              />
              <input 
                type="email" 
                placeholder="Your email address..." 
                className="bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-xl sm:rounded-none outline-none focus:border-blue-500 transition-colors w-full sm:w-1/2 sm:border-l-0"
              />
              <button className="bg-blue-600 text-white hover:bg-blue-500 px-8 py-4 rounded-xl sm:rounded-l-none sm:rounded-r-full font-bold transition-all whitespace-nowrap">
                Submit Request
              </button>
            </div>
         </motion.div>
      </section>
    </div>
  );
}
