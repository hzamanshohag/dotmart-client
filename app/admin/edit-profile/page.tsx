"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/modules/context/UserContext";
import {
  getSingleUser,
  updateUser,
  resetPassword,
} from "@/modules/services/user/user.service";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "profile" | "password";

// ─── Eye Toggle Icon ──────────────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ─── Password Field ───────────────────────────────────────────────────────────

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder: string;
  hint?: React.ReactNode;
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
  hint,
}: PasswordFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-2">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 px-4 pr-12 rounded-full border border-gray-300
            outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Toggle visibility"
        >
          <EyeIcon open={show} />
        </button>
      </div>
      {hint}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminProfilePage() {
  const { userInfo } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // ── Profile state ──
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  // ── Password state ──
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  /* ── Fetch Profile ── */
  const fetchProfile = async () => {
    if (!userInfo?._id) return;
    try {
      setLoading(true);
      const res = await getSingleUser(userInfo._id);
      const user = res?.data || res;
      if (!user?._id) { toast.error("Failed to load profile ❌"); return; }
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

  /* ── Profile Validation ── */
  const validateProfile = () => {
    if (!name.trim()) return toast.error("Name is required");
    if (name.trim().length < 3) return toast.error("Name must be at least 3 characters");
    if (!phoneNumber.trim()) return toast.error("Phone number is required");
    if (!/^[0-9]{10,15}$/.test(phoneNumber.trim()))
      return toast.error("Phone number must be 10–15 digits");
    if (photoUrl?.trim()) {
      const ok = /^(https?:\/\/).+\.(jpg|jpeg|png|webp)$/i.test(photoUrl.trim());
      if (!ok) return toast.error("Photo URL must be a valid image link");
    }
    return true;
  };

  /* ── Update Profile ── */
  const handleUpdate = async () => {
    if (!userInfo?._id) { toast.error("Please login first ❌"); return; }
    if (validateProfile() !== true) return;
    try {
      setSaving(true);
      const res = await updateUser(userInfo._id, {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        photoUrl: photoUrl.trim(),
      });
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

  /* ── Password Validation ── */
  const validatePassword = () => {
    if (!newPassword.trim()) return toast.error("New password is required");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    return true;
  };

  /* ── Reset Password ── */
  const handleReset = async () => {
    if (!userInfo?._id) { toast.error("Please login first ❌"); return; }
    if (validatePassword() !== true) return;
    try {
      setSavingPassword(true);
      const res = await resetPassword(userInfo._id, newPassword);
      if (res?.status || res?.success) {
        toast.success(res?.message || "Password reset successfully ✅");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res?.message || "Reset failed ❌");
      }
    } catch (error: any) {
      toast.error(error?.message || "Reset failed ❌");
    } finally {
      setSavingPassword(false);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: "My Profile" },
    { key: "password", label: "Reset Password" },
  ];

  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm">

      {/* ── Tab Bar ── */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ════════════════ PROFILE TAB ════════════════ */}
      {activeTab === "profile" && (
        <>
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-600 mt-1">Update your personal information</p>
          </div>

          {loading ? (
            <div className="mt-6 text-sm text-gray-500 font-medium">
              Loading profile...
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-2 w-full h-12 px-4 rounded-full border border-gray-300
                    outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="mt-2 w-full h-12 px-4 rounded-full border border-gray-300
                    outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Photo URL */}
              <div>
                <label className="text-sm font-medium text-gray-700">Photo URL</label>
                <input
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/photo.png"
                  className="mt-2 w-full h-12 px-4 rounded-full border border-gray-300
                    outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Preview */}
              <div className="md:col-span-2 flex items-center gap-4 rounded-2xl border bg-gray-50 p-4">
                <div className="h-16 w-16 rounded-2xl overflow-hidden border bg-white shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl || "https://i.ibb.co.com/1fyRdSjb/demo-user-logo.png"}
                    alt="profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{name || "Name"}</p>
                  <p className="text-xs text-gray-600">{email || "Email"}</p>
                  <p className="text-xs text-gray-600">{phoneNumber || "Phone Number"}</p>
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
        </>
      )}

      {/* ════════════════ PASSWORD TAB ════════════════ */}
      {activeTab === "password" && (
        <>
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-sm text-gray-600 mt-1">Update your account password</p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* New Password */}
            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNew}
              onToggle={() => setShowNew((p) => !p)}
              placeholder="Min. 6 characters"
              hint={
                newPassword.length > 0 && newPassword.length < 6 ? (
                  <p className="text-[11px] text-red-400 mt-1">✗ At least 6 characters required</p>
                ) : newPassword.length >= 6 ? (
                  <p className="text-[11px] text-green-500 mt-1">✓ Password length looks good</p>
                ) : null
              }
            />

            {/* Confirm Password */}
            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirm}
              onToggle={() => setShowConfirm((p) => !p)}
              placeholder="Re-enter new password"
              hint={
                confirmPassword.length > 0 ? (
                  <p className={`text-[11px] mt-1 ${newPassword === confirmPassword ? "text-green-500" : "text-red-400"}`}>
                    {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                ) : null
              }
            />

            {/* Info card */}
            <div className="md:col-span-2 flex items-start gap-3 rounded-2xl border bg-gray-50 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500 shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-800">Password tips</p>
                <ul className="mt-1 space-y-0.5 text-xs text-gray-500">
                  <li>• At least 6 characters long</li>
                  <li>• Mix letters, numbers, and symbols for a stronger password</li>
                  <li>• Do not reuse your current password</li>
                </ul>
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                disabled={savingPassword}
                onClick={handleReset}
                className="w-full rounded-full py-3 font-semibold text-white
                  bg-gradient-to-r from-blue-600 to-green-600
                  hover:opacity-90 transition disabled:opacity-60"
              >
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}