import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Users, MessageSquare, LayoutDashboard, ShieldAlert,
  Activity, Zap, Send, Settings, 
  BarChart3, Globe, LogOut, Search, ChevronRight, ShieldCheck,
  Menu, X
} from "lucide-react";
import { FaUser } from "react-icons/fa";

/* ===================== HELPER: ROBUST AVATAR ===================== */
const Avatar = ({ src, name, size = "h-10 w-10" }) => {
  const [imgError, setImgError] = useState(false);
  const initials = name 
    ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) 
    : "A";

  return (
    <div className={`${size} rounded-full overflow-hidden border border-slate-700 shadow-inner flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 relative`}>
      {src && !imgError ? (
        <img src={src} alt={name} className="h-full w-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <span className="text-white font-black text-[10px] tracking-tighter">{initials}</span>
      )}
    </div>
  );
};

/* ===================== UI PRIMITIVES ===================== */
const GlassCard = ({ title, icon: Icon, children, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
    className={`bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[24px] md:rounded-[32px] overflow-hidden h-full flex flex-col ${className}`}
  >
    {title && (
      <div className="px-4 py-4 md:px-6 md:py-5 border-b border-slate-800/50 flex items-center gap-3 bg-slate-900/20">
        <div className="p-2 rounded-lg bg-indigo-500/10">
          <Icon size={16} className="text-indigo-400" />
        </div>
        <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">{title}</h3>
      </div>
    )}
    <div className="p-4 md:p-6 flex-1">{children}</div>
  </motion.div>
);

const StatCard = ({ label, value, icon: Icon, colorClass }) => (
  <div className="bg-slate-900/40 border border-slate-800/60 p-4 md:p-5 rounded-[20px] md:rounded-[24px] flex flex-col gap-3">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass} bg-opacity-10`}>
      <Icon size={16} className={colorClass.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{label}</p>
      <p className="text-lg md:text-xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
  </div>
);

/* ===================== MAIN COMPONENT ===================== */
export default function AdminPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const adminProfile = JSON.parse(localStorage.getItem("user"));

  const [userSummary, setUserSummary] = useState([]); 
  const [feedbacks, setFeedbacks] = useState([]);
  const [stories, setStories] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token || adminProfile?.role !== "admin") {
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
      Swal.fire("Nexus Error", "Could not sync data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId, isBanned) => {
    const action = isBanned ? "Unban" : "Ban";
    const result = await Swal.fire({
      title: `${action} User?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBanned ? "#10b981" : "#ef4444",
      confirmButtonText: `Yes, ${action}!`,
      background: "#0f172a",
      color: "#fff"
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/admin/users/${userId}/ban`, {}, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire("Synchronized", `User updated`, "success");
        loadData();
      } catch (err) { Swal.fire("Error", "Failed to update", "error"); }
    }
  };

  const handleSendReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      await api.patch(`/admin/feedback/${id}/respond`, { response: replyText }, { headers: { Authorization: `Bearer ${token}` } });
      Swal.fire("Sent", "Transmitted", "success");
      setReplyText(""); setActiveReplyId(null); loadData();
    } catch (err) { Swal.fire("Error", "Transmission failed", "error"); }
  };

  const filteredUsers = useMemo(() => {
    return userSummary.filter(u => {
      const name = (u.userDetails?.fullName || u.fullName || "").toLowerCase();
      return name.includes(searchQuery.toLowerCase());
    });
  }, [userSummary, searchQuery]);

  if (loading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-indigo-400 font-black tracking-[0.3em] text-[10px] uppercase">Booting_Nexus_OS</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-950/80 border-b border-slate-900 z-[60]">
        <div className="flex items-center gap-2">
          <ShieldAlert size={20} className="text-indigo-500" />
          <span className="font-black italic uppercase text-sm">Journey AI</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-900 rounded-lg">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-slate-950/95 border-r border-slate-900/50 p-6 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 flex flex-col
      `}>
        <div className="hidden md:flex items-center gap-4 mb-10 px-2">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
            <ShieldAlert size={20} className="text-white" />
          </div>
          <h2 className="text-lg font-black tracking-tighter text-white uppercase italic">Journey <span className="text-indigo-500">AI</span></h2>
        </div>

        <nav className="space-y-1.5 flex-1">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "users", icon: Users, label: "Users" },
            { id: "analytics", icon: BarChart3, label: "Analytics" },
            { id: "feedback", icon: MessageSquare, label: "Feedbacks" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-bold text-[11px] uppercase tracking-widest ${
                tab === item.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
              }`}
            >
              <item.icon size={16} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-900/80">
           <div className="flex items-center gap-3 mb-6 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
             <Avatar src={adminProfile?.avatar} name={adminProfile?.fullName} size="h-9 w-9" />
             <div className="overflow-hidden">
               <p className="text-[11px] font-black text-white uppercase truncate">{adminProfile?.fullName}</p>
               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Root Admin</p>
             </div>
           </div>
           <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="w-full py-3.5 rounded-xl border border-rose-500/20 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2">
             <LogOut size={14} /> Logout
           </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto h-[calc(100vh-64px)] md:h-screen relative custom-scrollbar">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/5 blur-[80px] md:blur-[120px] rounded-full -z-10" />

        <AnimatePresence mode="wait">
          
          {tab === "dashboard" && (
            <motion.div key="dash" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-6 md:space-y-8">
              <header>
                <h1 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter">System Overview</h1>
                <p className="text-slate-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1">Live Platform Metrics</p>
              </header>

              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
                <StatCard label="Total Users" value={userSummary.length} icon={FaUser} colorClass="bg-indigo-500/20" />
                <StatCard label="Banned" value={userSummary.filter(u => u.userDetails?.isBanned || u.isBanned).length} icon={ShieldAlert} colorClass="bg-rose-500/20" />
                <StatCard label="Active" value={userSummary.filter(u => !(u.userDetails?.isBanned || u.isBanned)).length} icon={Activity} colorClass="bg-emerald-500/20" />
                <StatCard label="Feedback" value={feedbacks.length} icon={MessageSquare} colorClass="bg-blue-500/20" />
                <StatCard label="Pending" value={feedbacks.filter(f => !f.response).length} icon={Zap} colorClass="bg-amber-500/20" />
                <StatCard label="Stories" value={stories.length} icon={Globe} colorClass="bg-purple-500/20" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <GlassCard title="Distribution" icon={Activity}>
                  <div className="h-[200px] md:h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{name:'Users', value:userSummary.length}, {name:'Stories', value:stories.length}]} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                          <Cell fill="#6366f1" stroke="none" /><Cell fill="#8b5cf6" stroke="none" />
                        </Pie>
                        <Tooltip contentStyle={{background:'#0f172a', border:'none', borderRadius:'12px', fontSize:'10px'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
                <GlassCard title="Recent stories" icon={Globe} className="lg:col-span-2">
                  <div className="space-y-2 md:space-y-3">
                    {stories.slice(0, 5).map(s => (
                      <div key={s._id} className="p-3 md:p-4 bg-slate-900/50 rounded-xl md:rounded-2xl border border-slate-800 flex justify-between items-center group hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-1 h-6 md:h-8 bg-indigo-500 rounded-full" />
                            <div className="max-w-[120px] md:max-w-none">
                                <p className="text-[10px] md:text-xs font-bold text-white uppercase truncate">{s.title}</p>
                                <p className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase">{s.destination}</p>
                            </div>
                        </div>
                        <span className="text-[8px] md:text-[9px] font-mono text-slate-600 uppercase">{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {tab === "users" && (
            <motion.div key="users" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                  <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">User Management</h2>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search nodes..." className="bg-slate-900/60 border border-slate-800 rounded-2xl py-3 pl-12 pr-6 text-xs text-white focus:border-indigo-500 outline-none w-full sm:w-64 transition-all" />
                  </div>
              </div>
              <GlassCard title="Active User Nodes" icon={Users}>
                <div className="space-y-2 md:space-y-3">
                  {filteredUsers.map(u => {
                    const isBanned = u.userDetails?.isBanned || u.isBanned;
                    const userId = u.userDetails?._id || u._id;
                    return (
                      <div key={userId} className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/20 rounded-xl md:rounded-2xl transition-all border border-transparent hover:border-slate-800">
                        <div className="flex items-center gap-3 md:gap-4">
                          <Avatar src={u.userDetails?.avatar || u.avatar} name={u.userDetails?.fullName || u.fullName} />
                          <div className="max-w-[150px] sm:max-w-none">
                            <p className="text-xs md:text-sm font-bold text-white uppercase truncate">{u.userDetails?.fullName || u.fullName || "User"}</p>
                            <p className="text-[9px] md:text-[10px] text-slate-500 font-mono italic truncate">{u.userDetails?.email || u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0 border-slate-800">
                          <div className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase flex items-center gap-2 ${isBanned ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                              <div className={`w-1 h-1 rounded-full ${isBanned ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
                              {isBanned ? 'Restricted' : 'Operational'}
                          </div>
                          <button onClick={() => handleToggleBan(userId, isBanned)} className={`p-2 rounded-lg transition-all border ${isBanned ? 'border-emerald-500/20 text-emerald-500' : 'border-rose-500/20 text-rose-500'}`}>
                            {isBanned ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {tab === "feedback" && (
            <motion.div key="fb" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-3xl mx-auto space-y-4 md:space-y-6">
              <header className="mb-6 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">Feedback Inbox</h2>
              </header>
              {feedbacks.map(f => {
                const feedbackUser = f.user || {}; 
                return (
                  <div key={f._id} className="p-5 md:p-8 bg-slate-900/40 border border-slate-800 rounded-[24px] md:rounded-[32px] hover:border-indigo-500/20 transition-all">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <div className="flex items-center gap-3">
                          <Avatar src={feedbackUser.avatar} name={feedbackUser.fullName} size="h-8 w-8 md:h-10 md:w-10" />
                          <div>
                              <p className="text-[10px] md:text-xs font-bold text-white uppercase">{feedbackUser.fullName || "User"}</p>
                              <p className="text-[8px] md:text-[9px] text-slate-500 font-mono">{new Date(f.createdAt).toLocaleDateString()}</p>
                          </div>
                      </div>
                      {!f.response && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />}
                    </div>
                    <p className="text-slate-300 text-xs md:text-sm italic leading-relaxed mb-4 md:mb-6">"{f.comment}"</p>
                    
                    {f.response ? (
                      <div className="p-4 md:p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-xl md:rounded-2xl">
                          <p className="text-[8px] md:text-[9px] font-black text-indigo-400 uppercase mb-1 md:mb-2">Response</p>
                          <p className="text-[11px] md:text-xs text-indigo-300 italic">{f.response}</p>
                      </div>
                    ) : activeReplyId === f._id ? (
                      <div className="space-y-3">
                        <textarea autoFocus className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs md:text-sm text-white focus:border-indigo-500 outline-none h-24" placeholder="Type response..." value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                        <div className="flex gap-2">
                          <button onClick={() => handleSendReply(f._id)} className="bg-indigo-600 px-6 py-2 rounded-lg text-[9px] font-black uppercase text-white">Send</button>
                          <button onClick={() => setActiveReplyId(null)} className="bg-slate-800 px-6 py-2 rounded-lg text-[9px] font-black uppercase text-slate-400">Abort</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setActiveReplyId(f._id)} className="w-full sm:w-auto bg-indigo-600/10 px-6 py-3 rounded-lg text-[9px] font-black uppercase text-indigo-400 border border-indigo-600/20 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2">
                        <Send size={12} /> Respond
                      </button>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}

          {tab === "analytics" && (
            <motion.div key="analytics" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-8">Story Analytics</h2>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {userSummary.sort((a,b) => b.totalStories - a.totalStories).map((u) => (
                    <div key={u._id || u.userDetails?._id} className="p-4 md:p-6 bg-slate-900/40 border border-slate-800 rounded-[24px] md:rounded-[32px] flex items-center justify-between">
                      <div className="flex items-center gap-3 md:gap-6">
                        <Avatar src={u.userDetails?.avatar || u.avatar} name={u.userDetails?.fullName || u.fullName} size="h-10 w-10 md:h-14 md:w-14" />
                        <div>
                          <p className="text-sm md:text-lg font-black text-white uppercase truncate max-w-[120px] md:max-w-none">{u.userDetails?.fullName || u.fullName || "Creator"}</p>
                        </div>
                      </div>
                      <div className="bg-slate-950 px-4 py-2 md:px-8 md:py-4 rounded-xl md:rounded-[24px] border border-slate-800 text-center min-w-[70px]">
                        <p className="text-xl md:text-3xl font-black text-indigo-50">{u.totalStories}</p>
                        <p className="text-[8px] text-slate-500 font-black uppercase">Tales</p>
                      </div>
                    </div>
                  ))}
                </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* CUSTOM SCROLLBAR CSS */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
}