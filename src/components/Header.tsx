import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageToggle: () => void;
  loggedCount: number;
  isScrolled: boolean;
}

function getFormattedDate(language: Language) {
  return new Date().toLocaleDateString(language === 'EN' ? 'en-US' : 'es-ES', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function LanguageToggle({
  language,
  onToggle,
}: {
  language: Language;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center rounded-full bg-green-600 p-1 gap-0.5 select-none shrink-0"
      aria-label="Toggle language"
    >
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all leading-none ${
          language === 'EN' ? 'bg-white text-green-700' : 'text-white/80'
        }`}
      >
        EN
      </span>
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all leading-none ${
          language === 'ES' ? 'bg-white text-green-700' : 'text-white/80'
        }`}
      >
        ES
      </span>
    </button>
  );
}

function LoggedBadge({ count }: { count: number }) {
  return (
    <div className="flex flex-col items-center justify-center w-11 h-11 rounded-full border-2 border-stone-800 shrink-0">
      <span className="text-sm font-black leading-none text-stone-900">{count}</span>
      <span className="text-[8px] font-bold text-stone-500 leading-tight uppercase tracking-wider mt-0.5">
        LOGGED
      </span>
    </div>
  );
}

export function Header({
  language,
  onLanguageToggle,
  loggedCount,
  isScrolled,
}: HeaderProps) {
  return (
    <>
      {/* Compact sticky bar — slides in on scroll, cream background */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-stone-200 shadow-sm transition-all duration-300 ${
          isScrolled
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="relative flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <LanguageToggle language={language} onToggle={onLanguageToggle} />
{/* Date perfectly centered via absolute positioning */}
        <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-stone-600 whitespace-nowrap capitalize">
            {getFormattedDate(language)}
          </span>
         <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white shadow-md border-2 border-[#C86A27]/10">
  <span className="text-black font-black text-lg leading-none">
    {loggedCount}
  </span>
  <span className="text-black/60 text-[8px] uppercase font-bold tracking-wider leading-none mt-0.5">
    {language === 'EN' ? 'LOGGED' : 'REGISTR.'}
  </span>
</div>
        </div>
      </div>

      {/* Full expanded header — always in normal flow */}
      <div className="px-4 pt-6 pb-2 max-w-lg mx-auto">
{/* Top row */}
        <div className="relative flex items-center justify-between mb-5">
          <LanguageToggle language={language} onToggle={onLanguageToggle} />
          <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-stone-500 whitespace-nowrap capitalize">
            {getFormattedDate(language)}
          </span>
         <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white shadow-md border-2 border-[#C86A27]/10">
  <span className="text-black font-black text-lg leading-none">
    {loggedCount}
  </span>
  <span className="text-black/60 text-[8px] uppercase font-bold tracking-wider leading-none mt-0.5">
    {language === 'EN' ? 'LOGGED' : 'REGISTR.'}
  </span>
</div>
        </div>

        {/* Title */}
        <div className="text-center pb-2">
          <h1
            className="font-serif font-black text-stone-900 tracking-tight leading-none"
            style={{ fontSize: 'clamp(3.5rem, 14vw, 5rem)' }}
          >
            {language === 'EN' ? 'Wildlife Log' : 'Registro'}
          </h1>
        </div>
      </div>
    </>
  );
}
