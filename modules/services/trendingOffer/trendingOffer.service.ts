"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const BASE_URL = `${process.env.BACKEND_URL}/trending-offers`;

/* =========================
   PUBLIC (CACHED)
========================= */

/** ✅ Get All Trending Offers (Public – Cached) */
export const getAllTrendingOffers = async () => {
  const res = await fetch(BASE_URL, {
    next: {
      revalidate: 180, // 🔥 3 minutes (trending changes often)
      tags: ["trending-offers"], // 🔥 Cache tag
    },
  });

  return res.json();
};

/* =========================
   ADMIN (NO CACHE)
========================= */

const getAuthHeader = async () => {
  const token = (await cookies()).get("accessToken")?.value;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
  };
};

/** ✅ Create Trending Offer */
export const createTrendingOffer = async (payload: any) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: await getAuthHeader(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  // 🔥 Invalidate trending offers cache
  revalidateTag("trending-offers", {});

  return res.json();
};

/** ✅ Update Trending Offer */
export const updateTrendingOffer = async (id: string, payload: any) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: await getAuthHeader(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  // 🔥 Invalidate trending offers cache
  revalidateTag("trending-offers", {});

  return res.json();
};

/** ✅ Delete Trending Offer */
export const deleteTrendingOffer = async (id: string) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: await getAuthHeader(),
    cache: "no-store",
  });

  // 🔥 Invalidate trending offers cache
  revalidateTag("trending-offers", {});

  return res.json();
};
