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

  /* =========================
     ✅ FIXED SLIDER SETTINGS
     ========================= */
  const sliderSettings = {
    dots: true,
    infinite: feedbacks.length > 1,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    swipeToSlide: true,

    slidesToShow: 3, // default (large screens)
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1536, // 2xl
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024, // tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false, // 🔴 IMPORTANT
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-sky-500/10 blur-[120px]" />

      {/* Header */}
      <section className="relative max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            What Our Users Say
          </h1>
          <div className="h-1 w-16 bg-sky-500 mx-auto rounded-full" />
        </motion.div>
      </section>

      {/* Feedback Slider */}
      <section className="relative bg-slate-900/30 border-y border-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
            </div>
          ) : (
            <Slider {...sliderSettings} className="feedback-slider custom-dots">
              {feedbacks.map((fb) => (
                <div key={fb._id} className="px-3">
                  <div className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-none mx-auto bg-slate-950/60 backdrop-blur-md border border-slate-800 p-6 rounded-[2rem] flex flex-col min-h-[280px] justify-between relative transition-all duration-300">
                    <Quote
                      className="absolute top-4 right-6 text-slate-800/50"
                      size={32}
                    />

                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <img
                          src={fb.user?.avatar || "/avatar.png"}
                          alt={fb.user?.fullName}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-800"
                        />
                        <div className="overflow-hidden">
                          <h4 className="font-semibold truncate">
                            {fb.user?.fullName}
                          </h4>
                          <span className="text-xs text-sky-400 truncate block">
                            {fb.storyId?.destination || "Journey Expert"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < (fb.rating || 5)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-slate-700"
                            }
                          />
                        ))}
                      </div>

                      <p className="text-slate-300 italic text-sm leading-relaxed">
                        “{fb.comment || fb.feedback}”
                      </p>
                    </div>

                    {fb.sentiment && (
                      <span
                        className={`mt-4 text-[10px] w-fit px-3 py-1 rounded-full border font-bold uppercase tracking-widest ${
                          fb.sentiment === "positive"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-slate-500/10 border-slate-500/30 text-slate-400"
                        }`}
                      >
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

      {/* Global fixes */}
      <style jsx global>{`
        .custom-dots .slick-dots {
          bottom: -25px;
        }
        .custom-dots .slick-dots li button:before {
          color: #38bdf8;
          opacity: 0.3;
        }
        .custom-dots .slick-dots li.slick-active button:before {
          opacity: 1;
          font-size: 10px;
        }
        .feedback-slider .slick-track {
          display: flex;
        }
        .feedback-slider .slick-slide {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </main>
  );
}
