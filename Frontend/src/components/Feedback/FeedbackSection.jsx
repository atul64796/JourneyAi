import React, { useEffect, useState } from "react";
import {
  createFeedback,
  getMyFeedback,
  updateFeedback,
  deleteFeedback,
} from "../../services/feedbackServices";

export default function FeedbackSection({ storyId }) {
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (storyId) loadMyFeedback();
  }, [storyId]);

  const loadMyFeedback = async () => {
    try {
      const res = await getMyFeedback();
      const myFeedback = res.data?.data?.find(
        (f) => f.storyId === storyId || f.storyId?._id === storyId
      );
      if (myFeedback) {
        setExistingFeedback(myFeedback);
        setFeedbackText(myFeedback.comment);
        setRating(myFeedback.rating);
      }
    } catch (err) {
      console.error("Failed to load feedback", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setIsSubmitting(true);
    setError("");

    try {
      if (existingFeedback && isEditing) {
        await updateFeedback(existingFeedback._id, { comment: feedbackText, rating });
      } else if (!existingFeedback) {
        const res = await createFeedback({ storyId, comment: feedbackText, rating });
        setExistingFeedback(res.data?.data);
      }
      setIsEditing(false);
      await loadMyFeedback();
    } catch (err) {
      setError("Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFeedback(existingFeedback._id);
      setExistingFeedback(null);
      setFeedbackText("");
      setRating(5);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to delete feedback.");
    }
  };

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-gray-400 backdrop-blur-md shadow-xl transition-all duration-300 ">
      {/* Header Bar */}
      <div className=" bg-gradient-to-r from-[#ae08dc] via-[#6a0bcf] to-[#250fa0] p-3 text-white">
        <h3 className="text-lg font-medium  flex items-center gap-2">
          <span className="text-teal-400 text-3xl">★</span> 
          {existingFeedback && !isEditing ? "Your Review" : "Rate your Experience"}
        </h3>
      </div>

      <div className="p-6">
        {/* RATING STARS */}
        <div className="flex items-center gap-1 mb-6">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              disabled={existingFeedback && !isEditing}
              className={`text-2xl transition-all duration-200 ${
                rating >= num ? "text-purple-700 scale-110" : "text-gray-700 hover:text-gray-500"
              } ${existingFeedback && !isEditing ? "cursor-default" : "cursor-pointer hover:scale-125"}`}
            >
              ★
            </button>
          ))}
          <span className="ml-3 text-md font-mono text-black ">({rating}/5)</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              className={`w-full bg-gray-300/50 border rounded-xl p-4  placeholder-gray-700 outline-none transition-all duration-300 ${
                isEditing || !existingFeedback ? "border-gray-300   focus:border-teal-400 ring-1 ring-transparent " : "border-transparent italic text-gray-700"
              }`}
              rows="3"
              placeholder="Leave a comment about the story generation..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              disabled={existingFeedback && !isEditing}
              required
            />
          </div>

          {error && <p className="text-red-400 text-xs animate-pulse">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            {!existingFeedback && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative px-6 py-2 bg-gradient-to-r from-[#ae08dc] via-[#6a0bcf] to-[#250fa0] text-white hover:scale-105 transition-all font-bold rounded-full overflow-hidden transition-all active:scale-95"
              >
                <span className="relative z-10">{isSubmitting ? "Submitting..." : "Post Review"}</span>
              </button>
            )}

            {existingFeedback && !isEditing && (
              <div className="flex gap-2 w-full justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Feedback submitted successfully</span>
                <div className="flex gap-2">
                    <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-md font-semibold text-green-500 hover:text-green-400  transition-colors px-3 py-1"
                    >
                    Edit
                    </button>
                    <button
                    type="button"
                    onClick={handleDelete}
                    className="text-md font-semibold text-red-600 hover:text-red-500 transition-colors px-3 py-1"
                    >
                    Delete
                    </button>
                </div>
              </div>
            )}

            {existingFeedback && isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFeedbackText(existingFeedback.comment);
                    setRating(existingFeedback.rating);
                  }}
                  className="px-5 py-2 text-black hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2  bg-amber-400 text-black  rounded-full hover:bg-amber-500 transition-all hover:scale-105 transition-all active:scale-95"
                >
                  {isSubmitting ? "Saving..." : "Update"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}