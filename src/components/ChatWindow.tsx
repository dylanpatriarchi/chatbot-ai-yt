import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, X, Minimize2, Maximize2 } from 'lucide-react';
import './ChatWindow.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isAudio?: boolean;
}

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Ciao! Come posso aiutarti oggi?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseApiResponse = (responseText: string): string => {
    console.log('Risposta API ricevuta:', responseText);
    
    try {
      const jsonResponse = JSON.parse(responseText);
      console.log('JSON parsato:', jsonResponse);
      
      // Gestisce formato semplice: { "response": "..." }
      if (jsonResponse.response) {
        return jsonResponse.response;
      }
      
      // Gestisce formato array: [{ "message": { "content": "..." } }]
      if (Array.isArray(jsonResponse) && jsonResponse.length > 0) {
        const firstItem = jsonResponse[0];
        if (firstItem.message && firstItem.message.content) {
          return firstItem.message.content;
        }
      }
      
      // Gestisce formato oggetto: { "message": { "content": "..." } }
      if (jsonResponse.message && jsonResponse.message.content) {
        return jsonResponse.message.content;
      } 
      
      // Gestisce formato semplice: { "content": "..." }
      if (jsonResponse.content) {
        return jsonResponse.content;
      } 
      
      // Se è una stringa diretta
      if (typeof jsonResponse === 'string') {
        return jsonResponse;
      } 
      
      // Fallback: usa il testo originale
      return responseText;
    } catch (e) {
      console.log('Errore parsing JSON:', e);
      return responseText || 'Risposta ricevuta!';
    }
  };

  const sendTextMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('prompt', inputText);

      const response = await fetch('https://TUO-N8N-URL/webhook-test/audio-input', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const responseText = await response.text();
        const messageContent = parseApiResponse(responseText);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: messageContent,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Errore nella risposta del server');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Scusa, si è verificato un errore. Riprova più tardi.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/m4a' });
        await sendAudioMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Errore nell\'accesso al microfono:', error);
      alert('Errore nell\'accesso al microfono. Controlla i permessi.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioMessage = async (audioBlob: Blob) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: '🎵 Messaggio vocale inviato',
      isUser: true,
      timestamp: new Date(),
      isAudio: true
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'input.m4a');

      const response = await fetch('https://TUO-N8N-URL/webhook-test/audio-input', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const responseText = await response.text();
        const messageContent = parseApiResponse(responseText);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: messageContent,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Errore nella risposta del server');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Scusa, si è verificato un errore con il messaggio vocale. Riprova più tardi.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="chat-window minimized">
        <div className="chat-header">
          <div className="window-controls">
            <button className="control-btn close" onClick={onClose}>
              <X size={10} />
            </button>
            <button className="control-btn minimize" onClick={() => setIsMinimized(false)}>
              <Maximize2 size={10} />
            </button>
          </div>
          <div className="chat-title">Chat AI</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="window-controls">
          <button className="control-btn close" onClick={onClose}>
            <X size={10} />
          </button>
          <button className="control-btn minimize" onClick={() => setIsMinimized(true)}>
            <Minimize2 size={10} />
          </button>
        </div>
        <div className="chat-title">Chat AI</div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.isUser ? 'user' : 'bot'}`}
          >
            <div className="message-content">
              {message.text}
              {message.isAudio && <span className="audio-indicator">🎵</span>}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString('it-IT', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot">
            <div className="message-content loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Scrivi un messaggio..."
            className="message-input"
            rows={1}
            disabled={isLoading}
          />
          <div className="input-actions">
            <button
              className={`voice-btn ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              className="send-btn"
              onClick={sendTextMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow; 