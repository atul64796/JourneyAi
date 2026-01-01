import { useState, useEffect, useRef } from "react";
import { chatWithTravelBot } from "../../../services/chatbotService";
import { FaMicrophone, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { MessageSquare } from "lucide-react";

const StoryChatbot = ({ storyId }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const recognitionRef = useRef(null);
  const audioRef = useRef(new Audio());
  const chatEndRef = useRef(null);

  /* =======================
      🎤 SPEECH RECOGNITION
  ======================= */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript.trim();
      recognition.stop();
      setIsListening(false);
      if (text) handleSend(text);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (!isListening && recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  /* =======================
      🔊 VOICE LOGIC
  ======================= */
  const speakWithBrowser = (text) => {
    if (!text || isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const speak = async (text) => {
    if (!text || isMuted) return;
    try {
      const res = await fetch("http://localhost:8000/j1/v1/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Backend TTS failed");
      const data = await res.json();
      audioRef.current.src = data.audio;
      await audioRef.current.play();
    } catch (err) {
      speakWithBrowser(text);
    }
  };

  /* =======================
      💬 CHAT HANDLER
  ======================= */
  const handleSend = async (textOverride) => {
    const text = textOverride || message;
    if (!text.trim() || loading) return;

    setChatHistory((prev) => [...prev, { role: "user", content: text }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await chatWithTravelBot({
        message: text,
        chatHistory,
        storyId,
      });

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);
      speak(res.reply);
    } catch (err) {
      const errorMsg = "I'm having trouble connecting to the neural link.";
      setChatHistory((prev) => [...prev, { role: "assistant", content: errorMsg }]);
      speakWithBrowser(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  return (
    // Changed h-full to h-[100dvh] for mobile browser chrome compatibility
    <div className="w-full h-full lg:h-screen bg-[#0a0c10] flex flex-col font-sans overflow-hidden">
      
      {/* HEADER - Adjusted padding for mobile */}
      <header className="px-4 py-3 md:px-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-slate-400 truncate">
            {isListening ? "Listening_Input" : loading ? "Processing_Data" : "Journey_Ai_Active"}
          </span>
        </div>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 transition-colors active:scale-95"
        >
          {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
        </button>
      </header>

      {/* CHAT AREA - Improved spacing and bubble width for small screens */}
      <main className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6 space-y-4 md:space-y-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent">
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <div className="w-12 h-12 md:w-16 md:h-16 border border-indigo-500/30 rounded-2xl md:rounded-3xl flex items-center justify-center mb-4">
              <MessageSquare size={24} className="text-indigo-500 md:size-32" />
            </div>
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-center">
              Initialize Conversation
            </p>
          </div>
        )}

        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] md:max-w-[80%] px-4 py-3 md:px-5 md:py-3.5 rounded-[1.5rem] md:rounded-[2rem] text-sm leading-relaxed ${
              msg.role === "user" 
                ? "bg-indigo-600 text-white font-medium rounded-tr-none shadow-lg" 
                : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/5 border border-white/10 px-4 py-3 md:px-5 md:py-3 rounded-[1.5rem] md:rounded-[2rem] rounded-tl-none">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* INPUT AREA - Responsive width and touch-friendly buttons */}
      <footer className="p-4 md:p-6 bg-[#0d0f14] border-t border-white/5 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-2 md:gap-3">
          <button
            onClick={startMic}
            className={`flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
              isListening 
                ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
                : "bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5"
            }`}
          >
            <FaMicrophone size={18} />
          </button>

          <div className="relative flex-1">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your query..."
              className="w-full bg-white/5 border border-white/10 text-white pl-4 pr-12 py-3 md:px-6 md:py-3.5 rounded-xl md:rounded-2xl outline-none focus:border-indigo-500/50 transition-all text-sm appearance-none"
            />
            <button
              onClick={() => handleSend()}
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all active:scale-90 ${
                message.trim() ? "bg-indigo-600 text-white opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <IoSend size={16} />
            </button>
          </div>
        </div>
      </footer >
    </div>
  );
};

export default StoryChatbot;