import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, Globe, ArrowLeft, Smile } from "lucide-react";
import api from "../services/api";
import StoryChatbot from "./StoryChatbot";

const StoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await api.get(`/stories/${id}`);
        setStory(res.data.data);
      } catch (err) {
        console.error("Failed to load story", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Fetching your story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Story not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back to feed</span>
      </button>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          My Journey to {story.destination}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b">
          <div className="flex items-center gap-4">
            <img
              src={story.userId.avatar}
              alt={story.userId.fullName}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-bold text-gray-900 text-lg">
                {story.userId.fullName}
              </p>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar size={14} />
                {new Date(story.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Tag
              icon={<MapPin size={14} />}
              label={story.destination}
              color="bg-blue-50 text-blue-700"
            />
            <Tag
              icon={<Clock size={14} />}
              label={story.duration}
              color="bg-green-50 text-green-700"
            />
            <Tag
              icon={<Smile size={14} />}
              label={story.mood}
              color="bg-purple-50 text-purple-700"
            />
            <Tag
              icon={<Globe size={14} />}
              label={story.language}
              color="bg-orange-50 text-orange-700"
            />
          </div>
        </div>
      </header>

      {/* Story Content */}
      <div className="prose prose-lg max-w-none mb-14">
        <div className="text-gray-800 leading-[1.8] text-lg font-serif whitespace-pre-line">
          {story.storyText}
        </div>
      </div>

      {/* Chatbot Section */}
      <section className="mt-14 border-t pt-8">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">
          🤖 Ask Journey AI about this trip
        </h3>

        <p className="text-gray-500 mb-6">
          Ask about budget, weather, culture, or best time to visit.
        </p>

        <StoryChatbot storyId={story._id} />
      </section>
    </article>
  );
};

const Tag = ({ icon, label, color }) => (
  <span
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${color}`}
  >
    {icon}
    {label}
  </span>
);

export default StoryView;
