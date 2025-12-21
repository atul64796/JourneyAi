import React from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaArrowRight, FaGlobeAmericas, FaMagic, FaImages } from "react-icons/fa";
import { CiPlay1 } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

import Footer from "../Footer";
import Features from "../LandingPage/Features";
import About from "../LandingPage/About";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">
        
        {/* Ambient Background Glows */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]" />
          {/* Center glow to highlight the text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-300 text-[11px] font-bold uppercase tracking-[2px] mb-10 shadow-2xl">
            <HiOutlineSparkles className="text-cyan-400" size={14} />
            The Future of Travel Memories
          </div>

          {/* New Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9]">
              Transform Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600">
                Travel Into Living Stories
              </span>
            </h1>
          </div>

          {/* Refined Description */}
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            An AI creative suite designed to turn your travel logs into 
            vivid storytelling experiences. Professional visuals, 
            cinematic text, one-click magic.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={() => navigate("/user/generateStories")}
              className="group h-16 px-10 rounded-2xl bg-white text-black font-bold flex items-center gap-3 hover:bg-cyan-400 transition-all duration-300 shadow-xl"
            >
              Start Creating Free
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("/getpublicStories")}
              className="h-16 px-10 rounded-2xl bg-slate-900/50 border border-slate-800 text-white font-bold flex items-center gap-3 hover:bg-slate-800 transition-all backdrop-blur-md"
            >
              <CiPlay1 />
              Explore Stories
            </button>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-28 text-left">
            <div className="group p-8 rounded-[32px] bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl hover:border-cyan-500/50 transition-all duration-500">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6">
                <FaMagic className="text-cyan-400" size={20} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">AI Narratives</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Convert simple coordinates and notes into rich, emotionally resonant travel literature.</p>
            </div>

            <div className="group p-8 rounded-[32px] bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl hover:border-violet-500/50 transition-all duration-500">
              <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-6">
                <FaImages className="text-violet-400" size={20} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">HD Visuals</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Custom high-definition imagery generated to visualize the most iconic moments of your trip.</p>
            </div>

            <div className="group p-8 rounded-[32px] bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl hover:border-emerald-500/50 transition-all duration-500">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <FaGlobeAmericas className="text-emerald-400" size={20} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Global Reach</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Instantly publish and share your masterpieces with a global community of fellow explorers.</p>
            </div>
          </div>
        </div>

        {/* Bottom Fade Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent z-10" />
      </section>

      {/* Other Components */}
      <div className="relative z-20 space-y-32">
        <About />
        <Features />
        <Footer />
      </div>
    </main>
  );
}

export default Home;