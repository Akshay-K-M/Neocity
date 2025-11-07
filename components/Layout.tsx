
import React, { ReactNode } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { Theme } from '../types';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const themes: { name: Theme; color: string }[] = [
    { name: 'dystopia', color: 'bg-purple-500' },
    { name: 'glitch', color: 'bg-green-500' },
    { name: 'chrome', color: 'bg-gray-400' },
  ];

  const baseButtonClass = "w-4 h-4 rounded-full border-2 transition-all";
  const themeStyles = {
    dystopia: { border: 'border-purple-500', hover: 'hover:border-purple-300', active: 'ring-purple-400' },
    glitch: { border: 'border-green-500', hover: 'hover:border-green-300', active: 'ring-green-400' },
    chrome: { border: 'border-gray-400', hover: 'hover:border-gray-200', active: 'ring-gray-300' },
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 bg-black/50 p-2 rounded">
      {themes.map(({ name, color }) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          className={`${baseButtonClass} ${themeStyles[theme].border} ${themeStyles[theme].hover} ${
            theme === name ? `${color} ring-2 ${themeStyles[theme].active}` : ''
          }`}
          aria-label={`Switch to ${name} theme`}
        />
      ))}
    </div>
  );
};

export default function Layout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  
  const themeClasses: Record<Theme, string> = {
    dystopia: 'bg-[#0d0221] text-[#a642a6] selection:bg-[#f0f] selection:text-[#0d0221]',
    glitch: 'bg-black text-[#00ff41] selection:bg-[#00ff41] selection:text-black',
    chrome: 'bg-[#1a1a1a] text-[#e0e0e0] selection:bg-white selection:text-black'
  };

  const backgroundStyles: Record<Theme, string> = {
    dystopia: 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]',
    glitch: 'bg-[url(https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmY4MXR1amI4dDZpNGIzb3NqM2VpMnpodjJ4a3I3ZzBkaHk3ZzZxeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tn9a2t13ubA1Rni/giphy.gif)] bg-cover bg-center opacity-20',
    chrome: 'bg-grid-gray-700/[0.2] bg-black [background-position:10px_10px]'
  };

  return (
    <div className={`relative min-h-screen font-mono transition-colors duration-500 ${themeClasses[theme]}`}>
      <div className={`absolute inset-0 z-0 ${backgroundStyles[theme]}`}></div>
      <div className="relative z-10">
        {children}
        <ThemeSwitcher />
      </div>
    </div>
  );
}
