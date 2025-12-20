import { useState, useEffect, useRef } from "react";
import { chatWithTravelBot } from "../services/chatbotService";
import { FaMicrophone } from "react-icons/fa";
import { IoSend } from "react-icons/io5";



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
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition works only in Chrome / Edge");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; // Hindi + English
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

    return () => recognition.stop();
  }, []);

  const startMic = () => {
    if (!isListening && recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  /* =======================
     🔊 BROWSER VOICE (FALLBACK)
  ======================= */
  const speakWithBrowser = (text) => {
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
     🔊 MAIN SPEAK FUNCTION
     (Backend → Browser fallback)
  ======================= */
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
      audioRef.current.onended = () => {
        setTimeout(() => startMic(), 300);
      };

      await audioRef.current.play();
    } catch (err) {
      console.warn("🔁 Backend TTS failed, switching to browser voice");
      speakWithBrowser(text);
    }
  };

  /* =======================
     💬 CHAT HANDLER
  ======================= */
  const handleSend = async (textOverride) => {
    const text = textOverride || message;
    if (!text.trim() || loading) return;

    setChatHistory((prev) => [
      ...prev,
      { role: "user", content: text },
    ]);
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
      speakWithBrowser("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  /* =======================
     ✨ UI
  ======================= */
  return (
    <div className="w-full  h-[680px] mx-auto rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-900 via-black to-purple-900 text-white flex flex-col  ">

      {/* Header */}
      <div className="px-6 py-4 bg-white/10 backdrop-blur flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">Journey AI</h2>
          <p className="text-xs opacity-70">
            {isListening ? "Listening..." : "Tap mic to speak"}
          </p>
        </div>
        <button onClick={() => setIsMuted(!isMuted)}>
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
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 rounded-br-none"
                  : "bg-white/10 rounded-bl-none"
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
      <div className="p-5 bg-black/30 backdrop-blur flex gap-3 items-center">
        <button
          onClick={startMic}
          className={`w-14 h-14 rounded-full text-2xl flex items-center justify-center ${
            isListening
              ? "bg-red-500 animate-pulse"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          <FaMicrophone />
        </button>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type or speak..."
          className="flex-1 bg-white/10 px-4 py-3 rounded-full outline-none text-sm"
        />

        <button
          onClick={() => handleSend()}
          className="px-4 py-4 rounded-full bg-indigo-600"
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default StoryChatbot;
