"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const BASE_URL = process.env.BACKEND_URL!;

/* =========================
   AUTH HELPERS
========================= */

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

/* =========================
   PUBLIC ROUTES (CACHED)
========================= */

/** ✅ Get All Products (Public – Cached) */
export const getAllProductsPublic = async (params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}) => {
  const query = new URLSearchParams();

  if (params?.search) query.append("search", params.search);
  if (params?.category) query.append("category", params.category);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);

  const url = `${BASE_URL}/products?${query.toString()}`;

  const res = await fetch(url, {
    next: {
      revalidate: 60, // 🔥 ISR (1 minute)
      tags: ["products"], // 🔥 Cache tag
    },
  });

  return res.json();
};

/** ✅ Get Single Product by ID (Public – Cached) */
export const getSingleProductByID = async (id: string) => {
  const res = await fetch(`${BASE_URL}/product/${id}`, {
    next: {
      revalidate: 300, // 🔥 5 minutes
      tags: ["products"],
    },
  });

  return res.json();
};

/** ✅ Get Single Product by Slug (Public – Cached) */
export const getSingleProductBySlug = async (slug: string) => {
  const res = await fetch(`${BASE_URL}/products/${slug}`, {
    next: {
      revalidate: 300,
      tags: ["products"],
    },
  });

  return res.json();
};

/* =========================
   ADMIN ROUTES (NO CACHE)
========================= */

/** ✅ Create Product (Admin) */
export const createProduct = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  // 🔥 Invalidate all product caches
  revalidateTag("products", {});

  return res.json();
};

/** ✅ Get All Products (Admin – No Cache) */
export const getAllProductsAdmin = async (params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}) => {
  const query = new URLSearchParams();

  if (params?.search) query.append("search", params.search);
  if (params?.category) query.append("category", params.category);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);

  const url = `${BASE_URL}/products?${query.toString()}`;

  const res = await fetch(url, {
    headers: await authHeaders(),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Get Single Product (Admin – No Cache) */
export const getSingleProductAdmin = async (id: string) => {
  const res = await fetch(`${BASE_URL}/product/${id}`, {
    headers: await authHeaders(),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Update Product (Admin) */
export const updateProduct = async (productId: string, payload: any) => {
  const res = await fetch(`${BASE_URL}/products/${productId}`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  // 🔥 Invalidate product cache
  revalidateTag("products", {});

  return res.json();
};

/** ✅ Delete Product (Admin) */
export const deleteProduct = async (productId: string) => {
  const res = await fetch(`${BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: await authHeaders(),
    cache: "no-store",
  });

  // 🔥 Invalidate product cache
  revalidateTag("products", {});

  return res.json();
};
