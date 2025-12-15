import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

/* -----------------------------
   SIMPLE UI COMPONENTS
-------------------------------- */
const Card = ({ children }) => (
  <div className="bg-white border rounded-lg shadow-sm">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="p-4 space-y-2">{children}</div>
);

const Button = ({ children, onClick, variant = "primary" }) => {
  let base =
    "px-4 py-2 rounded-md text-sm font-medium transition-colors";

  let styles =
    variant === "destructive"
      ? "bg-red-600 text-white hover:bg-red-700"
      : variant === "secondary"
      ? "bg-gray-200 text-black hover:bg-gray-300"
      : "bg-purple-600 text-white hover:bg-purple-700";

  return (
    <button onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
};

/* -----------------------------
   ADMIN PANEL
-------------------------------- */
export default function AdminPanel() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  /* -----------------------------
     PROTECT ADMIN ROUTE
  -------------------------------- */
  useEffect(() => {
    if (!token || !user || user.role !== "admin") {
      navigate("/login");
    } else {
      fetchFeedbacks();
    }
    // eslint-disable-next-line
  }, []);

  /* -----------------------------
     FETCH ALL FEEDBACKS
  -------------------------------- */
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/feedback", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFeedbacks(res.data.data || []);
    } catch (error) {
      Swal.fire("Error", "Failed to load feedbacks", "error");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     RESPOND TO FEEDBACK
  -------------------------------- */
  const respondFeedback = async (id) => {
    const { value: response } = await Swal.fire({
      title: "Respond to Feedback",
      input: "textarea",
      inputLabel: "Admin response",
      showCancelButton: true,
    });

    if (!response) return;

    try {
      await api.patch(
        `/admin/feedback/${id}/respond`,
        { response, status: "reviewed" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire("Success", "Response sent", "success");
      fetchFeedbacks();
    } catch (error) {
      Swal.fire("Error", "Failed to respond", "error");
    }
  };

  /* -----------------------------
     DELETE FEEDBACK
  -------------------------------- */
  const deleteFeedback = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete feedback?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/admin/feedback/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire("Deleted", "Feedback removed", "success");
      fetchFeedbacks();
    } catch (error) {
      Swal.fire("Error", "Failed to delete feedback", "error");
    }
  };

  /* -----------------------------
     LOGOUT
  -------------------------------- */
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* -----------------------------
     UI
  -------------------------------- */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="destructive" onClick={logout}>
            Logout
          </Button>
        </div>

        {loading && <p>Loading feedbacks...</p>}

        {!loading && feedbacks.length === 0 && (
          <p className="text-gray-500">No feedback available</p>
        )}

        <div className="grid gap-4">
          {feedbacks.map((fb) => (
            <Card key={fb._id}>
              <CardContent>
                <p>
                  <b>User:</b> {fb.user?.email || "N/A"}
                </p>
                <p>
                  <b>Story:</b> {fb.storyId?.destination || "N/A"}
                </p>
                <p>
                  <b>Rating:</b> {fb.rating}
                </p>
                <p>
                  <b>Comment:</b> {fb.comment}
                </p>
                <p>
                  <b>Status:</b> {fb.status || "pending"}
                </p>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    onClick={() => respondFeedback(fb._id)}
                  >
                    Respond
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteFeedback(fb._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
