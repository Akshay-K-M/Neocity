import { GoogleGenAI, Type } from "@google/genai";
import type { ApplicationData, AudioAnalysisResult, GeminiRoleResult, Role } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder.");
    process.env.API_KEY = "YOUR_API_KEY";
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });

export const analyzeAudio = async (audioFile: File): Promise<AudioAnalysisResult> => {
  const audioBase64 = await fileToBase64(audioFile);
  
  const audioPart = {
    inlineData: {
      mimeType: audioFile.type,
      data: audioBase64,
    },
  };

  const textPart = {
    text: `You are a gatekeeper for a cyberpunk gang. Analyze the content of the recruit's speech in the provided audio. Determine if their words are threatening, rude, or offensive. Polite, normal, or socially acceptable speech is an automatic failure.
    - If the content is threatening, rude, OR offensive, set 'passes_initiation' to true.
    - If the content is polite, normal, or socially acceptable, set 'passes_initiation' to false.
    - Provide a brief justification for your decision.
    Respond ONLY with a valid JSON object matching this schema: {"passes_initiation": <boolean>, "justification": "<string>"}.`,
  };
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: { parts: [audioPart, textPart] },
  });

  try {
    const jsonText = response.text.trim().replace(/```json|```/g, '');
    const result = JSON.parse(jsonText);
    if (typeof result.passes_initiation === 'boolean' && typeof result.justification === 'string') {
        return result;
    }
    throw new Error('Invalid JSON structure from Gemini for audio analysis.');
  } catch (e) {
    console.error("Failed to parse Gemini response for audio analysis:", response.text);
    throw new Error("Received malformed data from neural network.");
  }
};

export const assignGangRole = async (applicationData: ApplicationData, audioJustification: string, availableRoles: Role[]): Promise<GeminiRoleResult> => {
  const { handle, answers } = applicationData;
  const answersString = answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n');
  const rolesString = JSON.stringify(availableRoles, null, 2);

  const prompt = `You are the final arbiter for the 'Chrome Vipers', a cyberpunk gang in NeoCity. A new recruit, handle '${handle}', has applied.

  **Recruit's Profile:**
  - Voice Analysis Result: ${audioJustification}
  - Psych Profile (from questionnaire):
  ${answersString}

  **Available Gang Roles:**
  ${rolesString}

  **Your Task:**
  Based on the recruit's complete profile, you MUST assign them one of the roles from the "Available Gang Roles" list.
  1.  Analyze their answers and voice analysis to determine which role they fit best.
  2.  Provide a 2-sentence justification explaining why their personality and skills make them suitable for the chosen role.
  3.  Create a short, thematic first mission for them that fits their new role.
  
  Your response MUST be a valid JSON object.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          roleName: { type: Type.STRING, description: "The name of the assigned gang role. MUST be one of: " + availableRoles.map(r => `'${r.name}'`).join(', ') },
          justification: { type: Type.STRING, description: "Justification for the role assignment based on the profile." },
          mission: { type: Type.STRING, description: "The recruit's first mission." },
        },
        required: ['roleName', 'justification', 'mission'],
      },
    },
  });
  
  return JSON.parse(response.text);
};