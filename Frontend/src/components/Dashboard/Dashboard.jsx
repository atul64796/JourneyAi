import React, { useState, useEffect } from "react";
import { createStory, regenerateStory } from "../../services/storyServices";
import { Sparkles, MapPin, Globe, Clock, Send, RefreshCw, Eye, BookOpen } from "lucide-react";

const STORY_STORAGE_KEY = "aiStoryData";

/* -------------------- StoryResult -------------------- */
function StoryResult({ storyData, onRegenerate, loading }) {
  if (!storyData?.storyText) return null;

  const { destination, storyText, images = [], imageUrl } = storyData;
  const allImages = images.length ? images : imageUrl ? [imageUrl] : [];

  return (
    <section className="bg-[#05070a] py-20 px-6 animate-in fade-in duration-1000">
      <div className="max-w-5xl mx-auto">
        
        {/* REPLACED SLIDER WITH STATIC GRID (No more horizontal scroll) */}
        {allImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {allImages.slice(0, 3).map((url, i) => (
              <div key={i} className="relative h-64 overflow-hidden rounded-3xl border border-white/10 group">
                <img
                  src={url}
                  alt={`journey-${i}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            ))}
          </div>
        )}

        {/* STORY TEXT CARD - Now Full Width since Feedback is removed */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col items-center text-center mb-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <BookOpen size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                 Expedition to {destination}
              </h2>
              <div className="h-1 w-20 bg-indigo-500/30 rounded-full mt-4" />
          </div>
          
          <p className="whitespace-pre-line text-slate-300 leading-[2] text-xl font-serif italic text-center max-w-3xl mx-auto">
            {storyText}
          </p>

          <div className="flex justify-center mt-16 pt-10 border-t border-white/5">
            <button
              onClick={onRegenerate}
              disabled={loading}
              className="group flex items-center gap-3 px-10 py-4 rounded-2xl text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
              <span className="font-black uppercase tracking-[0.2em] text-xs">
                  {loading ? "Re-writing..." : "Regenerate Tale"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Dashboard -------------------- */
export default function Dashboard() {
  const [formData, setFormData] = useState({
    destination: "",
    duration: "",
    mood: "",
    language: "",
    templateStyle: "cinematic",
    isPublic: false,
  });

  const [story, setStory] = useState(() => {
    try {
      const stored = localStorage.getItem(STORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  
  const [storyId, setStoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (story) localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(story));
    else localStorage.removeItem(STORY_STORAGE_KEY);
  }, [story]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination || !formData.mood) {
      setError("Please fill in destination and mood.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await createStory(formData);
      setStory(res.data);
      setStoryId(res.data._id);
    } catch { setError("The AI scribe is currently busy."); }
    finally { setLoading(false); }
  };

  const handleRegenerateStory = async () => {
    if (!storyId) return;
    setLoading(true);
    try {
      const res = await regenerateStory(storyId);
      setStory(res.data);
    } finally { setLoading(false); }
  };

  const selectStyle = "w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer";
  const labelStyle = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-2 block";

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-300">
      {/* HEADER HERO */}
      <div className="pt-32 pb-16 px-6 relative overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-indigo-600/10 blur-[120px] rounded-full" />
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 relative z-10">
          Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Stories</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto font-medium">Capture your adventure in a cinematic narrative.</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative z-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className={labelStyle}><MapPin size={12} className="inline mr-1"/> Destination</label>
                <input 
                    name="destination" 
                    placeholder="e.g. Kyoto, Japan"
                    value={formData.destination} 
                    onChange={handleChange} 
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500/50 transition-all" 
                />
              </div>

              <div>
                <label className={labelStyle}><Sparkles size={12} className="inline mr-1"/> Mood</label>
                <select name="mood" value={formData.mood} onChange={handleChange} className={selectStyle}>
                  <option value="" className="bg-[#05070a]">Choose Mood</option>
                  {['Adventurous', 'Relaxed', 'Romantic', 'Mysterious', 'Peaceful'].map(m => (
                    <option key={m} value={m.toLowerCase()} className="bg-[#05070a]">{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelStyle}><Clock size={12} className="inline mr-1"/> Duration</label>
                <select name="duration" value={formData.duration} onChange={handleChange} className={selectStyle}>
                  <option value="" className="bg-[#05070a]">Length</option>
                  {['1 Day', '3 Days', '1 Week', '2 Weeks'].map(d => (
                    <option key={d} value={d.toLowerCase()} className="bg-[#05070a]">{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelStyle}><Globe size={12} className="inline mr-1"/> Language</label>
                <select name="language" value={formData.language} onChange={handleChange} className={selectStyle}>
                  <option value="" className="bg-[#05070a]">Output</option>
                  {['English', 'Hindi', 'Spanish', 'French'].map(l => (
                    <option key={l} value={l.toLowerCase()} className="bg-[#05070a]">{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6 border-t border-white/5">
              <div className="w-full md:w-1/2">
                <label className={labelStyle}>Narrative Style</label>
                <div className="flex gap-2">
                    {['Cinematic', 'Funny', 'Emotional','Thriller'].map(style => (
                        <button
                            key={style}
                            type="button"
                            onClick={() => setFormData(prev => ({...prev, templateStyle: style.toLowerCase()}))}
                            className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                                formData.templateStyle === style.toLowerCase() 
                                ? "bg-indigo-600 border-indigo-500 text-white" 
                                : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                            }`}
                        >
                            {style}
                        </button>
                    ))}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-12 h-6 rounded-full relative transition-all ${formData.isPublic ? "bg-indigo-600" : "bg-white/10"}`}>
                    <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} className="hidden" />
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isPublic ? "left-7" : "left-1"}`} />
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors flex items-center gap-2">
                    <Eye size={14}/> Make Public
                </span>
              </label>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-[60%] py-5 rounded-[2rem] text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
              >
                {loading ? (
                    <RefreshCw className="animate-spin" size={20} />
                ) : (
                    <Send size={20} />
                )}
                <span className="font-black uppercase tracking-[0.2em] text-sm">
                    {loading ? "Warping Reality..." : "Generate Tale"}
                </span>
              </button>
            </div>
          </form>
          {error && <p className="text-red-400 text-center mt-6 text-xs font-bold uppercase tracking-widest">{error}</p>}
        </div>
      </div>

      {story && (
        <StoryResult
          storyData={story}
          onRegenerate={handleRegenerateStory}
          loading={loading}
        />
      )}
    </div>
  );
}