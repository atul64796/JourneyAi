import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ExternalLink, Clock, MapPin, Sparkles, BookOpen, Calendar } from "lucide-react";
import api from "../../../services/api";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history");
      setHistory(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this memory from your history?")) return;
    try {
      await api.delete(`/history/${id}`);
      setHistory((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-6 bg-slate-950 text-slate-400">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" size={20} />
        </div>
        <p className="font-medium tracking-widest text-xs uppercase animate-pulse">Retrieving your archives...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0c10] to-[#0a0c10] px-6 py-16">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <BookOpen size={18} />
                <span className="text-xs font-bold uppercase tracking-[0.3em]">Vault</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Your Journey <span className="text-indigo-500">History.</span></h2>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total Stories</p>
                <p className="text-xl font-mono font-bold text-white">{history.length.toString().padStart(2, '0')}</p>
             </div>
             <div className="h-8 w-[1px] bg-white/10" />
             <Sparkles className="text-indigo-400" size={24} />
          </div>
        </header>

        {history.length === 0 ? (
          <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-white/10 backdrop-blur-sm">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="text-slate-600" size={32} />
            </div>
            <p className="text-slate-400 font-medium">Your archives are empty.</p>
            <button 
                onClick={() => navigate('/create')}
                className="mt-6 text-indigo-400 text-sm font-bold hover:underline"
            >
                Start your first adventure →
            </button>
          </div>
        ) : (
          <div className="relative space-y-12">
            {/* The Timeline Vertical Line */}
            <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-indigo-500/50 via-white/5 to-transparent hidden sm:block" />

            {history.map((item, index) => (
              <div
                key={item._id}
                onClick={() => item.storyId && navigate(`/stories/${item.storyId._id}`)}
                className="group relative pl-0 sm:pl-20 transition-all duration-500"
              >
                {/* Timeline Dot */}
                <div className="absolute left-[21px] md:left-[45px] top-8 w-3 h-3 rounded-full bg-slate-950 border-2 border-indigo-500 z-10 hidden sm:block shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:scale-150 transition-transform" />

                <div className="relative bg-white/5 hover:bg-white/[0.08] backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-white/10 group-hover:border-indigo-500/30 transition-all cursor-pointer shadow-2xl overflow-hidden">
                  
                  {/* Subtle Background Glow */}
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] group-hover:bg-indigo-600/10 transition-colors" />

                  <div className="relative flex flex-col md:flex-row gap-8 items-start">
                    
                    {/* Date/Avatar Card */}
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 shrink-0">
                      <div className="relative">
                        <img
                          src={item.userId?.avatar}
                          alt="avatar"
                          className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 rotate-3 group-hover:rotate-0"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-1.5 rounded-lg border-2 border-[#0a0c10]">
                            <Calendar size={12} className="text-white" />
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-indigo-400 uppercase tracking-tighter">
                          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold">
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors truncate pr-10">
                          {item.storyId?.destination || "The Unknown Realm"}
                        </h3>
                        <button
                          onClick={(e) => handleDelete(item._id, e)}
                          className="absolute top-6 right-6 p-3 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-3 mb-6">
                        <StatusBadge icon={<Sparkles size={12}/>} text={item.storyId?.mood} color="text-amber-400" />
                        <StatusBadge icon={<Clock size={12}/>} text={item.storyId?.duration} color="text-sky-400" />
                        <StatusBadge icon={<MapPin size={12}/>} text={item.storyId?.language} color="text-emerald-400" />
                      </div>

                      {item.storyId?.storyText && (
                        <div className="relative">
                            <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 pl-4 border-l border-white/10 italic">
                                "{item.storyId.storyText}"
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                Open Memory <ExternalLink size={10} />
                            </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ icon, text, color }) => (
  <div className={`flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 ${color}`}>
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-wider">{text}</span>
  </div>
);

export default History;