import React, { useState, useEffect, useRef, useContext } from "react";
import api from "../../../services/api";
import { Camera, Mail, Shield, User, Lock, Settings2, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AvatarContext } from "../../../context/AvatarProvider";
import Swal from 'sweetalert2';

function Profile() {
  const [user, setUser] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const { updateAvatar } = useContext(AvatarContext);
  const navigate = useNavigate();

  // 1. GET USER PROFILE
  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/user/get-currentUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.data);
        updateAvatar(res.data.data.avatar);
      } catch (error) {
        console.error("Profile Fetch Error:", error.response?.data || error.message);
      }
    };
    getProfile();
  }, [updateAvatar]);

  // 2. HANDLE AVATAR CHANGE
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoadingAvatar(true);
      const token = localStorage.getItem("accessToken");
      const res = await api.patch("/user/updateAvatar", formData, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "multipart/form-data" 
        },
      });
      
      setUser(res.data.data);
      updateAvatar(res.data.data.avatar); // Update Global Context
      
      Swal.fire({ icon: 'success', title: 'Avatar Updated', background: '#0f172a', color: '#fff', timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error(err.response?.data || err.message);
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: err.response?.data?.message, background: '#0f172a', color: '#fff' });
    } finally {
      setLoadingAvatar(false);
    }
  };

  // 3. HANDLE COVER IMAGE CHANGE
  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      setLoadingCover(true);
      const token = localStorage.getItem("accessToken");
      // Note: Ensure your backend route is '/user/updateCoverImage' or update this URL
      const res = await api.patch("/user/updateCoverImage", formData, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "multipart/form-data" 
        },
      });

      setUser(res.data.data);
      Swal.fire({ icon: 'success', title: 'Cover Updated', background: '#0f172a', color: '#fff', timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error(err.response?.data || err.message);
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: err.response?.data?.message, background: '#0f172a', color: '#fff' });
    } finally {
      setLoadingCover(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-slate-300 font-sans selection:bg-indigo-500/30">
      
      {/* 1. HERO COVER SECTION */}
      <div className="relative h-[35vh] w-full overflow-hidden">
        <img 
          src={user.coverImage} 
          className={`w-full h-full object-cover transition-opacity duration-500 ${loadingCover ? 'opacity-30' : 'opacity-60'} scale-105 blur-[2px]`} 
          alt="cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
        
        <button 
          onClick={() => coverInputRef.current.click()}
          disabled={loadingCover}
          className="absolute bottom-8 right-8 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-white hover:bg-white/20 transition-all disabled:opacity-50"
        >
          {loadingCover ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14}/>}
          {loadingCover ? "Uploading..." : "Change Cover"}
        </button>
      </div>

      {/* 2. MAIN FLOATING CONTENT */}
      <div className="max-w-5xl mx-auto px-6 -mt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: IDENTITY CARD */}
          <div className="w-full lg:w-1/3">
            <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-8 text-center shadow-2xl">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    className={`w-32 h-32 mx-auto rounded-full object-cover border-4 border-[#1e293b] transition-all ${loadingAvatar ? 'brightness-50' : ''}`} 
                    alt="profile"
                  />
                  {loadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 size={24} className="text-white animate-spin" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => avatarInputRef.current.click()}
                  disabled={loadingAvatar}
                  className="absolute bottom-0 right-0 bg-indigo-500 p-2.5 rounded-full border-4 border-[#1e293b] text-white hover:scale-110 transition-transform disabled:opacity-50"
                >
                  <Camera size={16} />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">{user.fullName}</h2>
              <p className="text-indigo-400 font-medium mb-4">@{user.username}</p>
              
              <div className="flex items-center justify-center gap-2 bg-indigo-500/10 text-indigo-300 py-2 px-4 rounded-2xl text-xs font-bold border border-indigo-500/20">
                <Shield size={14}/> Verified {user.accountStatus || 'User'}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                 <button 
                  onClick={() => navigate("/updateAccount")}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                 >
                    Edit Profile
                 </button>
                 <button 
                  onClick={() => navigate("/changePassword")}
                  className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-2xl font-bold border border-white/10 transition-all"
                 >
                    Update Password
                 </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILS GRID */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileDetail label="Email Address" value={user.email} icon={<Mail size={18}/>} />
              <ProfileDetail label="Full Name" value={user.fullName} icon={<User size={18}/>} />
              <ProfileDetail label="Security Status" value="Two-Factor Enabled" icon={<Lock size={18}/>} />
              <ProfileDetail label="Member Since" value="December 2024" icon={<Sparkles size={18}/>} />
            </div>

            <div className="bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Settings2 size={18} className="text-indigo-400"/>
                About Me
              </h4>
              <p className="leading-relaxed text-slate-400 italic">
                "Hello, I'm {user.fullName}. Passionate about storytelling and digital creativity. Welcome to my personal corner of the web."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Inputs - Separate Handlers Linked Here */}
      <input 
        type="file" 
        accept="image/*" 
        ref={avatarInputRef} 
        onChange={handleAvatarChange} 
        hidden 
      />
      <input 
        type="file" 
        accept="image/*" 
        ref={coverInputRef} 
        onChange={handleCoverChange} 
        hidden 
      />
    </div>
  );
}

function ProfileDetail({ label, value, icon }) {
  return (
    <div className="group bg-slate-900/30 border border-white/5 p-6 rounded-[2rem] hover:bg-indigo-500/5 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">{label}</p>
          <p className="text-white font-medium">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;