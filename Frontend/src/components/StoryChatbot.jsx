import { useState, useEffect, useRef } from "react";
import { chatWithTravelBot } from "../services/chatbotService";

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
     🎤 MIC SETUP
  ======================= */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

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
      handleSend(text);
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (!isListening) recognitionRef.current.start();
  };

  /* =======================
     🔊 SPEAK (Browser TTS – FREE)
  ======================= */
  const speak = (text) => {
    if (!text || isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onend = () => {
      setTimeout(() => startMic(), 300);
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  /* =======================
     💬 CHAT
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
    } catch {
      speak("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  /* =======================
     ✨ ATTRACTIVE UI
  ======================= */
  return (
    <div className="w-full max-w-md h-[680px] mx-auto rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-900 via-black to-purple-900 text-white flex flex-col">

      {/* Header */}
      <div className="px-6 py-4 backdrop-blur-md bg-white/10 flex justify-between items-center border-b border-white/10">
        <div>
          <h2 className="font-bold text-lg tracking-wide">Journey AI</h2>
          <p className="text-xs opacity-70">
            {isListening ? "Listening..." : "Tap mic to speak"}
          </p>
        </div>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-xl hover:scale-110 transition"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600 rounded-br-none"
                  : "bg-white/10 backdrop-blur rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-xs opacity-50 italic">
            Journey AI is thinking...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Controls */}
      <div className="p-5 border-t border-white/10 bg-black/30 backdrop-blur-lg flex items-center gap-3">
        <button
          onClick={startMic}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
            isListening
              ? "bg-red-500 animate-pulse shadow-lg shadow-red-500/40"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          🎤
        </button>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type or speak..."
          className="flex-1 bg-white/10 backdrop-blur px-4 py-3 rounded-full text-sm outline-none placeholder:text-white/50"
        />

        <button
          onClick={() => handleSend()}
          className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default StoryChatbot;
