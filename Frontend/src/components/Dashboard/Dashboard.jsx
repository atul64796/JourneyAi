import React, { useState, useEffect } from "react";
// Mocking the service call since the real file is external. 
import { createStory } from "../../services/storyServices"; 

const STORY_STORAGE_KEY = "aiStoryData";

// --- START: StoryResult Component (Nested Helper) ---
/**
 * Renders the detailed generated travel story result.
 */
function StoryResult({ storyData }) {
    if (!storyData || !storyData.storyText) {
        return null;
    }

    const {
        destination,
        storyText,
        images,
        imageUrl,
        audioUrl
    } = storyData;

    return (
        // The beige/off-white background section
        <div className="bg-amber-50 py-10 px-6 font-sans mt-10">
            <div className="max-w-6xl mx-auto">
                
                <h2 className="text-3xl font-light text-gray-800 mb-6 text-center">
                    Your Story & Experience in {destination}
                </h2>

                {/* --- Story and Image Layout (Two-column structure) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Story Text */}
                    <div className="lg:col-span-2">
                        <h3 className="text-xl font-bold mb-3 text-gray-900">Story</h3>
                        <p className="whitespace-pre-line text-gray-700 leading-relaxed text-base">
                            {storyText}
                        </p>
                    </div>

                    {/* RIGHT COLUMN: Images and Audio */}
                    <div className="lg:col-span-1">
                        
                        {/* Primary Image Section */}
                        {imageUrl && (
                            <>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">Main Image</h3>
                                <img
                                    src={imageUrl}
                                    alt={`Primary image for ${destination} story`}
                                    className="w-full h-auto rounded-lg shadow-md object-cover mb-6"
                                />
                            </>
                        )}
                        
                        {/* Secondary Images Gallery */}
                        {images && images.length > 1 && (
                            <>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">Gallery</h3>
                                <div className="flex overflow-x-auto space-x-3 pb-2">
                                    {images.slice(0, 5).map((url, index) => (
                                        <div key={index} className="flex-shrink-0 w-32 h-20">
                                            <img
                                                src={url}
                                                alt={`Gallery image ${index + 1}`}
                                                className="w-full h-full object-cover rounded-md shadow-sm"
                                            />
                                        </div>
                                    ))}
                                    {images.length > 5 && (
                                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-20 text-xl text-gray-400">
                                            &gt;
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Audio Section */}
                        <h3 className="text-xl font-bold mt-6 mb-3 text-gray-900">Audio</h3>
                        {audioUrl ? (
                            <audio controls className="w-full">
                                <source src={audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        ) : (
                            <div className="w-full bg-gray-300 rounded-full flex items-center p-2 h-10">
                                <div className="w-1/4 h-2 bg-teal-500 rounded-full"></div>
                                <span className="ml-4 text-sm text-gray-600">0:00 / 2:30 (Placeholder)</span>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
// --- END: StoryResult Component ---


export default function Dashboard() {
  // Function to initialize state from localStorage
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

  // Initialize 'story' state by checking localStorage
  const [story, setStory] = useState(getInitialStory); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect Hook to save 'story' to localStorage whenever it changes
  useEffect(() => {
    if (story) {
      localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(story));
    } else {
      // Clear localStorage if the story is intentionally set to null (e.g., generating a new one)
      localStorage.removeItem(STORY_STORAGE_KEY);
    }
  }, [story]); // Dependency array ensures this runs only when 'story' changes

  // ... (handleChange remains the same)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.destination || !formData.mood || !formData.duration || !formData.language) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    // Temporarily clear the old story while loading the new one
    setStory(null); 

    try {
      const res = await createStory(formData);
      // The state will be updated, and the useEffect hook will save it to localStorage
      setStory(res.data); 
      
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to generate story. Please check the network connection and server status."
      );
    } finally {
      setLoading(false);
    }
  };

  // Common styling classes
  const inputStyle = "w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-teal-500 bg-transparent text-gray-700 placeholder-gray-500";
  const inputContainerStyle = "flex flex-col flex-1 min-w-[150px]"; 

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      
      {/* Top Header and Form Card */}
      <div className="bg-gray-900 pt-16 pb-10">
        <h1 className="text-3xl font-light text-white text-center mb-10">
            AI Travel Story Generator
        </h1>

        {/* Main Card (Form) */}
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-2xl">
            <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
                Create Your Story
            </h2>

            <form onSubmit={handleSubmit}>
                {/* Row of four primary inputs */}
                <div className="flex flex-wrap gap-4 mb-8 justify-between">
                    
                    {/* Destination Input */}
                    <div className={inputContainerStyle}>
                    <label className="text-sm font-medium text-gray-500 mb-1">Destination</label>
                    <input
                        type="text"
                        name="destination"
                        placeholder="Enter destination"
                        value={formData.destination}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                    />
                    </div>
                    
                    {/* Mood Dropdown */}
                    <div className={inputContainerStyle}>
                    <label className="text-sm font-medium text-gray-500 mb-1">Mood</label>
                    <select
                        name="mood"
                        value={formData.mood}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                    >
                        <option value="" disabled hidden>Select Mood</option>
                        <option value="adventurous">Adventurous</option>
                        <option value="romantic">Romantic</option>
                        <option value="relaxing">Relaxing</option>
                        <option value="cultural">Cultural</option>
                    </select>
                    </div>
                    
                    {/* Duration Dropdown */}
                    <div className={inputContainerStyle}>
                    <label className="text-sm font-medium text-gray-500 mb-1">Duration</label>
                    <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                    >
                        <option value="" disabled hidden>Select Duration</option>
                        <option value="1 day">1 day</option>
                        <option value="2 days">2 days</option>
                        <option value="3 days">3 days</option>
                        <option value="1 week">1 week</option>
                    </select>
                    </div>
                    
                    {/* Language Dropdown */}
                    <div className={inputContainerStyle}>
                    <label className="text-sm font-medium text-gray-500 mb-1">Language</label>
                    <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                    >
                        <option value="" disabled hidden>Select Language</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                    </select>
                    </div>
                </div>

                {/* Additional Settings */}
                <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100">
                    <div className="col-span-1">
                        <label className="text-sm font-medium text-gray-500 mb-1 block">Template Style</label>
                        <select
                            name="templateStyle"
                            value={formData.templateStyle}
                            onChange={handleChange}
                            className="border p-2 rounded w-full bg-white text-gray-700"
                        >
                            <option value="cinematic">Cinematic</option>
                            <option value="blog">Blog</option>
                            <option value="story">Story</option>
                        </select>
                    </div>
                    <label className="flex items-center gap-2 text-gray-700 mt-6">
                        <input
                            type="checkbox"
                            name="isPublic"
                            checked={formData.isPublic}
                            onChange={handleChange}
                        />
                        Make story public
                    </label>
                </div>
                
                {/* Generate Story Button with Gradient */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg text-white font-semibold transition duration-300 
                            bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 
                            disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Generating..." : "Generate Story"}
                </button>
            </form>
        </div>
      </div>

     
      <div className="max-w-4xl mx-auto p-6">
        {error && <p className="text-red-400 font-medium text-center">{error}</p>}
      </div>

      
      {story && <StoryResult storyData={story} />}

    </div>
  );
}