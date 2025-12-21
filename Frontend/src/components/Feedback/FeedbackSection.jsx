import React, { useEffect, useState } from "react";
import {
  createFeedback,
  getMyFeedback,
  updateFeedback,
  deleteFeedback,
} from "../../services/feedbackServices";
import { RiFeedbackFill } from "react-icons/ri";
import {
  Star,
  X,
  Edit3,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Send,
  Loader2
} from "lucide-react";

export default function FeedbackSection({ storyId }) {
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  /* ---------------- LOAD FEEDBACK ---------------- */
  useEffect(() => {
    if (storyId && isVisible) {
      loadMyFeedback();
    }
    // When closing the panel, reset success state so it's fresh for next time
    if (!isVisible) {
      setSubmittedSuccess(false);
    }
  }, [storyId, isVisible]);

  const loadMyFeedback = async () => {
    setIsLoading(true);
    try {
      const res = await getMyFeedback();
      const myFeedback = res.data?.data?.find(
        (f) => f.storyId === storyId || f.storyId?._id === storyId
      );

      if (myFeedback) {
        setExistingFeedback(myFeedback);
        setFeedbackText(myFeedback.comment);
        setRating(myFeedback.rating);
      } else {
        resetForm();
      }
    } catch (err) {
      console.error("Failed to load feedback", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setExistingFeedback(null);
    setFeedbackText("");
    setRating(5);
    setIsEditing(false);
    setSubmittedSuccess(false);
  };

  /* ---------------- ACTIONS ---------------- */
  const handleDelete = async () => {
    if (!window.confirm("Delete your review permanently?")) return;
    try {
      await deleteFeedback(existingFeedback._id);
      resetForm();
      setIsVisible(false);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    try {
      if (existingFeedback && isEditing) {
        await updateFeedback(existingFeedback._id, {
          comment: feedbackText,
          rating,
        });
      } else if (!existingFeedback) {
        const res = await createFeedback({
          storyId,
          comment: feedbackText,
          rating,
        });
        setExistingFeedback(res.data?.data);
      }

      setIsEditing(false);
      setSubmittedSuccess(true);
      
      // Refresh data and hide success message after 2.5s
      await loadMyFeedback();
      setTimeout(() => setSubmittedSuccess(false), 2500);
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 font-sans">
      {isVisible && (
        <div className="w-[90vw] md:w-[400px] rounded-[2.5rem] bg-[#0a0c10]/95 backdrop-blur-3xl border border-white/10 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <RiFeedbackFill className="text-indigo-400" size={18} />
              <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
                {existingFeedback ? (isEditing ? "Editing Review" : "Your Review") : "Rate Narrative"}
              </h3>
            </div>
            <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X size={18} className="text-slate-400 hover:text-white" />
            </button>
          </div>

          <div className="p-8">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="text-indigo-500 animate-spin" size={30} />
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Loading...</p>
              </div>
            ) : submittedSuccess ? (
              <div className="py-12 text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <CheckCircle2 size={32} className="text-green-400" />
                </div>
                <p className="text-white font-bold text-lg">Transmission Received</p>
                <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest">Synced with Cloud</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Star Rating */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        onMouseEnter={() => (!existingFeedback || isEditing) && setHoverRating(num)}
                        onMouseLeave={() => setHoverRating(0)}
                        disabled={existingFeedback && !isEditing}
                        className="active:scale-90 transition-transform disabled:opacity-100"
                      >
                        <Star
                          size={32}
                          className={`${
                            (hoverRating || rating) >= num ? "text-yellow-400 fill-yellow-400" : "text-white/10"
                          } transition-all duration-200`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  disabled={existingFeedback && !isEditing}
                  className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-indigo-500/50 resize-none transition-all disabled:opacity-50"
                  placeholder="Share your thoughts..."
                />

                {/* Actions */}
                <div className="pt-2">
                  {(!existingFeedback || isEditing) ? (
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || !feedbackText.trim()}
                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-30"
                      >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={14} /> Confirm</>}
                      </button>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            loadMyFeedback(); // Revert to original
                          }}
                          className="px-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10"
                        >
                          <RotateCcw size={18} className="text-slate-400" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmittedSuccess(false); // CRITICAL: Reset success state here
                          setIsEditing(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                      >
                        <Edit3 size={14} className="text-indigo-400" /> 
                        Edit Entry
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-2xl ${
          isVisible ? "bg-white text-black rotate-90 scale-90" : "bg-gradient-to-br from-indigo-600 to-purple-700 text-white"
        }`}
      >
        {isVisible ? <X size={24} /> : <RiFeedbackFill size={26} />}
      </button>
    </div>
  );
}