import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, 
  XAxis, YAxis, ResponsiveContainer
} from "recharts";

import {
  Users, MessageSquare, LayoutDashboard, LogOut, ShieldAlert,
  Ban, BookOpen, CheckCircle2, TrendingUp,
  MapPin, Globe, Lock, Server, Activity, Zap
} from "lucide-react";

/* ===================== UI PRIMITIVES ===================== */

const GlassCard = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-[24px] shadow-xl overflow-hidden h-full flex flex-col ${className}`}>
    {title && (
      <div className="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/20">
        <div className="flex items-center gap-3">
          {Icon && <Icon size={16} className="text-indigo-400" />}
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {title}
          </h3>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1] animate-pulse" />
      </div>
    )}
    <div className="p-6 flex-1">{children}</div>
  </div>
);

const StatPill = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl px-5 py-4 hover:border-indigo-500/30 transition-all group">
    <div className={`p-3 rounded-xl bg-slate-950/60 ${color} group-hover:scale-110 transition-transform shadow-lg`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black mb-0.5">
        {label}
      </p>
      <p className="text-2xl font-black text-white leading-none">{value}</p>
    </div>
  </div>
);

const Badge = ({ children, variant = "gray" }) => {
  const map = {
    green: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    red: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    yellow: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    blue: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    gray: "bg-slate-700/40 text-slate-400 border border-slate-600/20",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${map[variant]}`}>
      {children}
    </span>
  );
};

const ActionBtn = ({ icon: Icon, children, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
      danger
        ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
    }`}
  >
    <Icon size={12} />
    {children}
  </button>
);

/* ===================== MAIN COMPONENT ===================== */

export default function AdminPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  const [userSummary, setUserSummary] = useState([]); 
  const [feedbacks, setFeedbacks] = useState([]);
  const [stories, setStories] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e"];

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
      const [f, s, summary] = await Promise.all([
        api.get("/admin/feedback", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/stories/admin/all", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/stories/admin/user-summary", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setFeedbacks(f.data.data || []);
      setStories(s.data.data || []);
      setUserSummary(summary.data.data || []); 
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to sync admin core", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/ban`, {}, { headers: { Authorization: `Bearer ${token}` } });
      loadData();
    } catch (err) {
      Swal.fire("Restriction Error", "Action could not be processed", "error");
    }
  };

  const userStats = useMemo(() => [
    { name: "Active", value: userSummary.filter((u) => !u.userDetails?.isBanned).length },
    { name: "Banned", value: userSummary.filter((u) => u.userDetails?.isBanned).length },
  ], [userSummary]);

  const visibilityStats = useMemo(() => [
    { name: "Public", value: stories.filter(s => s.isPublic).length },
    { name: "Private", value: stories.filter(s => !s.isPublic).length },
  ], [stories]);

  const storiesByCity = useMemo(() => {
    return stories.reduce((acc, s) => {
      const city = s.destination || "Unknown";
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});
  }, [stories]);

  const topCities = Object.entries(storiesByCity)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentActivity = useMemo(() => {
    return [...stories]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
  }, [stories]);

  if (loading) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.3)]" />
        <span className="text-indigo-500 font-black tracking-[0.5em] text-xs uppercase animate-pulse">Initializing_Nexus_Core</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-950/60 backdrop-blur-xl border-r border-slate-900 p-8 fixed h-full z-50 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2.5 bg-indigo-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-transform hover:rotate-6">
            <ShieldAlert size={20} className="text-white" />
          </div>
          <h2 className="text-white font-black tracking-tighter text-xl uppercase italic">
            Journey Ai <span className="text-indigo-500">ADMIN</span>
          </h2>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            ["dashboard", LayoutDashboard, "Dashboard"],
            ["users", Users, "User Management"],
            ["stories", BookOpen, "Story Archive"],
            ["feedback", MessageSquare, "Feedback Center"],
          ].map(([id, Icon, label]) => (
            <div
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl cursor-pointer transition-all font-bold text-[10px] uppercase tracking-widest group ${
                tab === id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Icon size={16} className={tab === id ? "text-white" : "group-hover:text-indigo-400"} /> 
              {label}
            </div>
          ))}
        </nav>

        <button
          onClick={() => { localStorage.clear(); navigate("/login"); }}
          className="mt-auto flex items-center justify-center gap-3 text-rose-500 font-black text-[10px] uppercase tracking-widest border border-rose-500/20 py-4 rounded-2xl hover:bg-rose-500/10 transition-all active:scale-95"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-72 p-10 space-y-10 overflow-y-auto h-screen custom-scrollbar relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />
        
        {/* TOP NAV / HEADER */}
        <div className="flex flex-wrap gap-8 justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">System Operational</p>
            </div>
            <h1 className="text-6xl font-black tracking-tighter capitalize text-white italic uppercase">
              {tab === "users" ? "Registry" : tab}
            </h1>
          </div>

          <div className="flex gap-4">
            <StatPill icon={Users} label="Total Nodes" value={userSummary.length} color="text-indigo-400" />
            <StatPill icon={BookOpen} label="Content Logs" value={stories.length} color="text-emerald-400" />
          </div>
        </div>

        {/* DASHBOARD VIEW */}
        {tab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <GlassCard title="User Security" icon={ShieldAlert}>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={userStats} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={8} stroke="none">
                        {userStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard title="Content Visibility" icon={Globe}>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={visibilityStats} dataKey="value" innerRadius={0} outerRadius={80} stroke="none">
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard title="Destination Reach" icon={MapPin}>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topCities}>
                      <Bar dataKey="count" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={35} />
                      <Tooltip cursor={{fill: 'rgba(99,102,241,0.05)'}} contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <GlassCard title="Recent Story Uploads" icon={Activity}>
                    <div className="space-y-4">
                        {recentActivity.map((s) => (
                            <div key={s._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-slate-800/40 hover:border-indigo-500/30 transition-all group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-100 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{s.title}</span>
                                    <span className="text-[10px] text-slate-500 font-medium">{s.destination}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant={s.isPublic ? "green" : "yellow"}>
                                        {s.isPublic ? "Public" : "Private"}
                                    </Badge>
                                    <span className="text-[10px] font-mono text-slate-600 font-bold">{new Date(s.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                
            </div>
          </div>
        )}

        {/* REGISTRY VIEW */}
        {tab === "users" && (
          <div className="animate-in slide-in-from-bottom-8 duration-700">
            <GlassCard title="Authorized Personnel Directory" icon={Users}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-slate-500 text-[10px] uppercase font-black tracking-[0.3em] border-b border-slate-800/50">
                      <th className="pb-6 pl-2">Identity</th>
                      <th className="pb-6 text-center">Count Stories</th>
                      <th className="pb-6 text-center">Exposure</th>
                      <th className="pb-6 text-right pr-4">Account Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userSummary.map((item) => (
                      <tr key={item._id} className="group border-b border-slate-800/30 last:border-none hover:bg-slate-800/20 transition-all">
                        <td className="py-6 pl-2">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                                <img 
                                    src={item.userDetails?.avatar || `https://ui-avatars.com/api/?name=${item.userDetails?.fullName || 'User'}&background=6366f1&color=fff`} 
                                    alt="avatar" 
                                    className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-800 group-hover:border-indigo-500 transition-all shadow-2xl"
                                />
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#020617] ${item.userDetails?.isBanned ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-slate-100 text-sm tracking-tight">{item.userDetails?.fullName || "Nexus_User"}</span>
                              <span className="text-[10px] text-slate-500 font-mono font-bold">{item.userDetails?.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 text-center">
                            <span className="text-lg font-black text-white">{item.totalStories}</span>
                        </td>
                        <td className="py-6">
                          <div className="flex justify-center gap-6">
                            <div className="flex flex-col items-center gap-1 group/stat" title="Public">
                              <Globe size={14} className="text-emerald-500/70 group-hover/stat:text-emerald-400 transition-colors" />
                              <span className="text-[10px] font-black text-slate-400">{item.publicCount}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 group/stat" title="Private">
                              <Lock size={14} className="text-amber-500/70 group-hover/stat:text-amber-400 transition-colors" />
                              <span className="text-[10px] font-black text-slate-400">{item.privateCount}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 text-right pr-4">
                          <div className="flex justify-end items-center gap-4">
                            {item.userDetails?.isBanned && <Badge variant="red">Restricted</Badge>}
                            <ActionBtn
                              icon={item.userDetails?.isBanned ? CheckCircle2 : Ban}
                              danger={!item.userDetails?.isBanned}
                              onClick={() => toggleBan(item._id)}
                            >
                              {item.userDetails?.isBanned ? "Reinstate" : "Suspend"}
                            </ActionBtn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        )}

        {/* FEEDBACK VIEW */}
        {tab === "feedback" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {feedbacks.length > 0 ? feedbacks.map((f) => (
              <div key={f._id} className="p-8 rounded-[32px] border border-slate-800 bg-slate-900/40 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                <div className="flex justify-between items-center mb-6">
                   <Badge variant="yellow">Awaiting Protocol</Badge>
                   <span className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-widest">{new Date(f.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-10 italic font-medium">"{f.comment}"</p>
                <div className="flex gap-4">
                  <button className="flex-1 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95">Send Response</button>
                  <button className="px-8 py-4 rounded-2xl bg-slate-800 hover:text-rose-500 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95">Archive</button>
                </div>
              </div>
            )) : (
                <div className="flex flex-col items-center justify-center py-40 opacity-20">
                    <MessageSquare size={80} className="mb-4 text-indigo-500" />
                    <span className="font-black uppercase tracking-[0.5em] text-xs">No Signal Detected</span>
                </div>
            )}
          </div>
        )}

        {/* ARCHIVE VIEW */}
        {tab === "stories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in zoom-in-95 duration-500">
            {Object.entries(storiesByCity).map(([name, count]) => (
              <div key={name} className="bg-slate-900/40 border border-slate-800/60 p-10 rounded-[40px] hover:border-indigo-500/50 transition-all group relative overflow-hidden">
                <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                    <MapPin size={80} className="text-indigo-500" />
                </div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <h4 className="font-black text-3xl text-white tracking-tighter uppercase italic">{name}</h4>
                  <Badge variant="blue">{count} Nodes</Badge>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden relative z-10">
                  <div className="bg-indigo-500 h-full transition-all duration-1000 shadow-[0_0_10px_#6366f1]" style={{ width: `${(count / stories.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}