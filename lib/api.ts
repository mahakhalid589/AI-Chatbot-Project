const API_URL = 'http://127.0.0.1:5000';

export interface LegalAIResponse {
  [x: string]: any;
  response: string;
  detected_language: string;
  sources?: any[];
  is_follow_up?: boolean;
  topic?: string;
  conversation_stats?: any;
}

// Generate or get session ID for conversation continuity
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('paklegal_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('paklegal_session_id', sessionId);
  }
  return sessionId;
};

// Main chat function - sends session_id for conversation memory
export const askLegalAI = async (
  message: string, 
  language: 'en' | 'ur' | 'roman_urdu' = 'en',
  sessionId?: string
): Promise<LegalAIResponse> => {
  try {
    const activeSessionId = sessionId || getSessionId();
    
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: message,
        language,
        session_id: activeSessionId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return {
      response: 'Sorry, I cannot connect to the legal database. Please make sure the backend server is running (python app.py) in the backend folder.',
      detected_language: language,
      sources: []
    };
  }
};

// Get list of all laws
export const getLawsList = async () => {
  try {
    const response = await fetch(`${API_URL}/laws`);
    return await response.json();
  } catch (error) {
    return { laws: [] };
  }
};

// Clear conversation (new session)
export const clearConversationAPI = async () => {
  const sessionId = getSessionId();
  try {
    await fetch(`${API_URL}/conversation/clear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId })
    });
  } catch (e) {
    console.error('Error clearing conversation:', e);
  }
  localStorage.removeItem('paklegal_session_id');
};

// Get conversation history
export const getConversationHistory = async () => {
  const sessionId = getSessionId();
  try {
    const response = await fetch(`${API_URL}/conversation/history?session_id=${sessionId}`);
    return await response.json();
  } catch (error) {
    return { error: 'Failed to get history' };
  }
};

// ============================================
// VOICE TRANSCRIPTION API
// ============================================

export interface VoiceTranscriptionResponse {
  success: boolean;
  transcript: string;
  detected_language: string;
  confidence: number;
  response: string;
  sources: any[];
  error?: string;
}

/**
 * Send audio blob to backend for speech-to-text and AI response
 * @param audioBlob - Recorded audio (webm format from MediaRecorder)
 * @param language - 'en' or 'ur' from frontend language button
 */
export async function transcribeVoiceAPI(
  audioBlob: Blob,
  language: 'en' | 'ur' = 'en'
): Promise<VoiceTranscriptionResponse> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  formData.append('language', language);

  const res = await fetch(`${API_URL}/voice`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.message || data.error || 'Voice transcription failed');
  }

  return data;
}