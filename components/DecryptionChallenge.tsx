import React, { useState, useEffect, useRef } from 'react';
import GlitchText from './GlitchText';
import { useTheme } from '../contexts/ThemeContext';

const ENCRYPTED_MESSAGE = "Vhh wkh vkdgroz, ehfrph wkh JOLWFK!";
const DECRYPTED_MESSAGE = "See the shadows, become the GLITCH!";

const DecryptionChallenge = ({ onSuccess, onFailure }: { onSuccess: () => void; onFailure: () => void; }) => {
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(90);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      onFailure();
    }
  }, [timeLeft, onFailure]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim().toLowerCase() === DECRYPTED_MESSAGE.toLowerCase()) {
        if (timerRef.current) clearInterval(timerRef.current);
        onSuccess();
    } else {
        setUserInput('');
    }
  };

  const themeClasses = {
    dystopia: { border: 'border-purple-500', hover: 'hover:bg-purple-500/20', text: 'text-purple-400', focus: 'focus:border-purple-400' },
    glitch: { border: 'border-green-500', hover: 'hover:bg-green-500/20', text: 'text-green-400', focus: 'focus:border-green-500' },
    chrome: { border: 'border-gray-400', hover: 'hover:bg-gray-400/20', text: 'text-gray-300', focus: 'focus:border-gray-300' },
  };
  const themeStyle = themeClasses[theme];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl p-6 md:p-8 bg-black/50 backdrop-blur-sm border border-current/20 space-y-6 text-center">
        <h1 className="text-3xl md:text-4xl"><GlitchText text="COGNITIVE TEST" /></h1>
        <p className="text-lg">// We've received your profile. Now, a simple test. Decrypt the transmission. //</p>
        
        <div className={`p-4 border-2 ${themeStyle.border} bg-black/50`}>
            <p className="text-xl font-bold tracking-widest">{ENCRYPTED_MESSAGE}</p>
        </div>

        <div>
            <label htmlFor="decryption-input" className="sr-only">Decryption Input</label>
            <input
                id="decryption-input"
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className={`w-full bg-transparent p-2 text-xl text-center border-b-2 ${themeStyle.border} ${themeStyle.focus} focus:outline-none transition-colors`}
                placeholder=">_"
                autoComplete="off"
                required
            />
        </div>

        <div className="text-5xl font-bold text-red-500">
            <GlitchText text={`${timeLeft.toString().padStart(2, '0')}`} />
        </div>
        
        <button type="submit" className={`w-full py-3 text-xl uppercase border-2 transition-all duration-300 ${themeStyle.border} ${themeStyle.hover}`}>
          Bypass ICE
        </button>
      </form>
    </div>
  );
};

export default DecryptionChallenge;