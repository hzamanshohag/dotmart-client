"use server";

import { cookies } from "next/headers";

const BASE_URL = `${process.env.BACKEND_URL}`;

/** ✅ Get token from cookies */
const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
};

/** ✅ Authorization Headers */
const authHeaders = async () => {
  const token = await getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `${token}` } : {}),
  };
};

/* ==========================
✅ CART ROUTES (USER + ADMIN)
========================== */

/** ✅ Add to Cart */
export const addToCart = async (payload: {
  user: string;
  product: string;
  quantity: number;
}) => {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Get User Cart */
export const getUserCart = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/cart/user/${userId}`, {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Update Cart Item Quantity */
export const updateCartItem = async (cartId: string, quantity: number) => {
  const res = await fetch(`${BASE_URL}/cart/${cartId}`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify({ quantity }),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Remove Single Cart Item */
export const removeCartItem = async (cartId: string) => {
  const res = await fetch(`${BASE_URL}/cart/${cartId}`, {
    method: "DELETE",
    headers: await authHeaders(),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Clear All Cart Items of a User */
export const clearUserCart = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/cart/user/${userId}`, {
    method: "DELETE",
    headers: await authHeaders(),
    cache: "no-store",
  });

  return res.json();
};
