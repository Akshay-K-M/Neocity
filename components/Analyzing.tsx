
import React, { useState, useEffect } from 'react';
import GlitchText from './GlitchText';

const loadingMessages = [
  "// ANALYZING VOCAL SIGNATURE...",
  "// CROSS-REFERENCING NEURAL DATABASE...",
  "// DETECTING SUB-VOCAL TREMORS...",
  "// CALIBRATING MENACE ALGORITHMS...",
  "// DECRYPTING INTENT...",
  "// REROUTING THROUGH BLACK ICE...",
  "// COMPILING PSYCH PROFILE...",
  "// FINAL VERDICT IMMINENT...",
];

const Analyzing = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="w-full max-w-2xl p-8 bg-black/30 backdrop-blur-sm border border-current/20">
        <h1 className="text-3xl md:text-5xl mb-8"><GlitchText text="PROCESSING" /></h1>
        <div className="text-xl h-8">
            <p key={messageIndex} className="animate-pulse">{loadingMessages[messageIndex]}</p>
        </div>
        <div className="mt-8 w-full h-2 bg-current/20 overflow-hidden">
            <div className="h-full bg-current animate-[progressBar_1.5s_ease-in-out_infinite]"></div>
        </div>
        <style>{`
            @keyframes progressBar {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `}</style>
      </div>
    </div>
  );
};

export default Analyzing;
