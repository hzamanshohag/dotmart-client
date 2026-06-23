/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/modules/context/UserContext";
import { resetPassword } from "@/modules/services/user/user.service";

// ─── Eye Toggle Icon ───────────────────────────────────────────────────────────

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

// ─── Password Field ────────────────────────────────────────────────────────────

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

export default function ResetPasswordPage() {
  const { userInfo } = useUser();
  // console.log()

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ================= Validation ================= */
  const validate = () => {
    if (!newPassword.trim()) return toast.error("New password is required");
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");
    return true;
  };

  /* ================= Submit ================= */
  const handleReset = async () => {
    if (!userInfo?._id) {
      toast.error("Please login first ❌");
      return;
    }

    const ok = validate();
    if (ok !== true) return;

    try {
      setSaving(true);
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
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
      <p className="text-sm text-gray-600 mt-2">Update your account password</p>

      {/* Form */}
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
              <p className="text-[11px] text-red-400 mt-1">
                ✗ At least 6 characters required
              </p>
            ) : newPassword.length >= 6 ? (
              <p className="text-[11px] text-green-500 mt-1">
                ✓ Password length looks good
              </p>
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
              <p
                className={`text-[11px] mt-1 ${
                  newPassword === confirmPassword
                    ? "text-green-500"
                    : "text-red-400"
                }`}
              >
                {newPassword === confirmPassword
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
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
            disabled={saving}
            onClick={handleReset}
            className="w-full rounded-full py-3 font-semibold text-white
              bg-gradient-to-r from-blue-600 to-green-600
              hover:opacity-90 transition disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}