"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export const registerUser = async (userData: any) => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/create-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || "Registration failed!",
      };
    }

    return {
      success: true,
      message: result?.message || "User registered successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Fetch failed (Backend not reachable)",
    };
  }
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: result?.message || "Registration failed!",
      };
    }

    if (result?.status) {
      (await cookies()).set("accessToken", result.data.accessToken);
    }

    return {
      success: true,
      message: result?.message || "Login successful",
      data: result, // token/user info
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Fetch failed (Backend not reachable)",
    };
  }
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) {
    return null;
  }
  let decodedData = null;
  if (accessToken) {
    decodedData = await jwtDecode(accessToken);
    return decodedData;
  } else {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const token = (await cookies()).get("accessToken")?.value;

    const res = await fetch(`${process.env.BACKEND_URL}/users/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `${token}` } : {}),
      },
      cache: "no-store",
    });

    const result = await res.json().catch(() => null);

    if (!res.ok) return null;

    return result?.data || null;
  } catch {
    return null;
  }
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
};
