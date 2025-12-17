import React, { useState, useEffect } from "react";
import { createStory, regenerateStory } from "../../services/storyServices";
import Feedback from "../Feedback/FeedbackSection";

const STORY_STORAGE_KEY = "aiStoryData";

/* -------------------- StoryResult -------------------- */
function StoryResult({ storyData, onRegenerate, loading }) {
  if (!storyData || !storyData.storyText) return null;

  const { destination, storyText, images, imageUrl } = storyData;

  return (
    <section className="bg-gradient-to-b from-[#fdf6ee] to-[#fff] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* IMAGE CAROUSEL */}
        <div className="relative mb-16">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {(images?.length ? images : [imageUrl]).map((url, i) => (
              <div key={i} className="relative min-w-[360px] h-[400px]">
                <img
                  src={url}
                  alt={`slide-${i}`}
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
                {i === 0 && (
                  <button
                    onClick={onRegenerate}
                    className="absolute inset-0 flex items-center justify-center  text-white text-sm font-medium rounded-xl hover:bg-black/40"
                  >
                    
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* STORY SECTION */}
        <h2 className="text-4xl font-serif text-gray-800 mb-8 text-center">
          Your Story & Experience in {destination}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-10 ">
          {/* STORY TEXT */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-10">
            <h3 className="text-xl font-semibold mb-4">Story</h3>
            <p className="whitespace-pre-line text-gray-700 leading-relaxed">
              {storyText}
            </p>

            <div className="text-center mt-10 ">
              <button
                onClick={onRegenerate}
                disabled={loading}
                className="px-10 py-3 rounded-full text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 transition"
              >
                {loading ? "Regenerating..." : "Regenerate Story"}
              </button>
            </div>
          </div>

          {/* FEEDBACK CARD */}
          <div className=" text-white rounded-2xl   p-6">
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
    const storedStory = localStorage.getItem(STORY_STORAGE_KEY);
    return storedStory ? JSON.parse(storedStory) : null;
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
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination || !formData.mood || !formData.duration || !formData.language) {
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

  const inputStyle = "w-full p-3  border border-gray-500/50 rounded bg-gray-50";
  const inputContainerStyle = "flex flex-col flex-1 min-w-[180px]";

  return (
    <div className="min-h-screen bg-[#570bd2]">
      <div className="pt-20 pb-16">
        <h1 className="text-4xl text-white text-center mb-12">Create Your Story</h1>

        {/* CREATE YOUR STORY — UNCHANGED LOGIC */}
        <div className="max-w-4xl mx-auto p-13 bg-white  rounded-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3" >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className={inputContainerStyle}><label>Destination</label><input name="destination" value={formData.destination} onChange={handleChange} className={inputStyle} /></div>
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
              </select></div>
              <div className={inputContainerStyle}>
              <label>Duration</label>
              <select name="duration" value={formData.duration} onChange={handleChange} className={inputStyle}>
              <option value="">Select</option>
              <option value="1 days">1 day</option>
              <option value="2 days">2 days</option>
              <option value="3 week">3 days</option>
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
              <option value="Marathi">Marathi</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              </select>
              </div>
            </div>

            <div className="flex items-center gap-20 mb-6">
              <select name="templateStyle" value={formData.templateStyle} onChange={handleChange} className="border border-gray-500/50 p-3 rounded w-1/2">
                <option value="cinematic">Cinematic</option>
                <option value="funny">funny</option>
                <option value="emotional">Emotional</option>
                <option value="cinematic">Thriller</option>
              </select>

              <label className="flex items-center gap-2 text-md"><input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} className="scale-130 " />Make story public</label>
            
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-full text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 transition-all cursor-pointer">
              {loading ? "Generating..." : "Generate Story"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      </div>

      {story && <StoryResult storyData={story} onRegenerate={handleRegenerateStory} loading={loading} />}
    </div>
  );
}