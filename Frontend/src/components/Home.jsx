import React from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";
import { CiPlay1 } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen  text-black">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20 py-10 md:py-20 flex flex-col gap-8">

        {/* Badge */}
        <div className="self-center">
          <div className="inline-flex items-center gap-3 bg-blue-600/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm md:text-base">
            <span className="text-yellow-400 text-2xl md:text-3xl" aria-hidden>
              <HiOutlineSparkles />
            </span>
            <span className="whitespace-nowrap">Powered By Advanced AI Technology</span>
          </div>
        </div>

        {/* Hero */}
        <section className="w-full flex flex-col items-center text-center gap-6 md:gap-8 drop-shadow-[0_2px_1px_rgba(0,0,0,0.35)]">
          <div className="font-extrabold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl flex gap-4">
            <span className="text-orange-400">Transform</span>
            <span className="text-white">Your</span>
            <span className="text-green-500">Travel</span>
          </div>

          {/* Gradient stroked headline */}
          <h2
            className="font-extrabold leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-[9vmin]
             bg-gradient-to-r from-[#ae08dc] via-[#6a0bcf] to-[#250fa0]
             bg-clip-text text-transparent
             drop-shadow-[0_2px_1px_rgba(0,0,0,0.35)]"
            
          >
            Into Living Stories
          </h2>

          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-black">
            Create stunning AI-generated travel narratives and breathtaking images from your
            adventures. Turn memories into masterpieces with JourneyAI.
          </p>

          {/* Buttons: stacked on xs, inline on sm+ */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 md:mt-10">
            {/* Primary */}
            <button
              type="button"
              className="inline-flex items-center gap-3 px-5 py-3 md:px-6 md:py-4 rounded-full
                         bg-gradient-to-r from-[#ae08dc] via-[#6a0bcf] to-[#250fa0] text-white
                         text-sm md:text-base font-medium shadow-lg transform hover:-translate-y-0.5 transition"
              onClick={(()=>{
                  navigate("/user/dashboard")
              })}>
              <span>Start Creating Free</span>
              <FaArrowRight aria-hidden />
            </button>

            {/* Secondary */}
            <button
              type="button"
              className="inline-flex items-center gap-3 px-5 py-3 md:px-6 md:py-4 rounded-full
                         bg-blue-500/20 backdrop-blur-sm border border-white/10 text-sm md:text-base font-medium
                         hover:bg-white/10 transition"
            onClick={(()=>{
              navigate("/getpublicStories")
            })}>
              <CiPlay1 aria-hidden />
              <span>Read Public Stories</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
export default Home;
