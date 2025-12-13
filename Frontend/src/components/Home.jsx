import React from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";
import { CiPlay1 } from "react-icons/ci";

function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-[#1e0362] via-[#884cc5] to-[#3f045f] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20 py-10 md:py-20 flex flex-col gap-8">

        {/* Badge */}
        <div className="self-center">
          <div className="inline-flex items-center gap-3 bg-white/6 backdrop-blur-sm px-4 py-2 rounded-full text-sm md:text-base">
            <span className="text-yellow-400 text-2xl md:text-3xl" aria-hidden>
              <HiOutlineSparkles />
            </span>
            <span className="whitespace-nowrap">Powered By Advanced AI Technology</span>
          </div>
        </div>

        {/* Hero */}
        <section className="w-full flex flex-col items-center text-center gap-6 md:gap-8">
          <h1 className="font-extrabold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            Transform Your Travel
          </h1>

          {/* Gradient stroked headline */}
          <h2
            className="font-extrabold leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-[9vmin]
             bg-gradient-to-r from-[#ae08dc] via-[#6a0bcf] to-[#250fa0]
             bg-clip-text text-transparent
             drop-shadow-[0_5px_1px_rgba(0,0,0,0.35)]"
            
          >
            Into Living Stories
          </h2>

          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-white/85">
            Create stunning AI-generated travel narratives and breathtaking images from your
            adventures. Turn memories into masterpieces with JourneyAI.
          </p>

          {/* Buttons: stacked on xs, inline on sm+ */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 md:mt-10">
            {/* Primary */}
            <button
              type="button"
              className="inline-flex items-center gap-3 px-5 py-3 md:px-6 md:py-4 rounded-full
                         bg-gradient-to-r from-[#ae08dc] via-[#6a0bcf] to-[#250fa0]
                         text-sm md:text-base font-medium shadow-lg transform hover:-translate-y-0.5 transition"
            >
              <span>Start Creating Free</span>
              <FaArrowRight aria-hidden />
            </button>

            {/* Secondary */}
            <button
              type="button"
              className="inline-flex items-center gap-3 px-5 py-3 md:px-6 md:py-4 rounded-full
                         bg-white/6 backdrop-blur-sm border border-white/10 text-sm md:text-base font-medium
                         hover:bg-white/10 transition"
            >
              <CiPlay1 aria-hidden />
              <span>Watch Demo</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
export default Home;
