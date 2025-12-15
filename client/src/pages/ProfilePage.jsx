import { useState } from "react";
import { useAuthStore } from "../store/useAuthstore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-base-200 to-base-100">
      <div className="max-w-2xl mx-auto p-4 py-10">
        <div className="bg-base-300 rounded-2xl p-8 shadow-xl space-y-10 border border-base-200">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-base-content">Profile</h1>
            <p className="mt-2 text-base text-zinc-500">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-36 rounded-full object-cover border-4 border-base-200 shadow-lg ring-4 ring-base-100 transition-all duration-300 group-hover:ring-primary"
                onError={(e) => {
                  e.target.src = "/avatar.png";
                  e.target.onerror = null; // Prevent infinite loop if fallback fails
                }}
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-2 right-2 
                  bg-primary hover:bg-primary-focus
                  p-2 rounded-full cursor-pointer shadow-lg
                  transition-all duration-200 border-2 border-white
                  flex items-center justify-center
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none opacity-70" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400 italic">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <div className="text-xs text-zinc-500 flex items-center gap-2 font-semibold uppercase tracking-wide">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-5 py-3 bg-base-100 rounded-lg border border-base-200 text-base font-medium text-base-content shadow-sm">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-zinc-500 flex items-center gap-2 font-semibold uppercase tracking-wide">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-5 py-3 bg-base-100 rounded-lg border border-base-200 text-base font-medium text-base-content shadow-sm">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-8 bg-base-200 rounded-xl p-6 border border-base-300 shadow-inner">
            <h2 className="text-lg font-semibold mb-4 text-base-content">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-300">
                <span className="text-zinc-500">Member Since</span>
                <span className="font-medium text-base-content">{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-500">Account Status</span>
                <span className="text-green-500 font-semibold">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;