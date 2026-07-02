import { ArrowRight, Map, Waves, Leaf, Compass, UserCircle, Sparkles, HeartHandshake, DollarSign, Globe, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { supabase } from '../supabase';

// --- ANIMATION COMPONENTS ---
function AmbientParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#99C2A2]/20 rounded-full blur-[1px]"
          style={{ left: `${Math.random() * 100}%` }}
          initial={{ y: -50, rotate: 0, opacity: 0 }}
          animate={{
            y: '110vh',
            x: [0, 40, -40, 0],
            opacity: [0, 0.2, 0.2, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 30,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
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
const [language, setLanguage] = useState<'EN' | 'ES'>('EN');
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

  // --- SCROLL SCRUBBING SETUP (Fixed for Mobile Jumps) ---
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProg } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const line2Opacity = useTransform(heroProg, [0.05, 0.2], [0, 1]);
  const line2Y = useTransform(heroProg, [0.05, 0.2], [20, 0]);

  const line3Opacity = useTransform(heroProg, [0.15, 0.3], [0, 1]);
  const line3Scale = useTransform(heroProg, [0.15, 0.3], [0.9, 1]);

  const contentOpacity = useTransform(heroProg, [0.25, 0.4], [0, 1]);
  const contentY = useTransform(heroProg, [0.25, 0.4], [20, 0]);

const cardsOpacity = useTransform(heroProg, [0.25, 0.45], [0, 1]);
  const cardsY = useTransform(heroProg, [0.25, 0.45], [30, 0]);

const howItWorksRef = useRef<HTMLElement>(null);
  // Changed "center center" to "start 40%" so it finishes drawing while still lower on the screen
  const { scrollYProgress: howProgress } = useScroll({ target: howItWorksRef, offset: ["start 85%", "start 40%"] });

  const operatorRef = useRef<HTMLElement>(null);
  const { scrollYProgress: operatorProgress } = useScroll({ target: operatorRef, offset: ["start 85%", "start 40%"] });

  const futureRef = useRef<HTMLElement>(null);
  const { scrollYProgress: futureProgress } = useScroll({ target: futureRef, offset: ["start 85%", "start 40%"] });

  return (
    // Added 'select-none' here to prevent the weird text-highlighting cursor everywhere!
    <div className="min-[100dvh] bg-[#003B36] text-[#93B1A7] font-sans selection:bg-[#F0803C]/30 select-none">
{/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-30 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          <Leaf className="text-[#F0803C]" />
          <span className="text-[#F0803C]">NATURE'S INDEX</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#16697A]/40 rounded-full p-1 border border-[#99C2A2]/30 backdrop-blur-sm">
            <button onClick={() => setLanguage('EN')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'EN' ? 'bg-[#F0803C] text-white' : 'text-[#99C2A2] hover:text-white'}`}>EN</button>
            <button onClick={() => setLanguage('ES')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'ES' ? 'bg-[#F0803C] text-white' : 'text-[#99C2A2] hover:text-white'}`}>ES</button>
          </div>
          <button 
            onClick={() => navigate('/corcovado/guide')}
            className="hidden sm:flex items-center gap-2 bg-[#16697A] hover:bg-[#125866] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all border border-[#99C2A2]/30"
          >
            <UserCircle size={18} />
            {language === 'EN' ? 'Guide Portal' : 'Portal de Guías'}
          </button>
        </div>
      </nav>

{/* Hero Section - Animated & Asymmetrical */}
<main ref={heroRef} className="relative max-w-7xl mx-auto px-6 pb-16 overflow-hidden">
        <AmbientParticles />
        <div className="grid md:grid-cols-2 gap-12 items-center w-full relative z-10 pt-[calc(100dvh-120px)] md:pt-[calc(100dvh-220px)]">
          
          {/* Left Column: Typography - Tied to Scroll Scrubbing */}
          <div className="space-y-8 z-10 relative">
            <div className="flex flex-col">
              {/* Line 1 is always visible */}
              <motion.h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1] tracking-tighter uppercase">
                {language === 'EN' ? 'LOG THE WILD.' : 'REGISTRA LO SALVAJE.'}
              </motion.h1>
              {/* Line 2 scrubs in */}
              <motion.h1 style={{ opacity: line2Opacity, y: line2Y }} className="text-4xl sm:text-5xl md:text-7xl font-black text-[#99C2A2] leading-[1] tracking-tighter uppercase mt-2">
                {language === 'EN' ? 'EVERY SIGHTING.' : 'CADA AVISTAMIENTO.'}
              </motion.h1>
              {/* Line 3 scrubs in and scales */}
              <motion.h1 style={{ opacity: line3Opacity, scale: line3Scale }} className="text-5xl sm:text-6xl md:text-9xl font-black leading-[0.9] tracking-tighter uppercase mt-4 text-[#F0803C] drop-shadow-2xl origin-left">
                {language === 'EN' ? 'EVERY GUEST WOWED.' : 'CADA INVITADO FASCINADO.'}
              </motion.h1>
            </div>

            <motion.p 
              style={{ opacity: contentOpacity, y: contentY }}
              className="text-xl text-[#93B1A7] max-w-md leading-relaxed"
            >
              {language === 'EN' 
                ? 'The wildlife logging tool for expedition guides. Log every sighting, generate guest highlights, and turn every tour into something worth sharing.' 
                : 'La herramienta de registro para guías de expedición. Registra cada avistamiento, genera recuerdos y convierte cada tour en algo digno de compartir.'}
            </motion.p>
            
<motion.div style={{ opacity: contentOpacity, y: contentY }} className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#F0803C] hover:bg-[#d66b2d] text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(240,128,60,0.3)] hover:shadow-[0_0_30px_rgba(240,128,60,0.5)]">
                {language === 'EN' ? 'Bring It To Your Park' : 'Llévalo a tu Parque'} <ArrowRight size={20} />
              </button>
              <button onClick={() => navigate('/preview')} className="bg-[#16697A] hover:bg-[#125866] text-white border border-[#99C2A2]/30 px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center">
                {language === 'EN' ? 'Explore Product Preview' : 'Explorar Vista Previa'}
              </button>
            </motion.div>
          </div>
          
          {/* Right Column: 3D Floating Cards - Tied to Scroll Scrubbing */}
          <div className="relative h-[450px] md:h-[550px] mt-10 md:mt-0 perspective-[1200px]">
            <motion.div style={{ opacity: cardsOpacity, y: cardsY }} className="absolute inset-0">
              {/* Front Card - Jungle Passport */}
              <TiltCard className="absolute top-0 right-0 w-3/4 h-3/4 bg-[#16697A] rounded-3xl border border-[#99C2A2]/30 overflow-hidden z-20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-[#003B36]/90 via-[#003B36]/20 to-transparent z-10 pointer-events-none"></div>
                <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop" alt="Lush Jungle" className="w-full h-full object-cover opacity-70 mix-blend-overlay" />
                <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                    <div className="bg-[#99C2A2]/20 text-[#99C2A2] border border-[#99C2A2]/30 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">
                    {language === 'EN' ? 'Active' : 'Activo'}
                    </div>
                    <div className="text-2xl font-bold text-white shadow-sm">{language === 'EN' ? 'Wildlife Park Logs' : 'Registros de Parques'}</div>
                </div>
              </TiltCard>
              
              {/* Back Card - Dive Log */}
              <TiltCard delay={1.5} className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-[#16697A] rounded-3xl border border-[#99C2A2]/30 overflow-hidden shadow-xl z-10">
                <div className="absolute inset-0 bg-gradient-to-t from-[#003B36]/90 via-[#003B36]/20 to-transparent z-10 pointer-events-none"></div>
                <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop" alt="Deep Ocean Dive" className="w-full h-full object-cover opacity-40 grayscale-[30%] mix-blend-overlay" />
                    <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                    <div className="bg-[#F0803C]/20 text-[#F0803C] border border-[#F0803C]/30 text-[10px] font-bold px-3 py-1 rounded-full mb-2 inline-block uppercase tracking-wider">
                    {language === 'EN' ? 'Coming Soon' : 'Próximamente'}
                    </div>
                    <div className="text-xl font-bold text-white/80">{language === 'EN' ? 'Digital Dive Logs' : 'Bitácoras de Buceo'}</div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </main>

{/* HOW IT WORKS - Asymmetrical Timeline */}
      <section ref={howItWorksRef} className="py-32 bg-[#16697A]/10 border-t border-[#99C2A2]/10 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="mb-24 relative inline-block">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight relative z-10">
              {language === 'EN' ? 'How It Works' : 'Cómo Funciona'}
            </h2>
            {/* Drawn Ragged Brush Underline - Scrubbed */}
            <svg className="absolute -bottom-3 left-0 w-full h-6 pointer-events-none z-0 overflow-visible" viewBox="0 0 200 20" preserveAspectRatio="none">
              <motion.path 
                d="M 5,10 Q 30,14 60,8 T 120,12 T 180,6 T 205,10" 
                stroke="#99C2A2" 
                strokeWidth="6" 
                fill="none" 
                strokeLinecap="round" 
                style={{ pathLength: howProgress }} 
              />
            </svg>
          </div>

          <div className="flex flex-col gap-16 md:gap-0 relative">
            {/* Connecting Background Line (Desktop only) */}
            <div className="hidden md:block absolute left-[4.5rem] top-10 bottom-10 w-[2px] bg-gradient-to-b from-[#16697A] via-[#16697A]/50 to-transparent -z-10" />

{/* Step 1 - Left Aligned */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="flex gap-4 md:gap-8 items-start w-[95%] md:w-2/3">
              <div className="w-14 h-14 md:w-20 md:h-20 shrink-0 bg-[#16697A] border-2 border-[#99C2A2] text-[#F0803C] rounded-full flex items-center justify-center text-xl md:text-3xl font-black">1</div>
              <div className="pt-2 md:pt-4">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">{language === 'EN' ? 'Guide Logs Sightings' : 'El Guía Registra'}</h3>
                <p className="text-base md:text-lg text-[#93B1A7] leading-relaxed text-left">{language === 'EN' ? 'Guides log species in real time through a fast, mobile-friendly portal, built for the trail, not the office.' : 'Los guías registran especies en tiempo real a través de un portal rápido y móvil, diseñado para el sendero, no para la oficina.'}</p>
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
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">{language === 'EN' ? 'Guest Receives Link' : 'El Invitado Recibe el Enlace'}</h3>
                <p className="text-base md:text-lg text-[#93B1A7] leading-relaxed text-right">{language === 'EN' ? "At tour's end, every guest gets a personal link, their free highlight reel, a tip button for their guide, and access to purchase their Wildlife Passport." : 'Al final del recorrido, cada invitado obtiene un enlace personal, un resumen gratuito, un botón de propina y acceso para comprar su Pasaporte de Vida Silvestre.'}</p>
              </div>
              <div className="w-14 h-14 md:w-20 md:h-20 shrink-0 bg-[#16697A] border-2 border-[#99C2A2] text-[#F0803C] rounded-full flex items-center justify-center text-xl md:text-3xl font-black">
                2
              </div>
            </motion.div>

            {/* Step 3 - Offset Further Left */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="flex gap-4 md:gap-8 items-start w-[95%] md:w-2/3 mt-12 md:mt-20">
              <div className="w-14 h-14 md:w-20 md:h-20 shrink-0 bg-[#16697A] border-2 border-[#99C2A2] text-[#F0803C] rounded-full flex items-center justify-center text-xl md:text-3xl font-black">3</div>
              <div className="pt-2 md:pt-4">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">{language === 'EN' ? 'The Ripple Effect' : 'El Efecto Multiplicador'}</h3>
                <p className="text-base md:text-lg text-[#93B1A7] leading-relaxed text-left">{language === 'EN' ? 'Guests share their adventure. Guides earn recognition and tips. Operators get content, data, and loyalty, all without lifting a finger.' : 'Los invitados comparten su aventura. Los guías ganan reconocimiento. Los operadores obtienen contenido y lealtad, sin mover un dedo.'}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

{/* WHY OPERATORS CARE - The B2B Pitch */}
      <section ref={operatorRef} className="py-24 bg-[#003B36] border-t border-[#16697A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
<div className="mb-16 relative inline-block max-w-full">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight relative z-10">
              {language === 'EN' ? 'The ultimate tool for tour operators.' : 'La herramienta definitiva para operadores.'}
            </h2>
            {/* Drawn Ragged Brush Underline - Scrubbed */}
            <svg className="absolute -bottom-3 left-0 w-full h-6 pointer-events-none z-0 overflow-visible" viewBox="0 0 300 20" preserveAspectRatio="none">
              <motion.path 
                d="M 5,10 Q 40,6 90,12 T 180,8 T 270,14 T 305,10" 
                stroke="#99C2A2" 
                strokeWidth="6" 
                fill="none" 
                strokeLinecap="round" 
                style={{ pathLength: operatorProgress }} 
              />
            </svg>
          </div>
          
          {/* Operator Benefits - Morphing Blobs */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-10">
            
{/* Benefit 1 */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                animate={{ borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"] }}
                transition={{ 
                  borderRadius: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 0.6 },
                  y: { duration: 0.6 }
                }}
                className="w-[92%] md:w-full bg-[#16697A]/40 p-8 md:p-10 border border-[#99C2A2]/30 backdrop-blur-sm relative overflow-hidden h-[300px] flex flex-col justify-center items-center text-center"
            >
              <div className="relative z-10 flex flex-col items-center">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tighter">{language === 'EN' ? 'The Guest Wow Factor' : 'El Factor Sorpresa'}</h3>
                <p className="text-base md:text-lg text-[#99C2A2] max-w-sm">{language === 'EN' ? 'Your guests leave with something shareable and personal. They post it. They tag you. Free marketing, zero behavioral change from your operation.' : 'Tus invitados se van con algo personal y compartible. Lo publican. Te etiquetan. Marketing gratuito, cero cambios operativos.'}</p>
              </div>
            </motion.div>

            {/* Benefit 2 */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                animate={{ borderRadius: ["50% 50% 30% 70% / 60% 40% 60% 40%", "30% 70% 50% 50% / 40% 60% 40% 60%", "50% 50% 30% 70% / 60% 40% 60% 40%"] }}
                transition={{ 
                  borderRadius: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                  opacity: { duration: 0.6 },
                  y: { duration: 0.6 }
                }}
                className="w-[92%] ml-auto md:w-full md:ml-0 md:mt-12 bg-[#16697A]/40 p-8 md:p-10 border border-[#99C2A2]/30 backdrop-blur-sm relative overflow-hidden h-[300px] flex flex-col justify-center items-center text-center"
            >
              <div className="relative z-10 flex flex-col items-center">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tighter">{language === 'EN' ? 'The Tip Mechanic' : 'Mecánica de Propinas'}</h3>
                <p className="text-base md:text-lg text-[#99C2A2] max-w-sm">{language === 'EN' ? 'Guides are incentivized to log more and better. The integrated tip flow improves the product quality automatically while rewarding your best staff.' : 'Los guías se incentivan a registrar mejor. El flujo integrado de propinas mejora la calidad automáticamente y recompensa a tu personal.'}</p>
              </div>
            </motion.div>

            {/* Benefit 3 */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                animate={{ borderRadius: ["70% 30% 60% 40% / 50% 60% 40% 50%", "40% 60% 40% 60% / 60% 40% 60% 40%", "70% 30% 60% 40% / 50% 60% 40% 50%"] }}
                transition={{ 
                  borderRadius: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 },
                  opacity: { duration: 0.6 },
                  y: { duration: 0.6 }
                }}
                className="w-[92%] md:w-full md:-mt-12 bg-[#16697A]/40 p-8 md:p-10 border border-[#99C2A2]/30 backdrop-blur-sm relative overflow-hidden h-[300px] flex flex-col justify-center items-center text-center"
            >
              <div className="relative z-10 flex flex-col items-center">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tighter">{language === 'EN' ? 'Passive Upsell Revenue' : 'Ingresos Pasivos'}</h3>
                <p className="text-base md:text-lg text-[#99C2A2] max-w-sm">{language === 'EN' ? 'Generate passive income per tour with no fulfillment work. Even a small percentage of guests buying premium adds up quickly.' : 'Genera ingresos pasivos por recorrido sin trabajo adicional. Incluso un pequeño porcentaje de ventas premium suma rápidamente.'}</p>
              </div>
            </motion.div>

            {/* Benefit 4 */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                animate={{ borderRadius: ["30% 70% 40% 60% / 40% 50% 50% 60%", "60% 40% 70% 30% / 50% 40% 60% 50%", "30% 70% 40% 60% / 40% 50% 50% 60%"] }}
                transition={{ 
                  borderRadius: { duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
                  opacity: { duration: 0.6 },
                  y: { duration: 0.6 }
                }}
                className="w-[92%] ml-auto md:w-full bg-[#16697A]/40 p-8 md:p-10 border border-[#99C2A2]/30 backdrop-blur-sm relative overflow-hidden h-[300px] flex flex-col justify-center items-center text-center"
            >
              <div className="relative z-10 flex flex-col items-center">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tighter">{language === 'EN' ? 'Bilingual by Design' : 'Bilingüe por Diseño'}</h3>
                <p className="text-base md:text-lg text-[#99C2A2] max-w-sm">{language === 'EN' ? 'Built for international guides and guests. Currently English and Español, with more languages coming soon.' : 'Construido para guías e invitados internacionales. Actualmente en Inglés y Español, con más idiomas próximamente.'}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

{/* THE FUTURE - COMING SOON SECTION */}
      <section ref={futureRef} className="bg-[#16697A]/10 py-32 border-y border-[#99C2A2]/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-24">
            <div className="inline-block bg-[#F0803C]/20 text-[#F0803C] text-sm font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest border border-[#F0803C]/30">
              {language === 'EN' ? 'Coming Soon' : 'Próximamente'}
            </div>
            <br/>
            <div className="relative inline-block">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight relative z-10">
                {language === 'EN' ? 'The Future of the Index' : 'El Futuro del Índice'}
              </h2>
              {/* Drawn Ragged Brush Underline - Scrubbed */}
              <svg className="absolute -bottom-2 left-0 w-full h-6 pointer-events-none z-0 overflow-visible" viewBox="0 0 250 20" preserveAspectRatio="none">
                <motion.path 
d="M 5,10 Q 40,14 80,8 T 160,12 T 235,10 Q 250,5 240,18" 
                  stroke="#99C2A2"
                  strokeWidth="6" 
                  fill="none" 
                  strokeLinecap="round" 
                  style={{ pathLength: futureProgress }} 
                />
              </svg>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Expanding Parks */}
            <motion.div whileHover={{ y: -5 }} className="bg-[#16697A]/40 backdrop-blur-sm p-8 rounded-3xl border border-[#99C2A2]/30 transition-colors group relative overflow-hidden">
              <Map className="text-[#F0803C] mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-2xl font-bold text-white mb-3">{language === 'EN' ? 'Expanding Parks' : 'Expandiendo Parques'}</h3>
              <p className="text-[#99C2A2] leading-relaxed relative z-10">{language === 'EN' ? 'Scaling the ecosystem to parks and reserves worldwide. Giving guides the ultimate logging tool and guests a premium souvenir.' : 'Escalando el ecosistema a reservas globales. Dando a los guías la herramienta definitiva y a los invitados un recuerdo premium.'}</p>
            </motion.div>
            
            {/* Ocean Bound */}
            <motion.div whileHover={{ y: -5 }} className="bg-[#16697A]/40 backdrop-blur-sm p-8 rounded-3xl border border-[#99C2A2]/30 transition-colors group relative overflow-hidden">
              <Waves className="text-[#F0803C] mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-2xl font-bold text-white mb-3">{language === 'EN' ? 'Ocean Bound' : 'Hacia el Océano'}</h3>
              <p className="text-[#99C2A2] leading-relaxed relative z-10">{language === 'EN' ? 'Taking the Index underwater. Dive guides will be able to log marine life and generate beautiful shareable dive profiles.' : 'Llevando el Índice bajo el agua. Los guías podrán registrar vida marina y generar perfiles de buceo hermosos.'}</p>
            </motion.div>

            {/* Expedition Stats */}
            <motion.div whileHover={{ y: -5 }} className="bg-[#16697A]/40 backdrop-blur-sm p-8 rounded-3xl border border-[#99C2A2]/30 transition-colors group relative overflow-hidden">
              <BarChart3 className="text-[#F0803C] mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-2xl font-bold text-white mb-3">{language === 'EN' ? 'Expedition Stats' : 'Estadísticas de Expedición'}</h3>
              <p className="text-[#99C2A2] leading-relaxed relative z-10">{language === 'EN' ? "Every tour builds your operation's record. We're building guide performance insights and species trend tracking." : 'Cada recorrido construye tu registro. Estamos desarrollando estadísticas de rendimiento e informes de tendencias.'}</p>
            </motion.div>
          </div>
        </div>
      </section>

{/* Request a Park CTA */}
<section id="contact-form" className="py-32 px-6 relative overflow-hidden bg-[#003B36]">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-[#16697A]/40 blur-[120px] rounded-full pointer-events-none"></div>

  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="max-w-4xl mx-auto text-center relative z-10"
  >
    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
      {language === 'EN' ? "Bring Nature's Index To Your Park." : 'Lleva Nature\'s Index a tu Parque.'}
    </h2>
    <p className="text-xl text-[#99C2A2] mb-10 font-medium">{language === 'EN' ? "No commitment. We'll reach out with partnership details." : 'Sin compromiso. Nos pondremos en contacto con detalles de asociación.'}</p>

    {submitStatus === 'success' ? (
      <div className="bg-[#99C2A2]/20 text-[#99C2A2] border border-[#99C2A2]/30 px-6 py-4 rounded-2xl font-bold inline-block">
        {language === 'EN' ? "Request received! We'll be in touch soon." : '¡Solicitud recibida! Nos pondremos en contacto pronto.'}
      </div>
    ) : (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <input 
          type="text" 
          value={parkName}
          onChange={(e) => setParkName(e.target.value)}
          placeholder={language === 'EN' ? "Enter your park or region..." : 'Ingresa tu parque o región...'} 
          className="bg-[#16697A]/40 border border-[#99C2A2]/30 text-white px-6 py-4 rounded-2xl outline-none focus:border-[#F0803C] transition-colors w-full sm:w-1/3"
        />
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={language === 'EN' ? "Your email address..." : 'Tu correo electrónico...'} 
          className="bg-[#16697A]/40 border border-[#99C2A2]/30 text-white px-6 py-4 rounded-2xl outline-none focus:border-[#F0803C] transition-colors w-full sm:w-1/3"
        />
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-[#F0803C] text-white hover:bg-[#d66b2d] px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap w-full sm:w-auto shadow-[0_0_20px_rgba(240,128,60,0.4)] hover:shadow-[0_0_30px_rgba(240,128,60,0.6)] disabled:opacity-50"
        >
          {isSubmitting ? (language === 'EN' ? 'Sending...' : 'Enviando...') : (language === 'EN' ? 'Submit Request' : 'Enviar Solicitud')}
        </button>
      </div>
    )}
    {submitStatus === 'error' && <p className="text-[#F0803C] mt-4 font-bold">{language === 'EN' ? "Oops! Something went wrong. Try again." : '¡Uy! Algo salió mal. Intenta de nuevo.'}</p>}
  </motion.div>
</section>
    </div>
  );
}
