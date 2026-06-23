"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const BASE_URL = process.env.BACKEND_URL!;

/* ======================
   AUTH HELPERS
====================== */

const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
};

const authHeaders = async () => {
  const token = await getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
  };
};

/* ======================
   PUBLIC (CACHED)
====================== */

/** ✅ Get All Reviews (Public – Cached) */
export const getAllReviewsPublic = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const query = new URLSearchParams();

  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  const url = query.toString()
    ? `${BASE_URL}/reviews?${query}`
    : `${BASE_URL}/reviews`;

  const res = await fetch(url, {
    next: {
      revalidate: 120, // 🔥 2 minutes (reviews change often)
      tags: ["reviews"],
    },
  });

  return res.json();
};

/** ✅ Get Single Review (Public – Cached) */
export const getSingleReviewPublic = async (reviewId: string) => {
  const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    next: {
      revalidate: 300, // 🔥 5 minutes
      tags: ["reviews"],
    },
  });

  return res.json();
};

/* ======================
   ADMIN (NO CACHE)
====================== */

/** ✅ Create Review (Admin) */
export const createReviewAdmin = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/reviews`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  // 🔥 Invalidate review cache
  revalidateTag("reviews", {});

  return res.json();
};

/** ✅ Approve Review (Admin) */
export const approveReviewAdmin = async (reviewId: string) => {
  const res = await fetch(`${BASE_URL}/reviews/${reviewId}/approve`, {
    method: "PUT",
    headers: await authHeaders(),
    cache: "no-store",
  });

  // 🔥 Approval affects public visibility
  revalidateTag("reviews", {});

  return res.json();
};

/** ✅ Update Review (Admin) */
export const updateReviewAdmin = async (reviewId: string, payload: any) => {
  const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  // 🔥 Invalidate review cache
  revalidateTag("reviews", {});

  return res.json();
};

/** ✅ Delete Review (Admin) */
export const deleteReviewAdmin = async (reviewId: string) => {
  const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: await authHeaders(),
    cache: "no-store",
  });

  // 🔥 Invalidate review cache
  revalidateTag("reviews", {});

  return res.json();
};
