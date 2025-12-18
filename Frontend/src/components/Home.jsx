import React from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";
import { CiPlay1 } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

import Footer from "./Footer";
import Features from "./Features";
import About from "./About";



function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero Wrapper */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-16 sm:py-20 lg:py-28 flex flex-col items-center gap-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-blue-600/20 backdrop-blur-md px-4 py-2 rounded-full text-xs sm:text-sm">
            <HiOutlineSparkles className="text-yellow-400 text-lg sm:text-xl" />
            <span className="whitespace-nowrap">
              Powered by Advanced AI Technology
            </span>
          </div>

          {/* Headings */}
          <div className="text-center space-y-4">
            <h1 className="font-extrabold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="text-orange-400">Transform</span>{" "}
              <span>Your</span>{" "}
              <span className="text-green-500">Travel</span>
            </h1>

            <h2
              className="font-extrabold leading-tight text-4xl sm:text-5xl md:text-6xl
              bg-gradient-to-r from-[#ae08dc] via-[#6a0bcf] to-[#250fa0]
              bg-clip-text text-transparent"
            >
              Into Living Stories
            </h2>
          </div>

          {/* Description */}
          <p className="max-w-xl text-center text-sm sm:text-base md:text-lg text-gray-300">
            Create stunning AI-generated travel narratives and breathtaking
            visuals from your adventures. Turn memories into masterpieces
            with Journey AI.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <button
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full
              bg-gradient-to-r from-[#ae08dc] via-[#6a0bcf] to-[#250fa0]
              text-white text-sm sm:text-base font-medium
              shadow-lg hover:scale-[1.03] transition"
              onClick={() => navigate("/user/dashboard")}
            >
              Start Creating Free
              <FaArrowRight />
            </button>

            <button
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full
              bg-white/10 backdrop-blur border border-white/10
              text-sm sm:text-base font-medium
              hover:bg-white/20 transition"
              onClick={() => navigate("/getpublicStories")}
            >
              <CiPlay1 />
              Read Public Stories
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <About />
      <Features />
      <Footer />
    </main>
  );
}

export default Home;
