import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { createStory, regenerateStory } from "../../../services/storyServices.js";

// Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { 
  MapPin, RefreshCw, Sparkles, 
  Lock, Unlock, Compass, RotateCcw,
  Share2, Check 
} from "lucide-react";

import FeedbackSection from "../Feedback/FeedbackSection.jsx"; 

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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (story) {
      localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(story));
    }
  }, [story]);

  const handleShare = async () => {
    if (!story) return;
    const shareUrl = `${window.location.origin}/stories/${story._id}`;
    const shareText = `Check out my AI-generated journey to ${story.destination}!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `Voyage Scribe`, text: shareText, url: shareUrl });
      } catch (err) { console.error("Error sharing:", err); }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) { setError("Could not copy link."); }
    }
  };

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
      // Auto-scroll to story on mobile after generation
      if (window.innerWidth < 1024) {
        setTimeout(() => {
            document.getElementById('story-output-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    } catch (err) { setError("The AI scribe's ink has dried."); }
    finally { setLoading(false); }
  };

  const handleRegenerate = async () => {
    if (!story?._id) return;
    setIsRegenerating(true);
    try {
      const res = await regenerateStory(story._id);
      setStory(res.data);
    } catch (err) { setError("Failed to rewrite."); }
    finally { setIsRegenerating(false); }
  };

  const displayImages = story?.images?.length > 0 ? story.images : [
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070"
  ];

  return (
    // Changed h-screen to min-h-screen and removed overflow-hidden on mobile
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-[#0a0a0a] text-white pt-16 lg:overflow-hidden">
      
      {/* LEFT PANEL - Hero / Slider */}
      <div className="w-full lg:w-[50%] xl:w-[55%] h-[40vh] lg:h-full relative flex-shrink-0 group">
        <Slider {...sliderSettings} className="h-full w-full">
          {displayImages.map((img, idx) => (
            <div key={idx} className="relative h-[40vh] lg:h-[calc(100vh-64px)] outline-none">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
              <img src={img} alt="Travel" className="w-full h-full object-cover transition-transform duration-[10s] scale-110" />
            </div>
          ))}
        </Slider>
        <div className="absolute bottom-10 left-6 lg:top-12 lg:left-12 z-20">
          <div className="flex items-center gap-3 mb-2 opacity-80">
            <div className="h-[1px] w-8 bg-indigo-500" />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-indigo-400">Voyage Scribe</span>
          </div>
          <h2 className="text-4xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
            {story?.destination || "Explore"}
          </h2>
        </div>
      </div>

      {/* RIGHT PANEL - Content Area */}
      <div className="w-full lg:w-[50%] xl:w-[45%] flex flex-col bg-[#0d0d0d] border-l border-white/5 relative shadow-2xl overflow-y-auto lg:overflow-hidden">
        
        {/* Form Section - Stay at top on mobile */}
        <div className="p-6 lg:p-10 border-b border-white/5 bg-[#0d0d0d]/90 backdrop-blur-md sticky top-0 lg:static z-40">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <select name="mood" required value={formData.mood} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl text-sm outline-none appearance-none cursor-pointer">
                  <option value="" className="bg-black">Mood</option>
                  {["Adventurous", "Relaxed", "Romantic", "Mysterious"].map(m => (
                    <option key={m} value={m.toLowerCase()} className="bg-black">{m}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" disabled={loading}
                className="h-[52px] bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
              >
                {loading ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {loading ? "Forging..." : "Generate Tale"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
               <select name="language" value={formData.language} onChange={handleChange} className="flex-1 min-w-[100px] bg-white/5 border border-white/10 text-[13px] p-2.5 rounded-lg uppercase font-bold text-slate-400 outline-none">
                  {["English", "Hindi", "Bengali", "Marathi", "Spanish", "French"].map(l => (
                    <option key={l} value={l.toLowerCase()} className="bg-black">{l}</option>
                  ))}
               </select>
               
               <select name="duration" value={formData.duration} onChange={handleChange} className="flex-1 min-w-[100px] bg-white/5 border border-white/10 text-[13px] p-2.5 rounded-lg uppercase font-bold text-slate-400 outline-none">
                  <option value="" className="bg-black">Time</option>
                  {["1 Day", "3 Days", "1 Week"].map(d => (
                    <option key={d} value={d.toLowerCase()} className="bg-black">{d}</option>
                  ))}
               </select>

               <button 
                type="button" onClick={() => setFormData(p => ({...p, isPublic: !p.isPublic}))}
                className={`flex-grow sm:flex-grow-0 px-4 py-2.5 rounded-lg border flex items-center justify-center gap-2 transition-all ${formData.isPublic ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400' : 'border-white/10 bg-white/5 text-slate-500'}`}
               >
                 {formData.isPublic ? <Unlock size={14}/> : <Lock size={14}/>}
                 <span className="text-[10px] font-bold uppercase">{formData.isPublic ? 'Public' : 'Private'}</span>
               </button>
            </div>
          </form>
          {error && <p className="text-red-400 text-[10px] mt-4 font-bold uppercase tracking-widest text-center">{error}</p>}
        </div>

        {/* Story Output Section - Adjust padding and text for mobile */}
        <div id="story-output-section" className="flex-grow overflow-y-auto p-6 md:p-10 lg:p-14 custom-scrollbar bg-gradient-to-b from-[#0d0d0d] to-black">
          {story ? (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex items-center justify-center gap-6 opacity-20">
                 <div className="h-[1px] flex-grow bg-white" />
                 <Compass size={18} />
                 <div className="h-[1px] flex-grow bg-white" />
              </div>
              
              <article className="prose prose-invert max-w-none">
                <p className="text-lg md:text-xl lg:text-2xl font-serif leading-[1.8] md:leading-[2] text-slate-200 font-light selection:bg-indigo-500/30">
                  {story.storyText}
                </p>
              </article>

              <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-white/5">
                {/* REGENERATE BUTTON */}
                <button 
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
                >
                  <RotateCcw size={14} className={isRegenerating ? "animate-spin" : ""} />
                  {isRegenerating ? "Rewriting..." : "Regenerate"}
                </button>

                {/* SHARE BUTTON */}
                <button 
                  onClick={handleShare}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 border ${
                    copied ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500'
                  }`}
                >
                  {copied ? <Check size={14} /> : <Share2 size={14} />}
                  {copied ? "Copied!" : "Share Story"}
                </button>
              </div>
              
              <div className="pt-4">
                 <FeedbackSection storyId={story._id} />
              </div>
            </div>
          ) : (
            <div className="h-64 lg:h-full flex flex-col items-center justify-center text-center opacity-30">
              <div className="w-12 h-12 rounded-full border border-dashed border-indigo-500/50 flex items-center justify-center mb-6 animate-[spin_10s_linear_infinite]">
                <Sparkles size={20} className="text-indigo-500" />
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
        .custom-dots { bottom: 20px !important; left: 20px !important; width: auto !important; text-align: left !important; z-index: 40; }
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@200;400;700&display=swap');
        .font-serif { font-family: 'Crimson Pro', serif; }
      `}</style>
    </div>
  );
}