import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


const Card = ({ children, title, className = "" }) => (
  <div className={`bg-gray-100 rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {title && (
      <div className="px-6 py-4 border-b border-gray-50">
        <h3 className="font-bold text-gray-700">{title}</h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const Badge = ({ children, variant = "gray" }) => {
  const styles = {
    green: "bg-emerald-200 text-emerald-700 ",
    red: "bg-rose-100 text-rose-700",
    yellow: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
};

const IconButton = ({ children, onClick, variant = "primary" }) => {
  const base = "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95";
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white",
  };
  return <button onClick={onClick} className={`${base} ${styles[variant]}`}>{children}</button>;
};


  //  ADMIN PANEL

export default function AdminPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const COLORS = ["#10b985", "#f59e0b", "#ef4444"];

  // LOGOUT LOGIC
  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "You will be redirected to the login page.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, logout"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      navigate("/login");
      return;
    }
    loadData();
    
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [uRes, fRes] = await Promise.all([
        api.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/admin/feedback", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setUsers(uRes.data.data || []);
      setFeedbacks(fRes.data.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to load admin data. Check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

 
    //  ACTION LOGIC
 

  const toggleBan = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/ban`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'User restriction updated',
        showConfirmButton: false,
        timer: 2000
      });
      loadData();
    } catch (error) {
      Swal.fire("Error", "Failed to update ban status", "error");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadData();
    } catch (error) {
      Swal.fire("Error", "Failed to toggle account status", "error");
    }
  };

  const respondFeedback = async (id) => {
    const { value: text } = await Swal.fire({
      title: "Feedback Response",
      input: "textarea",
      inputPlaceholder: "Type your response here...",
      showCancelButton: true,
      confirmButtonText: 'Send Response',
      confirmButtonColor: '#4f46e5'
    });

    if (text) {
      try {
        await api.patch(
          `/admin/feedback/${id}/respond`,
          { response: text, status: "reviewed" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("Success", "Response sent to user", "success");
        loadData();
      } catch (error) {
        Swal.fire("Error", "Failed to send response", "error");
      }
    }
  };

  const deleteFeedback = async (id) => {
    const result = await Swal.fire({
      title: "Delete Feedback?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/feedback/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        loadData();
      } catch (error) {
        Swal.fire("Error", "Deletion failed", "error");
      }
    }
  };

  
    //  CHART COMPUTATIONS
 
  const userChart = useMemo(() => [
    { name: "Active", value: users.filter(u => u.accountStatus === "active" && !u.isBanned).length },
    { name: "Inactive", value: users.filter(u => u.accountStatus === "deactivated").length },
    { name: "Banned", value: users.filter(u => u.isBanned).length },
  ], [users]);

  const feedbackChart = useMemo(() => [
    { name: "Pending", count: feedbacks.filter(f => f.status === "pending").length },
    { name: "Reviewed", count: feedbacks.filter(f => f.status === "reviewed").length },
  ], [feedbacks]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* SIDEBAR */}
     {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="p-8">
          <h2 className="text-white text-2xl font-black tracking-tight">JOURNEY <span className="text-indigo-400">AI</span></h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <div className="bg-indigo-600/10 text-indigo-400 flex items-center p-3 rounded-xl cursor-pointer">
            <span className="font-bold">Dashboard</span>
          </div>
          <div className="hover:bg-slate-800 hover:text-white flex items-center p-3 rounded-xl cursor-pointer transition-colors">
            <span>Users Management</span>
          </div>
          <div className="hover:bg-slate-800 hover:text-white flex items-center p-3 rounded-xl cursor-pointer transition-colors">
            <span>Feedback</span>
          </div>
        </nav>

        {/* BOTTOM SECTION: ADMIN ACCOUNT & LOGOUT */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          {/* Admin Account Info */}
          <div className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] text-slate-500 truncate uppercase tracking-widest">Administrator</p>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-semibold group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 transition-transform group-hover:translate-x-1" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">System overview and management panel.</p>
          </div>
          <Badge variant="blue">Admin: {user?.email}</Badge>
        </header>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="border-l-5 border-l-indigo-500">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
            <p className="text-4xl font-black text-slate-800 mt-2">{users.length}</p>
          </Card>
          <Card className="border-l-5 border-l-amber-500">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Feedback</p>
            <p className="text-4xl font-black text-slate-800 mt-2">
              {feedbacks.filter(f => f.status === "pending").length}
            </p>
          </Card>
        </div>

        {/* USER SECTION */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10 ">
          <Card className="lg:col-span-2 " title="User Management" >
            <div className="overflow-x-auto ">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase font-bold border-b border-gray-50">
                    <th className="pb-4">Email Address</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-medium text-slate-700">{u.email}</td>
                      <td className="py-4">
                        {u.isBanned ? (
                          <Badge variant="red">Banned</Badge>
                        ) : u.accountStatus === "active" ? (
                          <Badge variant="green">Active</Badge>
                        ) : (
                          <Badge variant="gray">Inactive</Badge>
                        )}
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <IconButton onClick={() => toggleBan(u._id)} variant={u.isBanned ? "secondary" : "danger"}>
                          {u.isBanned ? "Unban" : "Ban"}
                        </IconButton>
                        <IconButton variant="secondary" onClick={() => toggleStatus(u._id)}>
                          Toggle Status
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Status Breakdown">
            <div className="h-[200px] w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={userChart} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {userChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold text-slate-500 mt-4">
                 <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> ACTIVE</div>
                 <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> INACTIVE</div>
                 <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> BANNED</div>
              </div>
            </div>
          </Card>
        </div>

        {/* FEEDBACK SECTION */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2" title="User Feedback Queue">
            <div className="space-y-4">
              {feedbacks.length === 0 && <p className="text-slate-400 italic">No feedback entries found.</p>}
              {feedbacks.map((f) => (
                <div key={f._id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <p className="text-slate-700 text-sm">{f.comment}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant={f.status === "pending" ? "yellow" : "blue"}>{f.status.toUpperCase()}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <IconButton onClick={() => respondFeedback(f._id)}>Respond</IconButton>
                    <IconButton variant="danger" onClick={() => deleteFeedback(f._id)}>Delete</IconButton>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Review Progress">
            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart data={feedbackChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}