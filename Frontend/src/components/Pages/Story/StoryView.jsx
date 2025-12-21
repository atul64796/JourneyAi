import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  Globe,
  ArrowLeft,
  Smile,
  MessageSquare,
  X,
  Lock,
} from "lucide-react";
import api from "../../../services/api";
import StoryChatbot from "./StoryChatbot";

/* ===================== COMPONENT ===================== */

const StoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAI, setShowAI] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  /* ===================== FETCH STORY ===================== */

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await api.get(`/stories/${id}`);
        setStory(res.data.data);
      } catch (err) {
        if (err?.response?.status === 403) {
          setForbidden(true);
        } else {
          console.error("Failed to load story", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  /* ===================== LOADING ===================== */

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#050505]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-indigo-400 font-bold tracking-widest text-xs uppercase animate-pulse">
          Opening your Journal...
        </p>
      </div>
    );
  }

  /* ===================== PRIVATE STORY BLOCK ===================== */

  if (forbidden) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex flex-col items-center justify-center text-center px-6">
        <Lock size={48} className="text-indigo-500 mb-6" />
        <h2 className="text-2xl font-black text-white mb-2">
          This story is private
        </h2>
        <p className="text-slate-500 max-w-md mb-8">
          You don’t have permission to view this journey.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="text-center py-20 text-white">
        Story not found
      </div>
    );
  }

  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-300 relative">

      {/* TOP NAV */}
      <nav className="sticky top-6 z-40 bg-[#0a0c10]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center mt-10">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Return
            </span>
          </button>

          <p className="text-sm font-medium text-white">
            Journey to {story.destination}
          </p>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
        <div className="space-y-10">

          {/* HEADER */}
          <div className="flex items-center gap-4">
            <img
              src={
                story.userId?.avatar ||
                `https://ui-avatars.com/api/?name=${story.userId?.fullName || "User"}`
              }
              alt="avatar"
              className="w-16 h-16 rounded-2xl object-cover border border-white/10"
            />

            <div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                {story.destination}
              </h1>
              <div className="flex items-center gap-3 mt-1 text-indigo-400 text-sm">
                <Calendar size={14} />
                {new Date(story.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* INFO */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <InfoTile icon={<MapPin size={16} />} label="Destination" value={story.destination} />
            <InfoTile icon={<Clock size={16} />} label="Duration" value={story.duration} />
            <InfoTile icon={<Smile size={16} />} label="Mood" value={story.mood} />
            <InfoTile icon={<Globe size={16} />} label="Language" value={story.language} />
          </div>

          {/* STORY TEXT */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl leading-[2] whitespace-pre-line font-serif first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:float-left">
              {story.storyText}
            </p>
          </div>
        </div>
      </div>

      {/* ASK AI BUTTON */}
      {!showAI && (
        <button
          onClick={() => setShowAI(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-2xl transition active:scale-95"
        >
          <MessageSquare size={20} />
          Ask AI
        </button>
      )}

      {/* BACKDROP */}
      {showAI && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAI(false)}
        />
      )}

      {/* AI PANEL */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-500 ${
          showAI ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-[#0a0c10] border-t border-white/10 rounded-t-[2.5rem] shadow-2xl max-h-[85vh] overflow-hidden">

          {/* HEADER */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">AI Companion</h3>
            <button
              onClick={() => setShowAI(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* CHAT */}
          <div className="h-[70vh]">
            <StoryChatbot storyId={story._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===================== INFO TILE ===================== */

const InfoTile = ({ icon, label, value }) => (
  <div className="p-4 rounded-3xl border border-white/10 bg-white/[0.03]">
    <div className="flex items-center gap-2 mb-1 opacity-60">
      {icon}
      <span className="text-[9px] uppercase font-black tracking-widest">
        {label}
      </span>
    </div>
    <p className="text-white font-bold text-sm truncate">{value}</p>
  </div>
);

export default StoryView;
