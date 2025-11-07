import React, { useState } from 'react';
import type { ApplicationData, Question } from '../types';
import GlitchText from './GlitchText';
import { useTheme } from '../contexts/ThemeContext';

const ApplicationForm = ({ questions, onSubmit }: { questions: Question[], onSubmit: (data: ApplicationData) => void }) => {
  const [handle, setHandle] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { theme } = useTheme();
  
  const isComplete = handle.trim() !== '' && Object.values(answers).every(a => a.trim() !== '') && Object.keys(answers).length === questions.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;
    const submittedAnswers = questions.map(q => ({
        question: q.text,
        answer: answers[q.id]
    }));
    onSubmit({ handle, answers: submittedAnswers });
  };
  
  const inputClasses = "w-full bg-transparent border-b-2 focus:outline-none transition-colors duration-300";
  const themeClasses = {
    dystopia: { border: 'border-purple-700 focus:border-purple-400', bg: 'bg-purple-500' },
    glitch: { border: 'border-green-800 focus:border-green-500', bg: 'bg-green-500' },
    chrome: { border: 'border-gray-600 focus:border-gray-300', bg: 'bg-gray-400' }
  };
  const themeStyle = themeClasses[theme];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl p-6 md:p-8 bg-black/50 backdrop-blur-sm border border-current/20 space-y-8">
        <h1 className="text-3xl md:text-4xl text-center"><GlitchText text="RECRUITMENT PROTOCOL" /></h1>
        
        <div>
          <label htmlFor="handle" className="text-xl block mb-2">// ENTER YOUR HANDLE</label>
          <input
            id="handle"
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className={`${inputClasses} ${themeStyle.border} p-2 text-2xl`}
            required
            autoComplete="off"
          />
        </div>

        {questions.map((q, index) => (
          <div key={q.id}>
            <p className="mb-3 text-lg">{`// 0${index + 1} ${q.text}`}</p>
            {q.type === 'mcq' && q.options && (
              <div className="flex flex-col space-y-2">
                {q.options.map(opt => (
                  <label key={opt} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      className="hidden"
                    />
                    <span className={`w-4 h-4 border-2 ${themeStyle.border} flex items-center justify-center`}>
                      {answers[q.id] === opt && <span className={`w-2 h-2 ${themeStyle.bg}`} />}
                    </span>
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {q.type === 'paragraph' && (
                <textarea
                    name={q.id}
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    className={`w-full h-24 bg-transparent border-2 ${themeStyle.border} p-2 focus:outline-none resize-none`}
                    rows={4}
                />
            )}
          </div>
        ))}

        <button type="submit" disabled={!isComplete} className={`w-full py-3 text-xl uppercase border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${themeStyle.border} hover:enabled:bg-current/10`}>
          Submit Profile
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
