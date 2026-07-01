import { ArrowRight, Map, Waves, Leaf, Compass, UserCircle, Sparkles, HeartHandshake, DollarSign, Globe, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { supabase } from '../supabase';

// --- ANIMATION COMPONENTS ---
// Ambient background particles (leaves/bubbles)
function AmbientParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-emerald-400/60 rounded-tl-full rounded-br-full rounded-tr-sm rounded-bl-sm"
          style={{ left: `${Math.random() * 100}%` }}
          initial={{ y: -50, rotate: Math.random() * 360, opacity: 0 }}
        animate={{
            y: '110vh',
            rotate: Math.random() * 360 + 360,
            x: [0, 30, -30, 0],
            opacity: [0, 0.35, 0.35, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 25,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 6 + 2,
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
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });
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
const [parkName, setParkName] = useState('');
const [email, setEmail] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

const handleSubmit = async () => {
if (!parkName || !email) return;
setIsSubmitting(true);
const { error } = await supabase
.from('contact_requests')
.insert([{ park_name: parkName, email: email }]);
setIsSubmitting(false);
if (error) setSubmitStatus('error');
else {
setSubmitStatus('success');
setParkName('');
setEmail('');
}
};

  // --- SCROLL SCRUBBING SETUP ---
  const { scrollY } = useScroll();

  // 1. Hero Text & Cards (Tied to exact pixel scroll depth)
  // "LOG THE WILD." stays fully visible at 0.
  const line2Opacity = useTransform(scrollY, [50, 200], [0, 1]);
  const line2Y = useTransform(scrollY, [50, 200], [30, 0]);

  const line3Opacity = useTransform(scrollY, [150, 300], [0, 1]);
  const line3Scale = useTransform(scrollY, [150, 300], [0.8, 1]);

  const contentOpacity = useTransform(scrollY, [250, 400], [0, 1]);
  const contentY = useTransform(scrollY, [250, 400], [20, 0]);

  const cardsOpacity = useTransform(scrollY, [350, 550], [0, 1]);
  const cardsY = useTransform(scrollY, [350, 550], [50, 0]);

  // 2. Ragged Paintbrush Underlines (Tied to section progress)
  const howItWorksRef = useRef<HTMLElement>(null);
  const { scrollYProgress: howProgress } = useScroll({ target: howItWorksRef, offset: ["start 85%", "center center"] });

const operatorRef = useRef<HTMLElement>(null);
  const { scrollYProgress: operatorProgress } = useScroll({ target: operatorRef, offset: ["start 85%", "center center"] });

  const futureRef = useRef<HTMLElement>(null);
  const { scrollYProgress: futureProgress } = useScroll({ target: futureRef, offset: ["start 85%", "center center"] });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
<div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
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
<main className="relative max-w-7xl mx-auto px-6 pb-2 overflow-hidden flex-1 flex flex-col justify-end md:justify-center">
        <AmbientParticles />
        <div className="grid md:grid-cols-2 gap-12 items-center w-full relative z-10 mt-10">
          
          {/* Left Column: Typography - Tied to Scroll Scrubbing */}
          <div className="space-y-8 z-10 relative">
            <div className="flex flex-col">
              {/* Line 1 is always visible */}
              <motion.h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1] tracking-tighter uppercase">
                LOG THE WILD.
              </motion.h1>
              {/* Line 2 scrubs in */}
              <motion.h1 style={{ opacity: line2Opacity, y: line2Y }} className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-400 leading-[1] tracking-tighter uppercase mt-2">
                EVERY SIGHTING.
              </motion.h1>
              {/* Line 3 scrubs in and scales */}
              <motion.h1 style={{ opacity: line3Opacity, scale: line3Scale }} className="text-5xl sm:text-6xl md:text-9xl font-black leading-[0.9] tracking-tighter uppercase mt-4 text-transparent bg-clip-text bg-gradient-to-br from-[#C86A27] via-amber-500 to-yellow-600 drop-shadow-2xl origin-left">
                EVERY GUEST WOWED.
              </motion.h1>
            </div>

            <motion.p 
              style={{ opacity: contentOpacity, y: contentY }}
              className="text-xl text-slate-400 max-w-md leading-relaxed"
            >
              The wildlife logging tool for expedition guides. Log every sighting, generate guest highlights, and turn every tour into something worth sharing.
            </motion.p>
            
<motion.div style={{ opacity: contentOpacity, y: contentY }} className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                Bring It To Your Park <ArrowRight size={20} />
              </button>
              <button onClick={() => navigate('/preview')} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center">
                Explore Product Preview
              </button>
            </motion.div>
          </div>
          
          {/* Right Column: 3D Floating Cards - Tied to Scroll Scrubbing */}
          <div className="relative h-[450px] md:h-[550px] mt-10 md:mt-0 perspective-[1200px]">
            <motion.div style={{ opacity: cardsOpacity, y: cardsY }} className="absolute inset-0">
              {/* Front Card - Jungle Passport */}
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
              
              {/* Back Card - Dive Log */}
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
            </motion.div>
          </div>
        </div>
      </main>

{/* HOW IT WORKS - Asymmetrical Timeline */}
      <section ref={howItWorksRef} className="py-32 bg-slate-900/50 border-t border-slate-800/50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="mb-24 relative inline-block">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight relative z-10">
              How It Works
            </h2>
            {/* Drawn Ragged Brush Underline - Scrubbed */}
            <svg className="absolute -bottom-3 left-0 w-full h-6 pointer-events-none z-0 overflow-visible" viewBox="0 0 200 20" preserveAspectRatio="none">
              <motion.path 
                d="M 5,10 Q 30,14 60,8 T 120,12 T 180,6 T 205,10" 
                stroke="#60a5fa" 
                strokeWidth="6" 
                fill="none" 
                strokeLinecap="round" 
                style={{ pathLength: howProgress }} 
                className="drop-shadow-lg"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-16 md:gap-0 relative">
            {/* Connecting Background Line (Desktop only) */}
            <div className="hidden md:block absolute left-[4.5rem] top-10 bottom-10 w-[2px] bg-gradient-to-b from-blue-500/50 via-slate-700/50 to-transparent -z-10" />

{/* Step 1 - Left Aligned */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="flex gap-4 md:gap-8 items-start w-[95%] md:w-2/3">
              <div className="w-14 h-14 md:w-20 md:h-20 shrink-0 bg-slate-950 border-2 border-blue-500/30 text-blue-400 rounded-full flex items-center justify-center text-xl md:text-3xl font-black shadow-[0_0_30px_rgba(59,130,246,0.2)]">1</div>
              <div className="pt-2 md:pt-4">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">Guide Logs Sightings</h3>
                <p className="text-base md:text-lg text-slate-400 leading-relaxed text-left">Guides log species in real time through a fast, mobile-friendly portal, built for the trail, not the office.</p>
              </div>
            </motion.div>

          {/* Step 2 - Offset Right on Both Mobile & Desktop */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true, margin: "-100px" }} 
              transition={{ duration: 0.6 }} 
              className="flex gap-4 md:gap-8 items-start w-[95%] ml-auto md:w-2/3 md:ml-auto mt-12 md:mt-20 justify-end"
            >
              <div className="pt-2 md:pt-4 text-right">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">Guest Receives Link</h3>
                <p className="text-base md:text-lg text-slate-400 leading-relaxed text-right">At tour's end, every guest gets a personal link, their free highlight reel, a tip button for their guide, and access to purchase their Wildlife Passport.</p>
              </div>
              <div className="w-14 h-14 md:w-20 md:h-20 shrink-0 bg-slate-950 border-2 border-[#C86A27]/30 text-[#C86A27] rounded-full flex items-center justify-center text-xl md:text-3xl font-black shadow-[0_0_30px_rgba(200,106,39,0.2)]">
                2
              </div>
            </motion.div>

            {/* Step 3 - Offset Further Left */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="flex gap-4 md:gap-8 items-start w-[95%] md:w-2/3 mt-12 md:mt-20">
              <div className="w-14 h-14 md:w-20 md:h-20 shrink-0 bg-slate-950 border-2 border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center text-xl md:text-3xl font-black shadow-[0_0_30px_rgba(16,185,129,0.2)]">3</div>
              <div className="pt-2 md:pt-4">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">The Ripple Effect</h3>
                <p className="text-base md:text-lg text-slate-400 leading-relaxed text-left">Guests share their adventure. Guides earn recognition and tips. Operators get content, data, and loyalty, all without lifting a finger.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY OPERATORS CARE - The B2B Pitch */}
      <section ref={operatorRef} className="py-24 bg-slate-950 border-t border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
<div className="mb-16 relative inline-block max-w-full">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight relative z-10">
              The ultimate tool for tour operators.
            </h2>
            {/* Drawn Ragged Brush Underline - Scrubbed */}
            <svg className="absolute -bottom-3 left-0 w-full h-6 pointer-events-none z-0 overflow-visible" viewBox="0 0 300 20" preserveAspectRatio="none">
              <motion.path 
                d="M 5,10 Q 40,6 90,12 T 180,8 T 270,14 T 305,10" 
                stroke="#2563eb" 
                strokeWidth="6" 
                fill="none" 
                strokeLinecap="round" 
                style={{ pathLength: operatorProgress }} 
                className="drop-shadow-lg"
              />
            </svg>
          </div>
          
          {/* Operator Benefits - Floating Asymmetrical Bubbles */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-10">
            
            {/* Benefit 1 - Left Aligned on Mobile */}
            <motion.div 
                whileInView={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut", y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.1 } }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.2)", border: "1px solid rgba(59, 130, 246, 0.4)" }}
                className="w-[92%] md:w-full bg-slate-900/80 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] rounded-tr-xl border border-slate-800 transition-colors group relative overflow-hidden h-[300px] flex flex-col justify-center"
            >
              <div className="absolute inset-0 z-0 opacity-5 group-hover:opacity-10 transition-opacity flex items-center justify-center pointer-events-none">
                <Sparkles className="text-blue-500" size={280} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tighter">The Guest Wow Factor</h3>
                <p className="text-base md:text-lg text-slate-400 max-w-sm">Your guests leave with something shareable and personal. They post it. They tag you. Free marketing, zero behavioral change from your operation.</p>
              </div>
            </motion.div>

            {/* Benefit 2 - Right Aligned on Mobile */}
            <motion.div 
                whileInView={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2, y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1.2 } }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(200, 106, 39, 0.2)", border: "1px solid rgba(200, 106, 39, 0.4)" }}
                className="w-[92%] ml-auto md:w-full md:ml-0 md:mt-12 bg-slate-900/80 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] rounded-tl-xl border border-slate-800 transition-colors group relative overflow-hidden h-[300px] flex flex-col justify-center"
            >
              <div className="absolute inset-0 z-0 opacity-5 group-hover:opacity-10 transition-opacity flex items-center justify-center pointer-events-none">
                <HeartHandshake className="text-[#C86A27]" size={280} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tighter">The Tip Mechanic</h3>
                <p className="text-base md:text-lg text-slate-400 max-w-sm">Guides are incentivized to log more and better. The integrated tip flow improves the product quality automatically while rewarding your best staff.</p>
              </div>
            </motion.div>

            {/* Benefit 3 - Left Aligned on Mobile */}
            <motion.div 
                whileInView={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3, y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2.3 } }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16, 185, 129, 0.2)", border: "1px solid rgba(16, 185, 129, 0.4)" }}
                className="w-[92%] md:w-full md:-mt-12 bg-slate-900/80 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] rounded-bl-xl border border-slate-800 transition-colors group relative overflow-hidden h-[300px] flex flex-col justify-center"
            >
              <div className="absolute inset-0 z-0 opacity-5 group-hover:opacity-10 transition-opacity flex items-center justify-center pointer-events-none">
                <DollarSign className="text-emerald-500" size={280} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tighter">Passive Upsell Revenue</h3>
                <p className="text-base md:text-lg text-slate-400 max-w-sm">Generate passive income per tour with no fulfillment work. Even a small percentage of guests buying premium adds up quickly.</p>
              </div>
            </motion.div>

            {/* Benefit 4 - Right Aligned on Mobile */}
            <motion.div 
                whileInView={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4, y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 3.4 } }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(167, 139, 250, 0.2)", border: "1px solid rgba(167, 139, 250, 0.4)" }}
                className="w-[92%] ml-auto md:w-full bg-slate-900/80 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] rounded-br-xl border border-slate-800 transition-colors group relative overflow-hidden h-[300px] flex flex-col justify-center"
            >
              <div className="absolute inset-0 z-0 opacity-5 group-hover:opacity-10 transition-opacity flex items-center justify-center pointer-events-none">
                <Globe className="text-purple-400" size={280} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tighter">Bilingual by Design</h3>
                <p className="text-base md:text-lg text-slate-400 max-w-sm">Built for international guides and guests. Currently English and Español, with more languages coming soon.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

{/* THE FUTURE - COMING SOON SECTION */}
      <section ref={futureRef} className="bg-slate-900 py-32 border-y border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-24">
            <div className="inline-block bg-blue-500/20 text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest border border-blue-500/30">
              Coming Soon
            </div>
            <br/>
            <div className="relative inline-block">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight relative z-10">
                The Future of the Index
              </h2>
              {/* Drawn Ragged Brush Underline - Scrubbed */}
              <svg className="absolute -bottom-2 left-0 w-full h-6 pointer-events-none z-0 overflow-visible" viewBox="0 0 250 20" preserveAspectRatio="none">
                <motion.path 
                  d="M 5,10 Q 40,14 80,8 T 160,12 T 245,10" 
                  stroke="#3b82f6" 
                  strokeWidth="5" 
                  fill="none" 
                  strokeLinecap="round" 
                  style={{ pathLength: futureProgress }} 
                  className="drop-shadow-lg"
                />
              </svg>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Expanding Parks */}
            <motion.div whileHover={{ y: -5 }} className="bg-slate-950 p-8 rounded-3xl border border-slate-800 transition-colors group relative overflow-hidden">
              <Map className="text-[#C86A27] mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-2xl font-bold text-white mb-3">Expanding Parks</h3>
              <p className="text-slate-400 leading-relaxed relative z-10">Scaling the ecosystem to parks and reserves worldwide. Giving guides the ultimate logging tool and guests a premium souvenir.</p>
            </motion.div>
            
            {/* Ocean Bound */}
            <motion.div whileHover={{ y: -5 }} className="bg-slate-950 p-8 rounded-3xl border border-slate-800 transition-colors group relative overflow-hidden">
              <Waves className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-2xl font-bold text-white mb-3">Ocean Bound</h3>
              <p className="text-slate-400 leading-relaxed relative z-10">Taking the Index underwater. Dive guides will be able to log marine life and generate beautiful shareable dive profiles.</p>
            </motion.div>

            {/* Expedition Stats */}
            <motion.div whileHover={{ y: -5 }} className="bg-slate-950 p-8 rounded-3xl border border-slate-800 transition-colors group relative overflow-hidden">
              <BarChart3 className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-2xl font-bold text-white mb-3">Expedition Stats</h3>
              <p className="text-slate-400 leading-relaxed relative z-10">Every tour builds your operation's record. We're building guide performance insights and species trend tracking.</p>
            </motion.div>
          </div>
        </div>
      </section>

{/* Request a Park CTA */}
<section className="py-32 px-6 relative overflow-hidden">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-blue-400/20 blur-[120px] rounded-full pointer-events-none"></div>

  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="max-w-4xl mx-auto text-center relative z-10"
  >
    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
      Bring Nature's Index To Your Park.
    </h2>
    <p className="text-xl text-slate-300 mb-10 font-medium">No commitment. We'll reach out with partnership details.</p>

    {submitStatus === 'success' ? (
      <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-6 py-4 rounded-2xl font-bold inline-block">
        Request received! We'll be in touch soon.
      </div>
    ) : (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <input 
          type="text" 
          value={parkName}
          onChange={(e) => setParkName(e.target.value)}
          placeholder="Enter your park or region..." 
          className="bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-2xl outline-none focus:border-blue-400 transition-colors w-full sm:w-1/3"
        />
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address..." 
          className="bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-2xl outline-none focus:border-blue-400 transition-colors w-full sm:w-1/3"
        />
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-500 text-white hover:bg-blue-400 px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap w-full sm:w-auto shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(96,165,250,0.6)] disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Submit Request'}
        </button>
      </div>
    )}
    {submitStatus === 'error' && <p className="text-red-400 mt-4 font-bold">Oops! Something went wrong. Try again.</p>}
  </motion.div>
</section>
    </div>
  );
}
