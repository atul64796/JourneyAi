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
    infinite: feedbacks.length > 1,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 768, // Tablet
        settings: { 
          slidesToShow: 1, 
          centerMode: true, 
          centerPadding: "60px" 
        }
      },
      {
        breakpoint: 480, // Mobile
        settings: { 
          slidesToShow: 1, 
          centerMode: false, // Turn off centerMode to give card full width
          centerPadding: "0px",
          dots: true
        }
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500/30 overflow-x-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] md:h-[500px] bg-sky-500/10 blur-[80px] md:blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/5 text-sky-400 text-xs md:text-sm font-medium mb-6 inline-block">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 md:mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            About Journey AI
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-xl leading-relaxed">
            We are bridging the gap between raw data and human experience through 
            intelligent, AI-driven journey optimization.
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20 md:pb-32">
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
          {[
            {
              title: "Our Mission",
              desc: "To empower people to share their journeys through an intuitive platform that inspires creativity and authentic expression.",
              icon: <Target className="text-sky-400" size={28} />,
            },
            {
              title: "Our Vision",
              desc: "To become a global storytelling community where technology bridges cultures, connecting people through shared experiences.",
              icon: <Brain className="text-purple-400" size={28} />,
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group p-6 md:p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-sky-500/50 transition-all duration-300 shadow-xl"
            >
              <div className="mb-4 md:mb-6 p-3 bg-slate-950 w-fit rounded-2xl border border-slate-800 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                {item.icon}
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{item.title}</h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feedback Slider Section */}
      <section className="relative bg-slate-900/30 border-y border-slate-800 py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <div className="h-1 w-16 md:w-20 bg-sky-500 mx-auto rounded-full" />
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
            </div>
          ) : (
            <div className="feedback-container"> 
              <Slider {...sliderSettings} className="feedback-slider custom-dots">
                {feedbacks.map((fb) => (
                  <div key={fb._id} className="outline-none px-2 py-4">
                    <div className="mx-auto max-w-[350px] md:max-w-none bg-slate-950/60 backdrop-blur-md border border-slate-800 p-6 md:p-8 rounded-[2rem] flex flex-col min-h-[280px] justify-between relative group transition-all duration-300">
                      <Quote className="absolute top-4 right-6 text-slate-800/50 group-hover:text-sky-500/20 transition-colors" size={32} />
                      
                      <div>
                        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                          <img
                            src={fb.user?.avatar || "/avatar.png"}
                            alt={fb.user?.fullName}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl object-cover ring-2 ring-slate-800"
                          />
                          <div className="overflow-hidden">
                            <h4 className="font-semibold text-white text-base md:text-lg truncate">
                              {fb.user?.fullName}
                            </h4>
                            <span className="text-[10px] md:text-xs font-medium text-sky-400 uppercase tracking-wider block truncate">
                              {fb.storyId?.destination || "Journey Expert"}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-0.5 mb-3 md:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={i < (fb.rating || 5) ? "fill-yellow-500 text-yellow-500" : "text-slate-700"} 
                            />
                          ))}
                        </div>

                        <p className="text-slate-300 italic text-sm md:text-base leading-relaxed mb-4">
                          “{fb.comment || fb.feedback}”
                        </p>
                      </div>

                      {fb.sentiment && (
                        <span className={`text-[9px] w-fit px-2 py-0.5 rounded-full border font-bold uppercase tracking-widest ${
                          fb.sentiment === 'positive' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-500/10 border-slate-500/30 text-slate-400'
                        }`}>
                          {fb.sentiment}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </section>
      
      <style jsx global>{`
        .feedback-container {
          padding-bottom: 40px;
        }
        .custom-dots .slick-dots {
          bottom: -20px;
        }
        .custom-dots .slick-dots li button:before {
          color: #38bdf8 !important;
          font-size: 8px;
          opacity: 0.3;
        }
        .custom-dots .slick-dots li.slick-active button:before {
          color: #38bdf8 !important;
          opacity: 1;
          font-size: 10px;
        }
        .feedback-slider .slick-track {
          display: flex !important;
          align-items: stretch;
        }
        .feedback-slider .slick-slide {
          height: inherit !important;
          display: flex !important;
          justify-content: center;
        }
        /* Fixes the width issues on mobile */
        .feedback-slider .slick-list {
          margin: 0 -10px;
        }
        @media (max-width: 480px) {
          .feedback-slider .slick-slide {
            padding: 0 10px;
          }
        }
      `}</style>
    </main>
  );
}