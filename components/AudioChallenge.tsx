
import React, { useState, useRef } from 'react';
import GlitchText from './GlitchText';
import { useTheme } from '../contexts/ThemeContext';

const AudioChallenge = ({ onSubmit, handle }: { onSubmit: (file: File) => void; handle: string }) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { theme } = useTheme();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], `threat_${handle}.webm`, { type: 'audio/webm' });
        setAudioFile(file);
        setAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied. Please allow microphone access to record.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (audioFile) {
      onSubmit(audioFile);
    }
  };

  const themeClasses = {
    dystopia: { border: 'border-purple-500', hover: 'hover:bg-purple-500/20', text: 'text-purple-400', ring: 'ring-purple-500' },
    glitch: { border: 'border-green-500', hover: 'hover:bg-green-500/20', text: 'text-green-400', ring: 'ring-green-500' },
    chrome: { border: 'border-gray-400', hover: 'hover:bg-gray-400/20', text: 'text-gray-300', ring: 'ring-gray-400' },
  };
  
  const themeStyle = themeClasses[theme];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl p-6 md:p-8 bg-black/50 backdrop-blur-sm border border-current/20 space-y-6 text-center">
        <h1 className="text-3xl md:text-4xl"><GlitchText text="THE INITIATION" /></h1>
        <p className="text-lg">// {handle}, it's time to prove your worth. We need to know you have steel in your voice. //</p>
        <p className="text-lg font-bold">// Deliver a convincing threat. Make us believe you belong in the shadows. //</p>
        
        <div className="space-y-4">
          {!recording ? (
            <button type="button" onClick={startRecording} className={`px-6 py-2 border-2 ${themeStyle.border} ${themeStyle.hover} ${themeStyle.text} transition-all`}>
              Record Threat
            </button>
          ) : (
            <button type="button" onClick={stopRecording} className={`px-6 py-2 border-2 bg-red-500/50 border-red-500 text-white animate-pulse ring-2 ${themeStyle.ring}`}>
              Stop Recording
            </button>
          )}
          <p>OR</p>
          <label className={`cursor-pointer px-6 py-2 border-2 ${themeStyle.border} ${themeStyle.hover} ${themeStyle.text} transition-all block`}>
            Upload Audio File
            <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {audioUrl && (
          <div className="py-4">
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}
        
        <button type="submit" disabled={!audioFile} className={`w-full py-3 text-xl uppercase border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${themeStyle.border} hover:enabled:bg-current/10`}>
          Send for Analysis
        </button>
      </form>
    </div>
  );
};

export default AudioChallenge;