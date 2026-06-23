"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const BASE_URL = `${process.env.BACKEND_URL}/hero`;

/* =========================
   PUBLIC (CACHED)
========================= */

/** ✅ Get All Hero (Public – Cached) */
export const getAllHero = async () => {
  const res = await fetch(BASE_URL, {
    next: {
      revalidate: 300, // 🔥 5 minutes
      tags: ["hero"],
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

/** ✅ Create Hero */
export const createHero = async (payload: any) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: await getAuthHeader(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  // 🔥 Invalidate hero cache
  revalidateTag("hero", {});

  return res.json();
};

/** ✅ Update Hero */
export const updateHero = async (id: string, payload: any) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: await getAuthHeader(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  // 🔥 Invalidate hero cache
  revalidateTag("hero", {});

  return res.json();
};

/** ✅ Delete Hero */
export const deleteHero = async (id: string) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      ...(await getAuthHeader()),
    },
    cache: "no-store",
  });

  // 🔥 Invalidate hero cache
  revalidateTag("hero", {});

  return res.json();
};
