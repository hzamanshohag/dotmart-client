/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

const BASE_URL = `${process.env.BACKEND_URL}`;
if (!BASE_URL) {
  throw new Error("❌ BACKEND_URL is missing from environment variables");
}

/** ✅ Get token from cookies */
const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
};

/** ✅ Admin Authorization Headers */
const authHeaders = async () => {
  const token = await getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `${token}` } : {}),
  };
};

/** ✅ Create User */
export const createUser = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/create-user`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Get All Users */
export const getAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Get Single User by Email */
export const getUserByEmail = async (email: string) => {
  const res = await fetch(`${BASE_URL}/users/${email}`, {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Get Single User by ID */
export const getSingleUser = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Update User */
export const updateUser = async (userId: string, payload: any) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Block User */
export const blockUser = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/user/block/${userId}`, {
    method: "PUT",
    headers: await authHeaders(),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Unblock User */
export const unblockUser = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/user/unblock/${userId}`, {
    method: "PUT",
    headers: await authHeaders(),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Delete User */
export const deleteUser = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    method: "DELETE",
    headers: await authHeaders(),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Reset Password */
export const resetPassword = async (userId: string, newPassword: string) => {
  console.log(userId, newPassword)
  const res = await fetch(`${BASE_URL}/user/password-reset/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newPassword }),
    cache: "no-store",
  });
 
  return res.json();
};
