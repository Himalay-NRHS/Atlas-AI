// 'use client';

// import { useState, useEffect } from 'react';

// declare global {
//   interface Window {
//     SpeechRecognition: any;
//     webkitSpeechRecognition: typeof window.SpeechRecognition;
//   }
// }

// export default function Home() {
//   const [text, setText] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const [recognition, setRecognition] = useState<any>(null);

//   // Initialize Speech Recognition
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (SpeechRecognition) {
//         const recog = new SpeechRecognition();
//         recog.continuous = false;
//         recog.lang = 'en-US';
//         recog.interimResults = false;

//         recog.onresult = (event: any) => {
//           setText(event.results[0][0].transcript);
//         };

//         recog.onend = () => {
//           setIsListening(false);
//         };

//         setRecognition(recog);
//       }
//     }
//   }, []);

//   const handleStartListening = () => {
//     if (recognition) {
//       setIsListening(true);
//       recognition.start();
//     }
//   };

//   const handleSpeak = () => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'en-US';
//     synth.speak(utterance);
//   };

//   return (
//     <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
//       <h1 className="text-3xl font-bold mb-6">🎙️ Speech-to-Text & Text-to-Speech</h1>

//       <textarea
//         className="w-full max-w-2xl p-4 border rounded shadow mb-4"
//         rows={6}
//         placeholder="Speak or type something..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />

//       <div className="flex gap-4">
//         <button
//           onClick={handleStartListening}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           🎤 Start Listening
//         </button>
//         <button
//           onClick={handleSpeak}
//           className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//         >
//           🔊 Speak Text
//         </button>
//       </div>

//       {isListening && <p className="mt-4 text-blue-600">🎧 Listening...</p>}
//     </main>
//   );
// }


// app/Voicechat/page.tsx


// 'use client';

// import { useState, useEffect, useRef } from 'react';

// declare global {
//   interface Window {
//     SpeechRecognition: any;
//     webkitSpeechRecognition: typeof window.SpeechRecognition;
//   }
// }

// interface Message {
//   role: 'user' | 'assistant';
//   content: string;
// }

// export default function Home() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [recognition, setRecognition] = useState<any>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Initialize Speech Recognition
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (SpeechRecognition) {
//         const recog = new SpeechRecognition();
//         recog.continuous = false;
//         recog.lang = 'en-US';
//         recog.interimResults = false;

//         recog.onresult = (event: any) => {
//           const transcript = event.results[0][0].transcript;
//           setInput(transcript);
//           // Auto-submit when speech is recognized
//           handleSubmit(transcript);
//         };

//         recog.onend = () => {
//           setIsListening(false);
//         };

//         setRecognition(recog);
//       }
//     }
//   }, []);

//   // Auto-scroll to bottom of messages
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleStartListening = () => {
//     if (recognition) {
//       setIsListening(true);
//       recognition.start();
//     }
//   };

//   const speakText = (text: string) => {
//     if ('speechSynthesis' in window) {
//       // Cancel any ongoing speech
//       window.speechSynthesis.cancel();
      
//       setIsSpeaking(true);
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.lang = 'en-US';
      
//       utterance.onend = () => {
//         setIsSpeaking(false);
//       };
      
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const handleSubmit = async (text?: string) => {
//     const messageText = text || input;
//     if (!messageText.trim() || isProcessing) return;
    
//     // Add user message to chat
//     const userMessage: Message = { role: 'user', content: messageText };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsProcessing(true);

//     try {
//       // Send message to API
//       const response = await fetch('/api/chat/route', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           message: messageText,
//           email: 'user@example.com', // Replace with actual user email or auth
//         }),
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to get response');
//       }

//       // Extract assistant response
//       const assistantMessage: Message = {
//         role: 'assistant',
//         content: data.response || "Sorry, I couldn't process that request."
//       };
      
//       setMessages(prev => [...prev, assistantMessage]);
      
//       // Speak the assistant's response
//       speakText(assistantMessage.content);
      
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setMessages(prev => [...prev, {
//         role: 'assistant',
//         content: 'Sorry, I encountered an error. Please try again.'
//       }]);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit();
//     }
//   };

//   return (
//     <main className="flex flex-col h-screen bg-gray-100">
//       <header className="bg-blue-600 text-white p-4">
//         <h1 className="text-2xl font-bold">AI Voice Assistant</h1>
//         <p className="text-sm">Talk to the AI and hear responses</p>
//       </header>

//       {/* Chat messages area */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.length === 0 && (
//           <div className="text-center text-gray-500 mt-10">
//             <p>Hello! How can I help you today?</p>
//             <p className="text-sm mt-2">Click the microphone button to speak, or type your question below.</p>
//           </div>
//         )}
        
//         {messages.map((msg, index) => (
//           <div 
//             key={index} 
//             className={`p-3 rounded-lg max-w-[80%] ${
//               msg.role === 'user' 
//                 ? 'bg-blue-100 ml-auto' 
//                 : 'bg-white mr-auto shadow'
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input area */}
//       <div className="p-4 bg-white border-t">
//         <div className="flex items-center gap-2">
//           <button
//             onClick={handleStartListening}
//             disabled={isListening}
//             className={`p-3 rounded-full ${
//               isListening 
//                 ? 'bg-red-500 text-white' 
//                 : 'bg-blue-600 text-white hover:bg-blue-700'
//             }`}
//             title="Start voice input"
//           >
//             🎤
//           </button>
          
//           <textarea
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyPress}
//             placeholder="Type your message or click the microphone..."
//             className="flex-1 p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//             rows={1}
//           />
          
//           <button
//             onClick={() => handleSubmit()}
//             disabled={isProcessing || !input.trim()}
//             className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
//           >
//             {isProcessing ? '...' : '➤'}
//           </button>
//         </div>
        
//         <div className="flex justify-between mt-2 text-sm text-gray-500">
//           {isListening && <span className="text-red-500">Listening...</span>}
//           {isSpeaking && <span className="text-green-500">Speaking...</span>}
//           {!isListening && !isSpeaking && <span>&nbsp;</span>}
//           <span>Press Enter to send</span>
//         </div>
//       </div>
//     </main>
//   );
// }

'use client';

import { useState, useEffect, useRef } from 'react';

// ----------- Global Interface Declarations ----------- //
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: typeof window.SpeechRecognition;
  }
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ----------- Main Component ----------- //
export default function Home() {
  // ------------- State Hooks ------------- //
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ----------- useEffect: Initialize Speech Recognition ----------- //
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.lang = 'en-US';
        recog.interimResults = false;

        recog.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          handleSubmit(transcript); // Auto submit on speech result
        };

        recog.onend = () => setIsListening(false);
        setRecognition(recog);
      }
    }
  }, []);

  // ----------- useEffect: Auto Scroll to Bottom ----------- //
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ----------- Utility: Scroll Chat to Bottom ----------- //
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ----------- Voice: Start Listening ----------- //
  const handleStartListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  // ----------- Voice: Speak Text (Text-to-Speech) ----------- //
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel ongoing speech
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';

      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // ----------- Submit Handler (Text / Speech) ----------- //
  const handleSubmit = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isProcessing) return;

    setError(null); // Clear any previous errors

    // Show user message
    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/chat2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, email: 'user@example.com' }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to get response');

      const assistantResponseText = typeof data.response === 'string'
        ? data.response
        : "Sorry, I couldn't process that request.";

      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantResponseText
      };

      setMessages(prev => [...prev, assistantMessage]);
      speakText(assistantResponseText); // Speak the response

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // ----------- Enter Key Submit ----------- //
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ----------- Render UI ----------- //
  return (
    <main className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">AI Voice Assistant</h1>
        <p className="text-sm">Talk to the AI and hear responses</p>
      </header>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button className="absolute top-0 bottom-0 right-0 px-4" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Chat Message Display */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <p>Hello! How can I help you today?</p>
            <p className="text-sm mt-2">Click the microphone button to speak, or type your question below.</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === 'user'
                ? 'bg-blue-100 ml-auto'
                : 'bg-white mr-auto shadow'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <button
            onClick={handleStartListening}
            disabled={isListening}
            className={`p-3 rounded-full ${
              isListening
                ? 'bg-red-500 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            title="Start voice input"
          >
            🎤
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message or click the microphone..."
            className="flex-1 p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
          />

          <button
            onClick={() => handleSubmit()}
            disabled={isProcessing || !input.trim()}
            className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            {isProcessing ? '...' : '➤'}
          </button>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          {isListening && <span className="text-red-500">Listening...</span>}
          {isSpeaking && <span className="text-green-500">Speaking...</span>}
          {!isListening && !isSpeaking && <span>&nbsp;</span>}
          <span>Press Enter to send</span>
        </div>
      </div>
    </main>
  );
}
