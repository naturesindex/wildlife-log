import { ArrowLeft } from 'lucide-react';
import { Species, Language } from '../types';

interface SandboxProps {
  loggedSpecies: Species[];
  language: Language;
  guideName: string;
  onBack: () => void;
}

export function PassportSandbox({ loggedSpecies, language, guideName, onBack }: SandboxProps) {
  return (
    <div className="min-h-screen bg-[#0b170f] text-white p-6">
      {/* Dev Navigation */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Exit Sandbox
      </button>

      {/* Sandbox Canvas */}
      <div className="max-w-4xl mx-auto border-2 border-dashed border-[#C86A27]/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <h1 className="text-4xl font-black text-[#C86A27] mb-4">Premium Web Sandbox</h1>
        <p className="text-white/70 max-w-md">
          This is our safe playground. We have {loggedSpecies.length} species loaded up and ready to be visualized.
        </p>
      </div>
    </div>
  );
}
