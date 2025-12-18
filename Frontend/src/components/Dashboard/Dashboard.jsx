import React, { useState, useEffect } from "react";
import { createStory, regenerateStory } from "../../services/storyServices";
import Feedback from "../Feedback/FeedbackSection";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const STORY_STORAGE_KEY = "aiStoryData";

/* -------------------- StoryResult -------------------- */
function StoryResult({ storyData, onRegenerate, loading }) {
  if (!storyData?.storyText) return null;

  const { destination, storyText, images = [], imageUrl } = storyData;
  const allImages = images.length ? images : imageUrl ? [imageUrl] : [];

  const sliderSettings = {
    dots: true,
    infinite: true,
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
    <section className="bg-gradient-to-b from-[#fdf6ee] to-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* IMAGE CAROUSEL */}
        {allImages.length > 0 && (
          <div className="mb-16">
            <Slider {...sliderSettings}>
              {allImages.map((url, i) => (
                <div key={i} className="px-2">
                  <div className="relative h-[400px]">
                    <img
                      src={url}
                      alt={`slide-${i}`}
                      className="w-full h-full object-cover rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}

        {/* STORY SECTION */}
        <h2 className="text-4xl font-serif text-gray-800 mb-8 text-center">
          Your Story & Experience in {destination}
        </h2>

        <div className="grid grid-cols-1 gap-10">
          {/* STORY TEXT */}
          <div className="bg-white rounded-2xl shadow-xl p-10">
            <h3 className="text-xl font-semibold mb-4">Story</h3>
            <p className="whitespace-pre-line text-gray-700 leading-relaxed">
              {storyText}
            </p>

            <div className="text-center mt-10">
              <button
                onClick={onRegenerate}
                disabled={loading}
                className="px-10 py-3 rounded-full text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 transition disabled:opacity-60"
              >
                {loading ? "Regenerating..." : "Regenerate Story"}
              </button>
            </div>
          </div>

          {/* FEEDBACK CARD */}
          <div className="rounded-2xl p-6">
            <Feedback storyId={storyData._id} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Dashboard -------------------- */
export default function Dashboard() {
  const getInitialStory = () => {
    try {
      const stored = localStorage.getItem(STORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const [formData, setFormData] = useState({
    destination: "",
    duration: "",
    mood: "",
    language: "",
    templateStyle: "cinematic",
    isPublic: false,
  });

  const [story, setStory] = useState(getInitialStory);
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
    const { destination, mood, duration, language } = formData;

    if (!destination || !mood || !duration || !language) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    setStory(null);

    try {
      const res = await createStory(formData);
      setStory(res.data);
      setStoryId(res.data._id);
    } catch {
      setError("Failed to generate story.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateStory = async () => {
    if (!storyId) return;
    setLoading(true);
    try {
      const res = await regenerateStory(storyId);
      setStory(res.data);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full p-3 border border-gray-400 rounded bg-gray-50";
  const inputContainerStyle = "flex flex-col flex-1 min-w-[180px]";

  return (
    <div className="min-h-screen bg-[#570bd2]">
      <div className="pt-20 pb-16">
        <h1 className="text-4xl text-white text-center mb-12">Create Your Story</h1>

        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={inputContainerStyle}>
                <label>Destination</label>
                <input name="destination" value={formData.destination} onChange={handleChange} className={inputStyle} />
              </div>

              <div className={inputContainerStyle}>
                <label>Mood</label>
                <select name="mood" value={formData.mood} onChange={handleChange} className={inputStyle}>
                  <option value="">Select</option>
                  <option value="adventurous">Adventurous</option>
                  <option value="excited">Excited</option>
                  <option value="relaxed">Relaxed</option>
                  <option value="romantic">Romantic</option>
                  <option value="peaceful">Peaceful</option>
                  <option value="mysterious">Mysterious</option>
                </select>
              </div>

              <div className={inputContainerStyle}>
                <label>Duration</label>
                <select name="duration" value={formData.duration} onChange={handleChange} className={inputStyle}>
                  <option value="">Select</option>
                  <option value="1 day">1 day</option>
                  <option value="2 days">2 days</option>
                  <option value="3 days">3 days</option>
                  <option value="1 week">1 week</option>
                </select>
              </div>

              <div className={inputContainerStyle}>
                <label>Language</label>
                <select name="language" value={formData.language} onChange={handleChange} className={inputStyle}>
                  <option value="">Select</option>
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="bengali">Bengali</option>
                  <option value="marathi">Marathi</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <select
                name="templateStyle"
                value={formData.templateStyle}
                onChange={handleChange}
                className="border border-gray-400 p-3 rounded w-full md:w-1/2"
              >
                <option value="cinematic">Cinematic</option>
                <option value="funny">Funny</option>
                <option value="emotional">Emotional</option>
                <option value="thriller">Thriller</option>
              </select>

              <label className="flex items-center gap-2 text-md">
                <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} className="scale-110" />
                Make story public
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 transition disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Story"}
            </button>
          </form>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
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
