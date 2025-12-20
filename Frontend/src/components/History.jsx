import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ExternalLink, Clock, MapPin, Sparkles } from "lucide-react"; // Using Lucide for a premium feel
import api from "../services/api";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history");
      setHistory(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent navigation if clicking delete
    if (!window.confirm("Are you sure you want to remove this from your history?")) return;

    try {
      await api.delete(`/history/${id}`);
      setHistory((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium">Loading your journey...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Story History</h2>
          <p className="text-gray-500 mt-1">Review and manage your past AI adventures</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-full">
           <p className="text-blue-700 text-sm font-semibold">{history.length} Stories</p>
        </div>
      </header>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No history items yet. Start creating!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {history.map((item) => (
            <div
              key={item._id}
              onClick={() => item.storyId && navigate(`/stories/${item.storyId._id}`)}
              className="group relative flex flex-col md:flex-row gap-6 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
            >
              {/* Profile/Time Section */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:w-32 shrink-0">
                <img
                  src={item.userId?.avatar}
                  alt="avatar"
                  className="w-12 h-12 rounded-full ring-4 ring-gray-50 object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Main Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                    {item.storyId?.destination || "Unknown Destination"}
                  </h3>
                  <button
                    onClick={(e) => handleDelete(item._id, e)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4 text-sm">
                   <InfoBadge icon={<Sparkles size={14}/>} text={item.storyId?.mood} />
                   <InfoBadge icon={<Clock size={14}/>} text={item.storyId?.duration} />
                   <InfoBadge icon={<MapPin size={14}/>} text={item.storyId?.language} />
                </div>

                {item.storyId?.storyText && (
                  <p className="text-sm text-gray-600 line-clamp-2 italic leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-gray-200">
                    "{item.storyId.storyText}"
                  </p>
                )}
              </div>
              
              {/* Floating Action Hint */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center gap-1 text-blue-600 text-xs font-bold">
                View Details <ExternalLink size={12} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InfoBadge = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 text-gray-500">
    <span className="text-gray-400">{icon}</span>
    <span className="font-medium">{text}</span>
  </div>
);

export default History;