import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { createStory, regenerateStory } from "../../services/storyServices";

// Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { 
  MapPin, RefreshCw, Sparkles, 
  Languages, Clock, Lock, Unlock, Compass, RotateCcw
} from "lucide-react";

import FeedbackSection from "../../components/Feedback/FeedbackSection.jsx"; 

const STORY_STORAGE_KEY = "aiStoryData";

export default function Dashboard() {
  const [formData, setFormData] = useState({
    destination: "",
    duration: "",
    mood: "",
    language: "english",     
    templateStyle: "cinematic", 
    isPublic: false,
  });

  const [story, setStory] = useState(() => {
    try {
      const stored = localStorage.getItem(STORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [loading, setLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (story) {
      localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(story));
    }
  }, [story]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 2000,
    fade: true,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    dotsClass: "slick-dots custom-dots",
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination || !formData.mood) {
      setError("Destination and Mood are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await createStory(formData);
      setStory(res.data);
    } catch (err) {
      setError("The AI scribe's ink has dried. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // NEW: Handle Regeneration
  const handleRegenerate = async () => {
    if (!story?._id) return;
    setIsRegenerating(true);
    setError("");
    try {
      const res = await regenerateStory(story._id);
      setStory(res.data);
    } catch (err) {
      setError("Failed to rewrite the tale.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const displayImages = story?.images?.length > 0 ? story.images : [
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070"
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#0a0a0a] text-white overflow-hidden pt-16">
      
      {/* LEFT PANEL */}
      <div className="w-full lg:w-[55%] h-[40vh] lg:h-full relative overflow-hidden flex-shrink-0 group">
        <Slider {...sliderSettings} className="h-full w-full">
          {displayImages.map((img, idx) => (
            <div key={idx} className="relative h-[40vh] lg:h-[calc(100vh-64px)] outline-none">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
              <img src={img} alt="Travel" className="w-full h-full object-cover transition-transform duration-[10s] scale-110" />
            </div>
          ))}
        </Slider>
        <div className="absolute top-6 left-6 lg:top-12 lg:left-12 z-20">
          <div className="flex items-center gap-3 mb-2 opacity-80">
            <div className="h-[1px] w-8 bg-indigo-500" />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-indigo-400">Voyage Scribe</span>
          </div>
          <h2 className="text-4xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
            {story?.destination || "Explore"}
          </h2>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-[45%] h-[60vh] lg:h-full bg-[#0d0d0d] flex flex-col border-l border-white/5 relative shadow-2xl">
        
        {/* Form */}
        <div className="p-6 lg:p-10 border-b border-white/5 bg-[#0d0d0d]/80 backdrop-blur-md z-30">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Location</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
                <input 
                  name="destination" required value={formData.destination} 
                  onChange={handleChange} placeholder="e.g. Kyoto, Japan" 
                  className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-xl focus:border-indigo-500/50 outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select name="mood" required value={formData.mood} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl text-sm outline-none appearance-none cursor-pointer">
                <option value="" className="bg-black text-white">Mood</option>
                <option value="adventurous" className="bg-black">Adventurous</option>
                <option value="relaxed" className="bg-black">Relaxed</option>
                <option value="romantic" className="bg-black">Romantic</option>
                <option value="mysterious" className="bg-black">Mysterious</option>
              </select>

              <button 
                type="submit" disabled={loading}
                className="h-[52px] bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {loading ? "Forging..." : "Generate"}
              </button>
            </div>

            <div className="flex gap-2 pt-2">
               <select name="language" value={formData.language} onChange={handleChange} className="flex-1 bg-white/5 border border-white/10 text-[15px] p-2 rounded-lg uppercase font-bold text-slate-400 outline-none">
                  {["English", "Hindi", "Bengali", "Marathi", "Spanish","French"].map(l => (
                    <option key={l} value={l.toLowerCase()} className="bg-black">{l}</option>
                  ))}
               </select>
               
               <select name="duration" value={formData.duration} onChange={handleChange} className="flex-1 bg-white/5 border border-white/10 text-[15px] p-2 rounded-lg uppercase font-bold text-slate-400 outline-none">
                  <option value="" className="bg-black">Time</option>
                  {["1 Day", "3 Days", "1 Week"].map(d => (
                    <option key={d} value={d.toLowerCase()} className="bg-black">{d}</option>
                  ))}
               </select>

               <button 
                type="button" onClick={() => setFormData(p => ({...p, isPublic: !p.isPublic}))}
                className={`px-5 rounded-lg border flex items-center gap-2 transition-all ${formData.isPublic ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400' : 'border-white/10 bg-white/5 text-slate-500'}`}
               >
                 {formData.isPublic ? <Unlock size={15}/> : <Lock size={15}/>}
                 <span className="text-[12px] font-bold uppercase">{formData.isPublic ? 'Public' : 'Private'}</span>
               </button>
            </div>
          </form>
          {error && <p className="text-red-400 text-[10px] mt-4 font-bold uppercase tracking-widest text-center">{error}</p>}
        </div>

        {/* Story Output */}
        <div className="flex-grow overflow-y-auto p-8 lg:p-14 custom-scrollbar bg-gradient-to-b from-[#0d0d0d] to-black">
          {story ? (
            <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <div className="flex items-center justify-center gap-6 opacity-20">
                 <div className="h-[1px] flex-grow bg-white" />
                 <Compass size={18} />
                 <div className="h-[1px] flex-grow bg-white" />
              </div>
              
              <p className="text-xl lg:text-3xl font-serif leading-[2] text-slate-200 font-light text-center lg:text-left selection:bg-indigo-500/30">
                {story.storyText}
              </p>

              <div className="pt-10 flex flex-col items-center gap-8 border-t border-white/5">
                <div className="flex items-center gap-4">
                  {/* REGENERATE BUTTON */}
                  <button 
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                  >
                    <RotateCcw size={14} className={isRegenerating ? "animate-spin" : ""} />
                    {isRegenerating ? "Rewriting..." : "Regenerate Tale"}
                  </button>
                </div>
                
                <FeedbackSection storyId={story._id} />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <div className="w-16 h-16 rounded-full border border-dashed border-indigo-500/50 flex items-center justify-center mb-6 animate-[spin_10s_linear_infinite]">
                <Sparkles size={24} className="text-indigo-500" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.5em] font-black italic">Awaiting your journey...</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .slick-slider, .slick-list, .slick-track { height: 100% !important; }
        .custom-dots { bottom: 30px !important; left: 30px !important; width: auto !important; text-align: left !important; z-index: 40; }
        .custom-dots li { margin: 0; }
        .custom-dots li button:before { color: white !important; font-size: 6px !important; opacity: 0.3; }
        .custom-dots li.slick-active button:before { color: #6366f1 !important; opacity: 1; }
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@200;400;700&display=swap');
        .font-serif { font-family: 'Crimson Pro', serif; }
      `}</style>
    </div>
  );
}