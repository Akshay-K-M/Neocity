import React from 'react';
import type { FinalResult } from '../types';
import GlitchText from './GlitchText';
import { useTheme } from '../contexts/ThemeContext';

interface ResultProps {
  result?: FinalResult;
  handle?: string;
  error?: string | null;
  onRestart: () => void;
}

const Result = ({ result, handle, error, onRestart }: ResultProps) => {
  const { theme } = useTheme();

  const themeClasses = {
    dystopia: { border: 'border-purple-500', hover: 'hover:bg-purple-500/20', text: 'text-purple-400' },
    glitch: { border: 'border-green-500', hover: 'hover:bg-green-500/20', text: 'text-green-400' },
    chrome: { border: 'border-gray-400', hover: 'hover:bg-gray-400/20', text: 'text-gray-300' },
  };
  const themeStyle = themeClasses[theme];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl p-6 md:p-8 bg-black/50 backdrop-blur-sm border border-current/20 space-y-6">
        {result && handle ? (
          <>
            <h1 className="text-3xl md:text-4xl text-center"><GlitchText text="ASSIGNMENT COMPLETE" /></h1>
            <p className="text-xl text-center">// Welcome to the Chrome Vipers, <span className="font-bold">{handle}</span>. //</p>
            
            <div className={`p-4 border-2 ${themeStyle.border} bg-current/5`}>
                <h2 className="text-2xl font-bold">// ROLE: {result.name} ({result.position})</h2>
                <p className="mt-2 text-lg italic">{result.description}</p>
                <p className="mt-4 text-lg"><span className="font-bold">// Justification:</span> {result.justification}</p>
            </div>

            <div className={`p-4 border-2 ${themeStyle.border} bg-current/5`}>
                <h2 className="text-2xl font-bold">// FIRST MISSION</h2>
                <p className="mt-2 text-lg">{result.mission}</p>
            </div>

            <p className="text-center">// Don't get flatlined. //</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl text-center text-red-500"><GlitchText text="CONNECTION TERMINATED" /></h1>
            <div className={`p-4 border-2 border-red-500/50 bg-red-500/10`}>
                <p className="text-lg text-red-400">{error || "// You ain't got the chrome for this, kid. Scram. //"}</p>
            </div>
          </>
        )}
         <button onClick={onRestart} className={`w-full py-3 text-xl uppercase border-2 transition-all duration-300 ${themeStyle.border} ${themeStyle.hover}`}>
          Return to Shadows
        </button>
      </div>
    </div>
  );
};

export default Result;
