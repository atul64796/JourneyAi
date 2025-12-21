import { useState, useEffect, useRef } from "react";
import { chatWithTravelBot } from "../services/chatbotService";
import { FaMicrophone, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { MessageSquare } from "lucide-react"; // Fixed the missing import

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

    if (!SpeechRecognition) {
      console.warn("Speech recognition works only in Chrome / Edge");
      return;
    }

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
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 1.0;
    speechSynthesis.speak(utterance);
  };

  const speak = async (text) => {
    if (!text || isMuted) return;

    try {
      // Trying your backend TTS first
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
      console.warn("🔁 Backend TTS unreachable, using browser voice.");
      speakWithBrowser(text);
    }
  };

  /* =======================
      💬 CHAT HANDLER
  ======================= */
  const handleSend = async (textOverride) => {
    const text = textOverride || message;
    if (!text.trim() || loading) return;

    // 1. Add User Message
    setChatHistory((prev) => [...prev, { role: "user", content: text }]);
    setMessage("");
    setLoading(true);

    try {
      // 2. Get AI Response
      const res = await chatWithTravelBot({
        message: text,
        chatHistory,
        storyId,
      });

      // 3. Add AI Message
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);

      // 4. TRIGGER VOICE
      speak(res.reply);
      
    } catch (err) {
      console.error(err);
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
    <div className="w-full h-full bg-[#0a0c10] flex flex-col font-sans">
      
      {/* HEADER */}
      <div className="px-6 py-3 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {isListening ? "Listening_Input" : loading ? "Processing_Data" : "Journey_Ai_Active"}
          </span>
        </div>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors"
        >
          {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
        </button>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent">
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <div className="w-16 h-16 border border-indigo-500/30 rounded-3xl flex items-center justify-center mb-4">
              <MessageSquare size={32} className="text-indigo-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Conversation</p>
          </div>
        )}

        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] px-5 py-3.5 rounded-[2rem] text-sm leading-relaxed ${
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
            <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-[2rem] rounded-tl-none">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-6 bg-[#0d0f14] border-t border-white/5">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={startMic}
            className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
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
              className="w-full bg-white/5 border border-white/10 text-white px-6 py-3.5 rounded-2xl outline-none focus:border-indigo-500/50 transition-all text-sm"
            />
            <button
              onClick={() => handleSend()}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${
                message.trim() ? "bg-indigo-600 text-white opacity-100" : "opacity-0"
              }`}
            >
              <IoSend size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryChatbot;