import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { Pencil } from "lucide-react";

function Profile() {
  const [user, setUser] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/user/get-currentUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };
    getProfile();
  }, []);

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
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoadingAvatar(false);
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      setLoadingCover(true);
      const token = localStorage.getItem("accessToken");
      const res = await api.patch("/user/updateCoverImage", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoadingCover(false);
    }
  };

  if (!user) {
    return <div className="text-center p-10 text-gray-500">Loading profile…</div>;
  }

  return (
    <div className="min-h-screen  px-4 py-6 sm:py-10 flex justify-center">
      <div className="w-full sm:w-[95%] md:w-1/2 lg:w-1/3 xl:w-1/3 bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Hidden Inputs */}
        <input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarChange} hidden />
        <input type="file" accept="image/*" ref={coverInputRef} onChange={handleCoverChange} hidden />

        {/* Cover */}
        <div className="relative">
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-32 sm:h-40 md:h-48 object-cover"
          />

          <button
            onClick={() => coverInputRef.current.click()}
            className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow"
          >
            {loadingCover ? "..." : <Pencil size={18} />}
          </button>

          {/* Avatar */}
          <div className="absolute -bottom-12 sm:-bottom-14 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0">
            <div className="relative">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow object-cover"
              />

              <button
                onClick={() => avatarInputRef.current.click()}
                className="absolute bottom-1 right-1 bg-indigo-600 p-2 rounded-full shadow"
              >
                {loadingAvatar ? "..." : <Pencil size={14} className="text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 sm:pt-16 px-4 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold">{user.fullName}</h2>
              <p className="text-gray-500">@{user.username}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>

            <span className="self-center sm:self-start px-4 py-1 text-sm rounded-full bg-green-100 text-green-600">
              {user.accountStatus}
            </span>
          </div>

          <div className="my-6 border-t" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Username</p>
              <p className="font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-400">Full Name</p>
              <p className="font-medium">{user.fullName}</p>
            </div>
            <div>
              <p className="text-gray-400">Bio</p>
              <p className="font-medium">Hello {user.fullName} 👋</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="w-full sm:flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium">
              Update Account
            </button>

            <button className="w-full sm:flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
