import { Brain, Target, Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getSomeFeedback } from "../../../services/feedbackServices";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../style/slick-overrides.css";

export default function About() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const res = await getSomeFeedback();
        setFeedbacks(res.data.data);
      } catch (error) {
        console.error("Failed to load feedback", error);
      } finally {
        setLoading(false);
      }
    };
    loadFeedbacks();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: feedbacks.length > 3,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500/30">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-sky-500/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/5 text-sky-400 text-sm font-medium mb-6 inline-block">
            Our Story
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            About Journey AI
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            We are bridging the gap between raw data and human experience through 
            intelligent, AI-driven journey optimization.
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid gap-8 md:grid-cols-2">
          {[
            {
              title: "Our Mission",
              desc: "Empowering global teams to design hyper-personalized customer experiences with precision.",
              icon: <Target className="text-sky-400" size={32} />,
            },
            {
              title: "Our Vision",
              desc: "A world where technology anticipates human needs, making every digital interaction feel natural.",
              icon: <Brain className="text-purple-400" size={32} />,
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="group p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-sky-500/50 transition-all duration-300 shadow-2xl"
            >
              <div className="mb-6 p-3 bg-slate-950 w-fit rounded-2xl border border-slate-800 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                {item.icon}
              </div>
              <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feedback Slider */}
      <section className="relative bg-slate-900/30 border-y border-slate-800 py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our User Say's</h2>
            <div className="h-1 w-20 bg-sky-500 mx-auto rounded-full" />
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
            </div>
          ) : (
            <Slider {...sliderSettings} className="feedback-slider">
              {feedbacks.map((fb) => (
                <div key={fb._id} className="px-4 py-6">
                  <div className="bg-slate-950/40 backdrop-blur-md border border-slate-800 p-8 rounded-3xl h-full flex flex-col justify-between relative group hover:bg-slate-900/60 transition-colors duration-300">
                    <Quote className="absolute top-6 right-8 text-slate-800 group-hover:text-sky-500/20 transition-colors" size={40} />
                    
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <img
                          src={fb.user?.avatar || "/avatar.png"}
                          alt={fb.user?.fullName}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-sky-500/50 transition-all"
                        />
                        <div>
                          <h4 className="font-semibold text-white text-lg leading-tight">
                            {fb.user?.fullName}
                          </h4>
                          <span className="text-xs font-medium text-sky-400 uppercase tracking-wider">
                            {fb.storyId?.destination || "Journey Expert"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < (fb.rating || 5) ? "fill-yellow-500 text-yellow-500" : "text-slate-700"} 
                          />
                        ))}
                      </div>

                      <p className="text-slate-300 italic leading-relaxed mb-6">
                        “{fb.comment || fb.feedback}”
                      </p>
                    </div>

                    {fb.sentiment && (
                      <span className={`text-[10px] w-fit px-2 py-0.5 rounded-full border font-bold uppercase tracking-widest ${
                        fb.sentiment === 'positive' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-500/10 border-slate-500/30 text-slate-400'
                      }`}>
                        {fb.sentiment}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </section>
    </main>
  );
}