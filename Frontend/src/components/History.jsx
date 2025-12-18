import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this history?")) return;

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
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6">Story History</h2>

      {history.length === 0 && (
        <p className="text-gray-500 text-center">No history found</p>
      )}

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item._id}
            className="flex gap-4 bg-white rounded-xl shadow-sm border p-4"
          >
            {/* Avatar */}
            <img
              src={item.userId?.avatar}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover"
            />

            {/* Content */}
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {item.userId?.fullName}{" "}
                <span className="text-gray-500">generated a story</span>
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                <p>
                  <span className="font-medium">Destination:</span>{" "}
                  {item.storyId?.destination || "Removed"}
                </p>
                <p>
                  <span className="font-medium">Mood:</span>{" "}
                  {item.storyId?.mood}
                </p>
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {item.storyId?.duration}
                </p>
                <p>
                  <span className="font-medium">Language:</span>{" "}
                  {item.storyId?.language}
                </p>
              </div>

              {/* Story preview */}
              {item.storyId?.storyText && (
                <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                  <span className="font-medium">Story:</span>{" "}
                  {item.storyId.storyText}
                </p>
              )}

              <p className="text-xs text-gray-400 mt-2">
                {new Date(item.createdAt).toLocaleString()}
              </p>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                {item.storyId && (
                  <button
                    onClick={() =>
                      navigate(`/stories/${item.storyId._id}`)
                    }
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                  >
                    View Story
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-4 py-1.5 rounded-lg border border-red-500 text-red-500 text-sm hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
