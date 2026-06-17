import { ArrowLeft, Copy, Download, CheckCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Species, Language } from '../types';
import { WildlifePassport } from './WildlifePassport';
import { SocialStory } from './SocialStory';

interface ExportViewProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  onBack: () => void;
}


export function ExportView({ loggedSpecies, language, guideName, onBack }: ExportViewProps) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'passport' | 'story'>('passport');
  const [exportLang, setExportLang] = useState<Language>('EN'); 

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!exportRef.current) return;
    
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 3, 
        useCORS: true, 
        allowTaint: true,
        backgroundColor: '#162b1d', 
        // Force dimensions to prevent viewport scaling issues
        windowWidth: exportRef.current.scrollWidth,
        windowHeight: exportRef.current.scrollHeight,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = activeTab === 'passport' ? 'wildlife-passport.png' : 'social-story.png';
      link.click();

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };
  
  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom, #162b1d, #0b170f)' }}
    >
      {/* Top nav */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-[#162b1d]/80 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Guide
          </button>
          <span className="text-white/40 text-sm">
            {loggedSpecies.length} species logged
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5 pb-12">
        
        {/* Asset Type Switcher */}
        <div className="flex rounded-2xl bg-white/5 border border-white/10 p-1 mb-3">
          <button
            onClick={() => setActiveTab('passport')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'passport' ? 'bg-white/15 text-white' : 'text-white/40'
            }`}
          >
            Wildlife Passport
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'story' ? 'bg-white/15 text-white' : 'text-white/40'
            }`}
          >
            Social Story
          </button>
        </div>

        {/* Language Version Switcher */}
        <div className="flex rounded-2xl bg-white/5 border border-white/10 p-1 mb-6">
          <button
            onClick={() => setExportLang('EN')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              exportLang === 'EN' ? 'bg-[#4A7A5A] text-white' : 'text-white/40'
            }`}
          >
            English Version
          </button>
          <button
            onClick={() => setExportLang('ES')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              exportLang === 'ES' ? 'bg-[#4A7A5A] text-white' : 'text-white/40'
            }`}
          >
            Versión en Español
          </button>
        </div>

        {/* The Camera Target Wrapper */}
      <div ref={exportRef} className="rounded-3xl overflow-hidden bg-[#162b1d]">
        {/* Dynamic Render based on selections */}
        {activeTab === 'passport' ? (
          <WildlifePassport
            loggedSpecies={loggedSpecies}
            language={exportLang} 
            guideName={guideName}
          />
        ) : (
          <SocialStory
            loggedSpecies={loggedSpecies}
            language={exportLang} 
            guideName={guideName}
            totalLogged={loggedSpecies.length}
          />
        )}
      </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/15 text-white/80 font-semibold text-sm py-3.5 rounded-2xl transition-all hover:bg-white/15 active:scale-95"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 text-white font-semibold text-sm py-3.5 rounded-2xl transition-all active:scale-95"
            style={{ backgroundColor: downloaded ? '#4ade80' : '#C86A27' }}
          >
            {downloaded ? (
              <>
                <CheckCircle className="w-4 h-4 text-white" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
