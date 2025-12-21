import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicStories } from "../../../services/storyServices";
import StoryChatbot from "../Story/StoryChatbot";
import Footer from "../Footer";
import { 
  MapPin, Clock, Globe, ChevronRight, ChevronLeft, 
  MessageSquare, BookOpen, X, Sparkles, Bot, Camera 
} from "lucide-react";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  // State for the Global AI Panel
  const [activeStoryForAI, setActiveStoryForAI] = useState(null);
  const [showAIPanel, setShowAIPanel] = useState(false);

  useEffect(() => {
    loadStories();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const res = await getPublicStories(page, 6);
      setStories(res.data || []);
    } catch (error) {
      console.error("Failed to fetch stories", error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-300 font-sans selection:bg-indigo-500/30">
      
      {/* 1. CINEMATIC HEADER */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <Globe size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">Community Archives</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Journeys.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Real stories, captured by explorers and enhanced by intelligence.
          </p>
        </div>
      </div>

      {/* 2. MAIN FEED */}
      <div className="max-w-7xl mx-auto px-6 pb-32 ">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Retrieving Visuals...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/10 border-dashed">
             <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">No archives found</p>
          </div>
        ) : (
          <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => {
              const user = story.userId;
              return (
                <article key={story._id} className="group flex flex-col bg-white/[0.02] rounded-[3rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-700 overflow-hidden shadow-2xl">
                  
                  {/* IMAGE SECTION */}
                  <div className="relative h-80 overflow-hidden">
                    {story.imageUrl ? (
                      <img 
                        src={story.imageUrl} 
                        alt={story.destination} 
                        className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
                      />
                    ) : (
                      <div className="h-full w-full bg-[#0d0f14] flex items-center justify-center text-white/5">
                        <Camera size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/20 to-transparent opacity-90" />
                    <div className="absolute top-6 left-6">
                      <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em]">
                        {story.mood || "Adventure"}
                      </div>
                    </div>
                  </div>

                  {/* CONTENT AREA */}
                  <div className="p-10 flex flex-col flex-grow -mt-12 relative z-10 bg-transparent">
                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight group-hover:text-indigo-400 transition-colors">
                      {story.destination}
                    </h3>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                        <Clock size={12} /> {story.duration}
                      </div>
                      <div className="w-1 h-1 bg-white/10 rounded-full" />
                      <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        <MapPin size={12} /> {story.language}
                      </div>
                    </div>

                    {/* TRUNCATED TEXT WITH GRADIENT FADE */}
                    <div className="relative mb-8">
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-4 italic font-serif">
                        "{story.storyText}"
                      </p>
                      <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-[#0b0e14] to-transparent" />
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="mt-auto space-y-8">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/stories/${story._id}`}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-indigo-400 transition-colors group/btn"
                        >
                          Read Full Story 
                          <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>

                        <button
                          onClick={() => {
                            setActiveStoryForAI(story);
                            setShowAIPanel(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                        >
                          <Sparkles size={14} />
                          Discuss
                        </button>
                      </div>

                      {/* USER INFO */}
                      <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                          <img 
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName}&background=6366f1&color=fff`} 
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/5" 
                            alt="avatar" 
                          />
                          <div>
                            <p className="text-xs font-bold text-white tracking-tight">{user?.fullName || "Anonymous"}</p>
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Explorer</p>
                          </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* 3. PAGINATION */}
        {!loading && stories.length > 0 && (
          <div className="mt-24 flex justify-center items-center gap-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="group flex items-center gap-2 text-slate-500 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Prev</span>
            </button>

            <div className="flex items-center bg-white/5 px-6 py-3 rounded-2xl border border-white/10 font-mono text-indigo-400 font-black">
              {page.toString().padStart(2, '0')}
            </div>

            <button
              onClick={() => setPage(page + 1)}
              className="group flex items-center gap-2 text-slate-500 hover:text-white transition-all"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em]">Next</span>
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* 4. GLOBAL FLOATING AI PANEL */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-700 transform ${
          showAIPanel ? "translate-y-0 scale-100 opacity-100" : "translate-y-20 scale-90 opacity-0 pointer-events-none"
        }`}>
        <div className="w-[400px] md:w-[450px] bg-[#0a0c10] border border-white/10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden">
          
          {/* AI Header */}
          <div className="p-6 bg-indigo-600 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-200">Neural Guide</p>
                <p className="text-sm text-white font-black truncate w-48 tracking-tight">Discussing {activeStoryForAI?.destination}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAIPanel(false)}
              className="w-10 h-10 flex items-center justify-center hover:bg-black/20 rounded-2xl text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Container */}
          <div className="h-[500px]">
            {activeStoryForAI && <StoryChatbot storyId={activeStoryForAI._id} />}
          </div>
        </div>
      </div>

      {/* 5. RESUME FAB (Appears when panel is hidden) */}
      {!showAIPanel && activeStoryForAI && (
        <button
          onClick={() => setShowAIPanel(true)}
          className="fixed bottom-10 right-10 z-50 group flex items-center gap-4 p-2.5 pr-8 bg-[#0d0f14]/80 backdrop-blur-2xl border border-white/10 rounded-3xl hover:border-indigo-500 transition-all shadow-3xl animate-in fade-in slide-in-from-right-10"
        >
          <div className="w-14 h-14 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12">
            <MessageSquare size={22} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500">Continue Thread</p>
            <p className="text-sm font-black text-white tracking-tight">{activeStoryForAI.destination}</p>
          </div>
        </button>
      )}

      <Footer />
    </div>
  );
};

export default Stories;