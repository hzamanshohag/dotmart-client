"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/modules/context/UserContext";
import {
  getSingleUser,
  updateUser,
} from "@/modules/services/user/user.service";

export default function ProfileUpdatePage() {
  const { userInfo } = useUser();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // read only
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  /* ================= Fetch Profile ================= */
  const fetchProfile = async () => {
    if (!userInfo?._id) return;

    try {
      setLoading(true);
      const res = await getSingleUser(userInfo._id);
      const user = res?.data || res;

      if (!user?._id) {
        toast.error("Failed to load profile ❌");
        return;
      }

      setName(user?.name || "");
      setEmail(user?.email || "");
      setPhoneNumber(user?.phoneNumber || "");
      setPhotoUrl(user?.photoUrl || "");
    } catch (error: any) {
      toast.error(error?.message || "Failed to load profile ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?._id]);

  /* ================= Validation ================= */
  const validate = () => {
    if (!name.trim()) return toast.error("Name is required");
    if (name.trim().length < 3)
      return toast.error("Name must be at least 3 characters");

    if (!phoneNumber.trim()) return toast.error("Phone number is required");

    if (!/^[0-9]{10,15}$/.test(phoneNumber.trim()))
      return toast.error("Phone number must be 10–15 digits");

    if (photoUrl?.trim()) {
      const ok = /^(https?:\/\/).+\.(jpg|jpeg|png|webp)$/i.test(
        photoUrl.trim(),
      );
      if (!ok) return toast.error("Photo URL must be a valid image link");
    }

    return true;
  };

  /* ================= Update ================= */
  const handleUpdate = async () => {
    if (!userInfo?._id) {
      toast.error("Please login first ❌");
      return;
    }

    const ok = validate();
    if (ok !== true) return;

    try {
      setSaving(true);

      const payload = {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        photoUrl: photoUrl.trim(),
      };

      const res = await updateUser(userInfo._id, payload);

      if (res?.status || res?._id) {
        toast.success(res?.message || "Profile updated successfully ✅");
        fetchProfile();
      } else {
        toast.error(res?.message || "Update failed ❌");
      }
    } catch (error: any) {
      toast.error(error?.message || "Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      <p className="text-sm text-gray-600 mt-2">
        Update your personal information
      </p>

      {/* Loading */}
      {loading && (
        <div className="mt-6 text-sm text-gray-500 font-medium">
          Loading profile...
        </div>
      )}

      {/* Form */}
      {!loading && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full h-12 px-4 rounded-full border border-gray-300
                outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Md Hasanuzzaman Shohag"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              value={email}
              readOnly
              className="mt-2 w-full h-12 px-4 rounded-full border border-gray-200
                bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-2 w-full h-12 px-4 rounded-full border border-gray-300
                outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="017XXXXXXXX"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Photo URL
            </label>
            <input
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="mt-2 w-full h-12 px-4 rounded-full border border-gray-300
                outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="https://example.com/photo.png"
            />
          </div>

          {/* Preview */}
          <div
            className="md:col-span-2 flex items-center gap-4 rounded-2xl
            border bg-gray-50 p-4"
          >
            <div className="h-16 w-16 rounded-2xl overflow-hidden border bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  photoUrl || "https://i.ibb.co.com/1fyRdSjb/demo-user-logo.png"
                }
                alt="profile"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">
                {name || "Name"}
              </p>
              <p className="text-xs text-gray-600">{email || "Email"}</p>
              <p className="text-xs text-gray-600">
                {phoneNumber || "Phone Number"}
              </p>
            </div>
          </div>

          {/* Save */}
          <div className="md:col-span-2">
            <button
              disabled={saving}
              onClick={handleUpdate}
              className="w-full rounded-full py-3 font-semibold text-white
                bg-gradient-to-r from-blue-600 to-green-600
                hover:opacity-90 transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
