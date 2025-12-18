import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const StoryView = () => {
  const { id } = useParams();
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
      <div className="flex justify-center items-center min-h-[60vh]">
        Loading...
      </div>
    );
  }

  if (!story) {
    return <p className="text-center text-gray-500">Story not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Author */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={story.userId.avatar}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{story.userId.fullName}</p>
          <p className="text-sm text-gray-500">
            {new Date(story.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Story Info */}
      <div className="mb-4 text-sm text-gray-600 grid grid-cols-2 gap-2">
        <p><b>Destination:</b> {story.destination}</p>
        <p><b>Mood:</b> {story.mood}</p>
        <p><b>Duration:</b> {story.duration}</p>
        <p><b>Language:</b> {story.language}</p>
      </div>

      {/* Story Text */}
      <div className="bg-white rounded-xl shadow-sm border p-5 leading-relaxed whitespace-pre-line">
        {story.storyText}
      </div>
    </div>
  );
};

export default StoryView;
