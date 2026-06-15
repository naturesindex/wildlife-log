import { ArrowLeft, Copy, Download, CheckCircle } from 'lucide-react';
import { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'passport' | 'story'>('passport');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        {/* Tab switcher */}
        <div className="flex rounded-2xl bg-white/5 border border-white/10 p-1 mb-6">
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

        {activeTab === 'passport' ? (
          <WildlifePassport
            loggedSpecies={loggedSpecies}
            language={language}
            guideName={guideName}
          />
        ) : (
          <SocialStory
            loggedSpecies={loggedSpecies}
            language={language}
            guideName={guideName}
            totalLogged={loggedSpecies.length}
          />
        )}

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
            className="flex-1 flex items-center justify-center gap-2 text-white font-semibold text-sm py-3.5 rounded-2xl transition-all active:scale-95"
            style={{ backgroundColor: '#C86A27' }}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
