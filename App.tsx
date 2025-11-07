
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { AppState, ApplicationData, FinalResult, Role, Question, GeminiRoleResult, AudioAnalysisResult } from './types';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import ApplicationForm from './components/ApplicationForm';
import DecryptionChallenge from './components/DecryptionChallenge';
import AudioChallenge from './components/AudioChallenge';
import Analyzing from './components/Analyzing';
import Result from './components/Result';
import { analyzeAudio, assignGangRole } from './services/geminiService';

export default function App() {
  const [appState, setAppState] = useState<AppState>('home');
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [resultData, setResultData] = useState<FinalResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [roles, setRoles] = useState<Role[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesRes = await fetch('/roles.json');
        if (!rolesRes.ok) throw new Error('Failed to load roles data.');
        const rolesData = await rolesRes.json();
        setRoles(rolesData);

        const questionsRes = await fetch('/questions.json');
        if (!questionsRes.ok) throw new Error('Failed to load questions data.');
        const questionsData = await questionsRes.json();
        setQuestions(questionsData);
      } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load initial configuration';
        setError(`// CRITICAL BOOTSTRAP ERROR: ${errorMessage}. CANNOT INITIALIZE. //`);
        setAppState('failed');
      }
    };
    fetchData();
  }, []);

  const handleStartApplication = () => {
    setAppState('apply');
  };

  const handleApplicationSubmit = (data: ApplicationData) => {
    setApplicationData(data);
    setAppState('decryption');
  };

  const handleDecryptionSuccess = () => {
    setAppState('challenge');
  };

  const handleDecryptionFailure = () => {
    setError("// COGNITIVE ANALYSIS FAILED. You're too slow for this world. Connection terminated. //");
    setAppState('failed');
  };

  const handleChallengeSubmit = useCallback(async (audioFile: File) => {
    if (!applicationData || roles.length === 0) return;
    setAppState('analyzing');
    setError(null);

    try {
      const audioAnalysis: AudioAnalysisResult = await analyzeAudio(audioFile);
      
      if (audioAnalysis.passes_initiation) {
        const geminiResult: GeminiRoleResult = await assignGangRole(applicationData, audioAnalysis.justification, roles);
        const assignedRole = roles.find(r => r.name === geminiResult.roleName);

        if (!assignedRole) {
            throw new Error(`AI assigned an invalid role: ${geminiResult.roleName}`);
        }

        setResultData({
            ...assignedRole,
            mission: geminiResult.mission,
            justification: geminiResult.justification
        });
        setAppState('result');
      } else {
        console.error(`Analysis failed: Speech content was not threatening. Justification: ${audioAnalysis.justification}`);
        setError(`// REJECTION PROTOCOL INITIATED: ${audioAnalysis.justification}. You sound like one of the corporate drones we despise. Connection terminated. //`);
        setAppState('failed');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`// CRITICAL SYSTEM ERROR: ${errorMessage}. CONNECTION SEVERED. //`);
      setAppState('failed');
    }
  }, [applicationData, roles]);

  const restart = () => {
    setAppState('home');
    setApplicationData(null);
    setResultData(null);
    setError(null);
  }

  const renderContent = useMemo(() => {
    if (roles.length === 0 || questions.length === 0 && appState !== 'failed') {
        return <Analyzing />; // Show loading while fetching initial data
    }

    switch (appState) {
      case 'home':
        return <HomePage onStartApplication={handleStartApplication} />;
      case 'apply':
        return <ApplicationForm questions={questions} onSubmit={handleApplicationSubmit} />;
      case 'decryption':
        return <DecryptionChallenge onSuccess={handleDecryptionSuccess} onFailure={handleDecryptionFailure} />;
      case 'challenge':
        return <AudioChallenge onSubmit={handleChallengeSubmit} handle={applicationData?.handle || 'recruit'} />;
      case 'analyzing':
        return <Analyzing />;
      case 'result':
        return resultData && applicationData ? <Result result={resultData} handle={applicationData.handle} onRestart={restart} /> : null;
      case 'failed':
        return <Result error={error} onRestart={restart} />;
      default:
        return <HomePage onStartApplication={handleStartApplication} />;
    }
  }, [appState, handleChallengeSubmit, resultData, applicationData, error, questions, roles]);

  return (
    <ThemeProvider>
      <Layout>
        {renderContent}
      </Layout>
    </ThemeProvider>
  );
}