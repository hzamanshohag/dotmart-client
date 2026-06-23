"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const BASE_URL = `${process.env.BACKEND_URL}/categories`;

/* =========================
   PUBLIC (CACHED)
========================= */

/** ✅ Get All Categories (Public – Cached) */
export const getAllCategories = async () => {
  const res = await fetch(BASE_URL, {
    next: {
      revalidate: 600, // 🔥 10 minutes (categories change rarely)
      tags: ["categories"], // 🔥 Cache tag
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

/** ✅ Create Category */
export const createCategory = async (payload: any) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: await getAuthHeader(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  // 🔥 Invalidate category cache
  revalidateTag("categories", {});

  return res.json();
};

/** ✅ Update Category */
export const updateCategory = async (id: string, payload: any) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: await getAuthHeader(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  // 🔥 Invalidate category cache
  revalidateTag("categories", {});

  return res.json();
};

/** ✅ Delete Category */
export const deleteCategory = async (id: string) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: await getAuthHeader(),
    cache: "no-store",
  });

  // 🔥 Invalidate category cache
  revalidateTag("categories", {});

  return res.json();
};
