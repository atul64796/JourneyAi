import { useEffect, useState } from "react";
import { getPublicStories } from "../services/storyServices";
import StoryChatbot from "../components/StoryChatbot";
import Footer from "./Footer";
import { MapPin, Clock, Sparkles, ChevronRight, ChevronLeft, Globe, MessageSquare, BookOpen } from "lucide-react";
import { FaBrain } from "react-icons/fa";
const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeChatStoryId, setActiveChatStoryId] = useState(null);

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
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6">
            Read <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Public stories.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Step into the shoes of fellow explorers. Real stories, powered by AI, shared by the world.
          </p>
        </div>
      </div>

      {/* 2. MAIN FEED */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Loading the world...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/10 border-dashed">
            <p className="text-slate-500">The archives are currently quiet. Start a journey!</p>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => {
              const user = story.userId;
              const isChatOpen = activeChatStoryId === story._id;

              return (
                <article
                  key={story._id}
                  className="group flex flex-col bg-white/[0.03] rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                  {/* Image/Cover */}
                  <div className="relative h-64 overflow-hidden">
                    {story.imageUrl ? (
                      <img
                        src={story.imageUrl}
                        alt={story.destination}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center">
                         <BookOpen size={40} className="text-indigo-500/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent" />
                    
                    {/* Floating Info */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                            {story.mood}
                        </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                            <Clock size={12} /> {story.duration}
                        </div>
                        <div className="w-1 h-1 bg-slate-700 rounded-full" />
                        <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                            <MapPin size={12} /> {story.language}
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">
                      {story.destination}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3 italic">
                      "{story.storyText}"
                    </p>

                    {/* Bottom Action Bar */}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName}`}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/5"
                          alt="avatar"
                        />
                        <div>
                           <p className="text-xs font-bold text-white leading-none">{user?.fullName || "Anonymous"}</p>
                           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Explorer</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveChatStoryId(isChatOpen ? null : story._id)}
                        className={`p-3 rounded-2xl transition-all ${
                          isChatOpen ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400"
                        }`}
                      >
                        <MessageSquare size={20} />
                      </button>
                    </div>

                    {/* Collapsible Chat */}
                    {isChatOpen && (
                      <div className="mt-6 pt-6 border-t border-white/5 animate-in slide-in-from-top-4 duration-500">
                         <div className="h-[400px] rounded-[1.5rem] overflow-hidden border border-white/5">
                            <StoryChatbot storyId={story._id} />
                         </div>
                      </div>
                    )}
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
              className="group flex items-center gap-2 text-slate-500 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Previous</span>
            </button>

            <div className="flex items-center bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-slate-500 mr-4">PAGE</span>
              <span className="text-lg font-mono font-black text-indigo-400">{page.toString().padStart(2, '0')}</span>
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

      <Footer />
    </div>
  );
};

export default Stories;