import React, { useState, useEffect } from 'react';
import GlitchText from './GlitchText';
import { useTheme } from '../contexts/ThemeContext';

const useTypingEffect = (text: string, speed = 50, start = false) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (start) {
      setDisplayedText('');
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
        if (i >= text.length) {
          clearInterval(intervalId);
        }
      }, speed);
      return () => clearInterval(intervalId);
    }
  }, [text, speed, start]);

  return displayedText;
};

const members = [
    { name: "VEX", role: "Leader", desc: "The ghost in the machine who pulls the strings. Started the Vipers from nothing but scrap code and raw ambition.", img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop" },
    { name: "JAX", role: "Enforcer", desc: "Pure chrome and fury. Jax is the Vipers' iron fist, ensuring loyalty on the streets through intimidation and force.", img: "https://images.unsplash.com/photo-1618335829737-2228915674e0?q=80&w=800&auto=format&fit=crop" },
    { name: "NYX", role: "Netrunner", desc: "A whisper on the net who can crack any corporate fortress. Information is her weapon and currency.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop" },
];

const HomePage = ({ onStartApplication }: { onStartApplication: () => void }) => {
  const [startTyping, setStartTyping] = useState(false);
  const line1 = useTypingEffect(">>> In the neon shadows of NeoCity, corporations write the laws in blood and credits.", 50, startTyping);
  const line2 = useTypingEffect(">>> We are the glitch in their system. The ghost in their machine.", 50, line1.length > 0);
  const line3 = useTypingEffect(">>> We are the Chrome Vipers.", 50, line2.length > 0);
  const [showContent, setShowContent] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const timer1 = setTimeout(() => setStartTyping(true), 500);
    const timer2 = setTimeout(() => setShowContent(true), 4000);
    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
    };
  }, []);
  
  const buttonClasses = {
    dystopia: 'border-purple-500 hover:bg-purple-500/20 text-purple-400',
    glitch: 'border-green-500 hover:bg-green-500/20 text-green-400',
    chrome: 'border-gray-400 hover:bg-gray-400/20 text-gray-300'
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center">
      <div className={`w-full max-w-5xl p-6 bg-black/50 backdrop-blur-sm border border-current/20 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl mb-4"><GlitchText text="CHROME VIPERS" /></h1>
          <p className="text-lg md:text-xl text-current/80">
            {line1.length > 0 ? line1 : <>&nbsp;</>}<br/>
            {line2.length > 0 ? line2 : <>&nbsp;</>}<br/>
            <span className="font-bold">{line3.length > 0 ? line3 : <>&nbsp;</>}</span>
          </p>
        </div>

        <div className="my-8 md:my-12">
            <h2 className="text-2xl md:text-3xl text-center mb-6">// THE CREW //</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {members.map(member => (
                    <div key={member.name} className="border border-current/20 p-4 bg-black/30 text-center">
                        <img src={`${member.img}&theme=${theme}`} alt={member.name} className="w-full h-48 object-cover mb-4 grayscale contrast-125 brightness-90" />
                        <h3 className="text-2xl font-bold">{member.name}</h3>
                        <p className="text-current/70">{member.role}</p>
                        <p className="mt-2 text-sm">{member.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="text-center">
             <button
               onClick={onStartApplication}
               className={`px-8 py-3 text-2xl uppercase border-2 transition-all duration-300 ${buttonClasses[theme]}`}
             >
               <GlitchText text="[ Prove Your Worth ]" />
             </button>
           </div>
      </div>
    </div>
  );
};

export default HomePage;
