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
import { 
  Users, 
  MessageSquare, 
  LayoutDashboard, 
  LogOut, 
  ShieldAlert, 
  CheckCircle, 
  Trash2, 
  Reply,
  Ban
} from "lucide-react";

// Modern Dark Card Component
const Card = ({ children, title, icon: Icon, className = "" }) => (
  <div className={`bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 shadow-xl overflow-hidden transition-all hover:border-slate-700 ${className}`}>
    {title && (
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm uppercase tracking-wider">
          {Icon && <Icon size={18} className="text-indigo-400" />}
          {title}
        </h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const Badge = ({ children, variant = "gray" }) => {
  const styles = {
    green: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    red: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    yellow: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    blue: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    gray: "bg-slate-700/50 text-slate-400 border border-slate-600/50",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${styles[variant]}`}>
      {children}
    </span>
  );
};

const IconButton = ({ children, onClick, variant = "primary", icon: Icon }) => {
  const base = "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95";
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20",
    secondary: "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700",
    danger: "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20",
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  const COLORS = ["#10b981", "#f59e0b", "#f43f5e"];

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "You will be redirected to the login page.",
      icon: "question",
      background: "#0f172a",
      color: "#f8fafc",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#334155",
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load admin data.",
        background: "#0f172a",
        color: "#f8fafc"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/ban`, {}, {
        headers: { Authorization: `Bearer ${token}` },
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
      Swal.fire("Error", "Failed to toggle status", "error");
    }
  };

  const respondFeedback = async (id) => {
    const { value: text } = await Swal.fire({
      title: "Feedback Response",
      input: "textarea",
      background: "#0f172a",
      color: "#f8fafc",
      inputPlaceholder: "Type your response here...",
      showCancelButton: true,
      confirmButtonText: 'Send Response',
      confirmButtonColor: '#6366f1'
    });

    if (text) {
      try {
        await api.patch(`/admin/feedback/${id}/respond`, { response: text, status: "reviewed" }, { headers: { Authorization: `Bearer ${token}` } });
        loadData();
      } catch (error) {
        Swal.fire("Error", "Failed to send response", "error");
      }
    }
  };

  const deleteFeedback = async (id) => {
    const result = await Swal.fire({
      title: "Delete Feedback?",
      icon: "warning",
      background: "#0f172a",
      color: "#f8fafc",
      showCancelButton: true,
      confirmButtonColor: "#f43f5e",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/feedback/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        loadData();
      } catch (error) {
        Swal.fire("Error", "Deletion failed", "error");
      }
    }
  };

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
    <div className="flex h-screen items-center justify-center bg-[#0f172a]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-950 border-r border-slate-900 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <h2 className="text-white text-2xl font-black tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <ShieldAlert size={18} />
            </div>
            JOURNEY <span className="text-indigo-500">AI</span>
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <div className="bg-indigo-600/10 text-indigo-400 flex items-center gap-3 p-3 rounded-2xl cursor-pointer">
            <LayoutDashboard size={20} />
            <span className="font-bold">Dashboard</span>
          </div>
          <div className="hover:bg-slate-900 hover:text-white flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all text-slate-500">
            <Users size={20} />
            <span>Users</span>
          </div>
          <div className="hover:bg-slate-900 hover:text-white flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all text-slate-500">
            <MessageSquare size={20} />
            <span>Feedback</span>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-900">
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-2xl border border-slate-800 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/10">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black">Admin</p>
            </div>
          </div>

          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all font-bold group">
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight italic">System Overview</h1>
          <p className="text-slate-500 mt-2 font-medium">Welcome back, Administrator.</p>
        </header>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users size={64} className="text-indigo-400" />
            </div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Total Users</p>
            <p className="text-5xl font-black text-white mt-4 tracking-tighter">{users.length}</p>
          </Card>
          <Card className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <MessageSquare size={64} className="text-amber-400" />
            </div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Pending Feedback</p>
            <p className="text-5xl font-black text-white mt-4 tracking-tighter">
              {feedbacks.filter(f => f.status === "pending").length}
            </p>
          </Card>
        </div>

        {/* SECTION: USERS */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card className="lg:col-span-2" title="User Management" icon={Users}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-800">
                    <th className="pb-4">Email Address</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {users.map((u) => (
                    <tr key={u._id} className="group hover:bg-slate-800/30 transition-colors">
                      <td className="py-5 font-semibold text-slate-300 text-sm">{u.email}</td>
                      <td className="py-5">
                        {u.isBanned ? <Badge variant="red">Banned</Badge> : u.accountStatus === "active" ? <Badge variant="green">Active</Badge> : <Badge variant="gray">Inactive</Badge>}
                      </td>
                      <td className="py-5 text-right flex justify-end gap-2">
                        <IconButton onClick={() => toggleBan(u._id)} variant={u.isBanned ? "secondary" : "danger"} icon={Ban}>
                          {u.isBanned ? "Unban" : "Ban"}
                        </IconButton>
                        <IconButton variant="secondary" onClick={() => toggleStatus(u._id)} icon={CheckCircle}>
                          Swap
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Status Breakdown" icon={LayoutDashboard}>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={userChart} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                    {userChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 text-[9px] font-black text-slate-500 mt-6 tracking-widest uppercase">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Active</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Inactive</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /> Banned</span>
              </div>
            </div>
          </Card>
        </div>

        {/* SECTION: FEEDBACK */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2" title="User Feedback Queue" icon={MessageSquare}>
            <div className="space-y-4">
              {feedbacks.length === 0 && <p className="text-slate-500 italic text-sm text-center py-10">All clear! No feedback pending.</p>}
              {feedbacks.map((f) => (
                <div key={f._id} className="p-5 rounded-2xl border border-slate-800 bg-slate-800/20 hover:bg-slate-800/40 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">"{f.comment}"</p>
                    <Badge variant={f.status === "pending" ? "yellow" : "blue"}>{f.status}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <IconButton onClick={() => respondFeedback(f._id)} icon={Reply}>Reply</IconButton>
                    <IconButton variant="danger" onClick={() => deleteFeedback(f._id)} icon={Trash2} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Review Progress" icon={CheckCircle}>
            <div className="h-[300px] w-full mt-6">
              <ResponsiveContainer>
                <BarChart data={feedbackChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}