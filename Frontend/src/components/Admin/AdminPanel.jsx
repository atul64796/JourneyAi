import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from "recharts";
import {
  Users, MessageSquare, LayoutDashboard, ShieldAlert,
  Activity, Zap, Send, Settings, 
  BarChart3, Globe, LogOut, Search, ChevronRight, ShieldCheck
} from "lucide-react";

/* ===================== HELPER: ROBUST AVATAR ===================== */
const Avatar = ({ src, name, size = "h-10 w-10" }) => {
  const [imgError, setImgError] = useState(false);
  const initials = name 
    ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) 
    : "??"

  return (
    <div className={`${size} rounded-full overflow-hidden border border-slate-700 shadow-inner flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 relative`}>
      {src && !imgError ? (
        <img 
          src={src} 
          alt={name} 
          className="h-full w-full object-cover"
          onError={() => setImgError(true)} 
        />
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
    className={`bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[32px] overflow-hidden h-full flex flex-col ${className}`}
  >
    {title && (
      <div className="px-6 py-5 border-b border-slate-800/50 flex items-center gap-3 bg-slate-900/20">
        <div className="p-2 rounded-lg bg-indigo-500/10">
          <Icon size={18} className="text-indigo-400" />
        </div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">{title}</h3>
      </div>
    )}
    <div className="p-6 flex-1">{children}</div>
  </motion.div>
);

const StatCard = ({ label, value, icon: Icon, colorClass }) => (
  <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-[24px] flex flex-col gap-3">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass} bg-opacity-10`}>
      <Icon size={16} className={colorClass.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{label}</p>
      <p className="text-xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
  </div>
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
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
      Swal.fire("Nexus Error", "Could not sync data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId, isBanned) => {
    const action = isBanned ? "Unban" : "Ban";
    const result = await Swal.fire({
      title: `${action} User?`,
      text: `Are you sure you want to ${action.toLowerCase()} this entity?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBanned ? "#10b981" : "#ef4444",
      confirmButtonText: `Yes, ${action}!`,
      background: "#0f172a",
      color: "#fff"
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/admin/users/${userId}/ban`, {}, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        Swal.fire("Synchronized", `User status updated to ${action}ned`, "success");
        loadData();
      } catch (err) {
        Swal.fire("Error", "Kernel rejection: Failed to update status", "error");
      }
    }
  };

  const handleSendReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      await api.patch(`/admin/feedback/${id}/respond`, { response: replyText }, { headers: { Authorization: `Bearer ${token}` } });
      Swal.fire("Sent", "Feedback response transmitted", "success");
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
    <div className="min-h-screen bg-[#020617] text-slate-200 flex overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-950/40 border-r border-slate-900/50 p-6 fixed h-full z-50 flex flex-col">
        <div className="flex items-center gap-4 mb-10 px-2">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
            <ShieldAlert size={20} className="text-white" />
          </div>
          <h2 className="text-lg font-black tracking-tighter text-white uppercase italic">Journey <span className="text-indigo-500">AI</span></h2>
        </div>

        <nav className="space-y-1.5 flex-1">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "users", icon: Users, label: "User Management" },
            { id: "analytics", icon: BarChart3, label: "Story Analytics" },
            { id: "feedback", icon: MessageSquare, label: "Feedbacks" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
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
             <Avatar src={user?.avatar} name={user?.fullName} size="h-9 w-9" />
             <div className="overflow-hidden">
               <p className="text-[11px] font-black text-white uppercase truncate">{user?.fullName}</p>
               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Root Admin</p>
             </div>
           </div>
           <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="w-full py-3.5 rounded-xl border border-rose-500/20 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2">
             <LogOut size={14} /> Logout
           </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 ml-72 p-10 overflow-y-auto h-screen relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />

        <AnimatePresence mode="wait">
          
          {/* 1. DASHBOARD */}
          {tab === "dashboard" && (
            <motion.div key="dash" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-8">
              <header>
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">System Overview</h1>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Live Platform Metrics</p>
              </header>

              {/* QUICK STATS HUD */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard 
                  label="Total Users" 
                  value={userSummary.length} 
                  icon={Users} 
                  colorClass="bg-indigo-500" 
                />
                <StatCard 
                  label="Banned" 
                  value={userSummary.filter(u => u.userDetails?.isBanned || u.isBanned).length} 
                  icon={ShieldAlert} 
                  colorClass="bg-rose-500" 
                />
                <StatCard 
                  label="Active Units" 
                  value={userSummary.filter(u => !(u.userDetails?.isBanned || u.isBanned)).length} 
                  icon={Activity} 
                  colorClass="bg-emerald-500" 
                />
                <StatCard 
                  label="Feedback" 
                  value={feedbacks.length} 
                  icon={MessageSquare} 
                  colorClass="bg-blue-500" 
                />
                <StatCard 
                  label="Pending" 
                  value={feedbacks.filter(f => !f.adminResponse).length} 
                  icon={Zap} 
                  colorClass="bg-amber-500" 
                />
                <StatCard 
                  label="Stories" 
                  value={stories.length} 
                  icon={Globe} 
                  colorClass="bg-purple-500" 
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <GlassCard title="Entity Distribution" icon={Activity}>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{name:'Users', value:userSummary.length}, {name:'Stories', value:stories.length}]} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          <Cell fill="#6366f1" stroke="none" /><Cell fill="#8b5cf6" stroke="none" />
                        </Pie>
                        <Tooltip contentStyle={{background:'#0f172a', border:'none', borderRadius:'12px', fontSize:'10px'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
                
                <GlassCard title="Recent Transmissions" icon={Globe} className="lg:col-span-2">
                  <div className="space-y-3">
                    {stories.slice(0, 5).map(s => (
                      <div key={s._id} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex justify-between items-center group hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-1 h-8 bg-indigo-500 rounded-full" />
                            <div>
                                <p className="text-xs font-bold text-white uppercase">{s.title}</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase">{s.destination}</p>
                            </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-600 uppercase">{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {/* 2. USER MANAGEMENT */}
          {tab === "users" && (
            <motion.div key="users" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Registry Management</h2>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter by Name/ID..." 
                        className="bg-slate-900/60 border border-slate-800 rounded-2xl py-3 pl-12 pr-6 text-xs text-white focus:border-indigo-500 outline-none w-72 transition-all"
                    />
                  </div>
              </div>

              <GlassCard title="Active User Nodes" icon={Users}>
                <div className="space-y-3">
                  {filteredUsers.map(u => {
                    const isBanned = u.userDetails?.isBanned || u.isBanned;
                    const userId = u.userDetails?._id || u._id;
                    return (
                      <div key={userId} className="p-4 flex items-center justify-between hover:bg-slate-800/20 rounded-2xl transition-all border border-transparent hover:border-slate-800">
                        <div className="flex items-center gap-4">
                          <Avatar src={u.userDetails?.avatar || u.avatar} name={u.userDetails?.fullName || u.fullName} />
                          <div>
                            <p className="text-sm font-bold text-white uppercase">{u.userDetails?.fullName || u.fullName || "Journey Ai"}</p>
                            <p className="text-[10px] text-slate-500 font-mono italic">{u.userDetails?.email || u.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase flex items-center gap-2 ${isBanned ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                              <div className={`w-1 h-1 rounded-full ${isBanned ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
                              {isBanned ? 'Restricted' : 'Operational'}
                          </div>
                          
                          <div className="flex gap-2">
                             <button 
                                onClick={() => handleToggleBan(userId, isBanned)}
                                className={`p-2 rounded-lg transition-all border ${isBanned ? 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white'}`}
                                title={isBanned ? "Lift Ban" : "Ban User"}
                             >
                                {isBanned ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                             </button>
                             <button className="p-2 rounded-lg border border-slate-800 text-slate-500 hover:bg-slate-800 transition-all">
                                <ChevronRight size={16} />
                             </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* 3. STORY ANALYTICS */}
          {tab === "analytics" && (
            <motion.div key="analytics" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Story Analytics</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {filteredUsers.sort((a,b) => b.totalStories - a.totalStories).map((u) => (
                    <motion.div 
                        whileHover={{ y: -5 }}
                        key={u._id || u.userDetails?._id} 
                        className="p-6 bg-slate-900/40 border border-slate-800 rounded-[32px] flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-6">
                        <Avatar src={u.userDetails?.avatar || u.avatar} name={u.userDetails?.fullName || u.fullName} size="h-14 w-14" />
                        <div>
                          <p className="text-lg font-black text-white uppercase group-hover:text-indigo-400 transition-colors">
                            {u.userDetails?.fullName || u.fullName || "Anonymous"}
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Creator Hub Activity</p>
                        </div>
                      </div>
                      <div className="bg-slate-950 px-8 py-4 rounded-[24px] border border-slate-800 text-center min-w-[120px]">
                        <p className="text-3xl font-black text-indigo-500 leading-none">{u.totalStories}</p>
                        <p className="text-[9px] text-slate-500 font-black uppercase mt-2 tracking-widest">Stories</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
            </motion.div>
          )}

          {/* 4. FEEDBACKS */}
          {tab === "feedback" && (
            <motion.div key="fb" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-3xl mx-auto space-y-6">
              <header className="mb-10">
                <h2 className="text-3xl font-black text-white uppercase italic">Feedback Inbox</h2>
              </header>

              {feedbacks.map(f => (
                <div key={f._id} className="p-8 bg-slate-900/40 border border-slate-800 rounded-[32px] hover:border-indigo-500/20 transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Avatar name={f.userId?.fullName} size="h-10 w-10" />
                        <div>
                            <p className="text-xs font-bold text-white uppercase">{f.userId?.fullName || "Guest"}</p>
                            <p className="text-[9px] text-slate-500 font-mono">{new Date(f.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                    {!f.adminResponse && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />}
                  </div>
                  
                  <p className="text-slate-300 text-sm italic leading-relaxed mb-6">"{f.comment}"</p>
                  
                  {f.adminResponse ? (
                    <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
                        <p className="text-[9px] font-black text-indigo-400 uppercase mb-2">System Response</p>
                        <p className="text-xs text-indigo-300 italic">{f.adminResponse}</p>
                    </div>
                  ) : activeReplyId === f._id ? (
                    <div className="space-y-4">
                      <textarea 
                        autoFocus
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm text-white focus:border-indigo-500 outline-none h-28 transition-all"
                        placeholder="Type response transmission..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleSendReply(f._id)} className="bg-indigo-600 px-8 py-3 rounded-xl text-[10px] font-black uppercase text-white hover:bg-indigo-500 transition-all">Send</button>
                        <button onClick={() => setActiveReplyId(null)} className="bg-slate-800 px-8 py-3 rounded-xl text-[10px] font-black uppercase text-slate-400">Abort</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setActiveReplyId(f._id)} className="bg-indigo-600/10 px-6 py-3 rounded-xl text-[10px] font-black uppercase text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2">
                      <Send size={14} /> Respond to User
                    </button>
                  )}
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}