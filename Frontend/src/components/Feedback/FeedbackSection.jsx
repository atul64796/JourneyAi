import React, { useEffect, useState } from "react";
import {
  createFeedback,
  getMyFeedback,
  updateFeedback,
  deleteFeedback,
} from "../../services/feedbackServices";
import { RiFeedbackFill } from "react-icons/ri";

export default function FeedbackSection({ storyId }) {
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // New state to control visibility
  const [isVisible, setIsVisible] = useState(false);

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
    try {
      if (existingFeedback && isEditing) {
        await updateFeedback(existingFeedback._id, { comment: feedbackText, rating });
      } else if (!existingFeedback) {
        const res = await createFeedback({ storyId, comment: feedbackText, rating });
        setExistingFeedback(res.data?.data);
      }
      setIsEditing(false);
      // Optional: hide after successful post
      // setIsVisible(false); 
      await loadMyFeedback();
    } catch (err) {
      setError("Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      
      {/* 1. THE FEEDBACK PANEL (Visible only when isVisible is true) */}
      {isVisible && (
        <div className="mb-2 w-[90vw] md:w-[450px] overflow-hidden rounded-3xl border border-white/20 bg-slate-900/95 backdrop-blur-2xl shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-gradient-to-r from-purple-600/40 to-blue-600/40 p-4 flex justify-between items-center">
            <h3 className="text-white font-bold flex items-center gap-2">
              <span className="text-yellow-400"><RiFeedbackFill /></span> 
              {existingFeedback ? "Your Review" : "Rate this Story"}
            </h3>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="flex items-center gap-2 justify-center py-2 bg-white/5 rounded-2xl">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  disabled={existingFeedback && !isEditing}
                  className={`text-3xl transition-all ${rating >= num ? "text-yellow-400" : "text-slate-700"}`}
                >
                ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full bg-slate-800/50 text-white border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-purple-500 transition-all resize-none"
              rows="3"
              placeholder="Write your feedback..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              disabled={existingFeedback && !isEditing}
              required
            />

            <div className="flex justify-end gap-2">
              {(!existingFeedback || isEditing) && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-purple-100 transition-all active:scale-95"
                >
                  {isSubmitting ? "..." : existingFeedback ? "Update" : "Post"}
                </button>
              )}
              {existingFeedback && !isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
                >
                  Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* 2. THE TRIGGER BUTTON (Floating Action Button) */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`group flex items-center gap-3 p-4 rounded-2xl shadow-2xl transition-all duration-300 active:scale-90 ${
          isVisible 
            ? "bg-slate-800 text-white rotate-90" 
            : "bg-gradient-to-br from-purple-600 to-blue-700 text-white hover:shadow-purple-500/40"
        }`}
      >
        {isVisible ? (
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        ) : (
          <>
            <span className="font-bold text-sm pl-2 group-hover:block hidden animate-in fade-in slide-in-from-right-2">Review Story</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </>
        )}
      </button>

    </div>
  );
}