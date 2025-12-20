import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, Globe, ArrowLeft, Smile, BookOpen, MessageSquare } from "lucide-react";
import api from "../services/api";
import StoryChatbot from "./StoryChatbot";

const StoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await api.get(`/stories/${id}`);
        setStory(res.data.data);
      } catch (err) {
        console.error("Failed to load story", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#050505]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-indigo-400 font-bold tracking-widest text-xs uppercase animate-pulse">Opening your Journal...</p>
      </div>
    );
  }

  if (!story) return <div className="text-center py-20 text-white">Story not found</div>;

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-300">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#0a0c10]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Return</span>
          </button>
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em]">AI Adventure</span>
             <div className="h-4 w-[1px] bg-white/10"></div>
             <p className="text-sm font-medium text-white">Journey to {story.destination}</p>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: STORY CONTENT (8 Columns) */}
          <main className="lg:col-span-7 space-y-10">
            {/* Header Badge */}
            <div className="flex items-center gap-4">
              <img
                src={story.userId.avatar}
                alt={story.userId.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 rotate-3 shadow-xl"
              />
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                  {story.destination}
                </h1>
                <div className="flex items-center gap-3 mt-1 text-indigo-400 text-sm font-medium">
                  <Calendar size={14} />
                  {new Date(story.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <InfoTile icon={<MapPin size={16}/>} label="Destination" value={story.destination} color="indigo" />
              <InfoTile icon={<Clock size={16}/>} label="Duration" value={story.duration} color="emerald" />
              <InfoTile icon={<Smile size={16}/>} label="Vibe" value={story.mood} color="amber" />
              <InfoTile icon={<Globe size={16}/>} label="Language" value={story.language} color="sky" />
            </div>

            {/* The actual Story */}
            <div className="relative group">
               <div className="absolute -left-6 top-0 bottom-0 w-1 bg-indigo-500/20 group-hover:bg-indigo-500/50 transition-colors hidden md:block" />
               <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-slate-300 leading-[2] text-xl font-serif whitespace-pre-line first-letter:text-6xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left">
                  {story.storyText}
                </p>
              </div>
            </div>
          </main>

          {/* RIGHT: CHATBOT SIDEBAR (5 Columns) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden backdrop-blur-3xl">
              <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-xl">
                  <MessageSquare className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Companion</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Ask about logistics & culture</p>
                </div>
              </div>
              
              <div className="h-[600px] overflow-hidden">
                <StoryChatbot storyId={story._id} />
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
};

// Sub-component for small data tiles
const InfoTile = ({ icon, label, value, color }) => {
  const colors = {
    indigo: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    amber: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    sky: "text-sky-400 border-sky-500/20 bg-sky-500/5",
  };
  
  return (
    <div className={`p-4 rounded-3xl border ${colors[color]} backdrop-blur-sm`}>
      <div className="flex items-center gap-2 mb-1 opacity-60">
        {icon}
        <span className="text-[9px] uppercase font-black tracking-widest">{label}</span>
      </div>
      <p className="text-white font-bold text-sm truncate">{value}</p>
    </div>
  );
};

export default StoryView;