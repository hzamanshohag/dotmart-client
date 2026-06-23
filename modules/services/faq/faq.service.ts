"use server";

import { cookies } from "next/headers";

const BASE_URL = `${process.env.BACKEND_URL}/faq`;

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

/** ✅ Get All FAQs */
export const getAllfaq = async () => {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: await getAuthHeader(),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Get Single FAQ */
export const getSinglefaq = async (faqId: string) => {
  const res = await fetch(`${BASE_URL}/${faqId}`, {
    method: "GET",
    headers: await getAuthHeader(),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Create FAQ */
export const createFaq = async (payload: { text: string }) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: await getAuthHeader(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });



  return res.json();
};

/** ✅ Update FAQ */
export const updateFaq = async (
  faqId: string,
  payload: { text: string },
) => {
  const res = await fetch(`${BASE_URL}/${faqId}`, {
    method: "PUT",
    headers: await getAuthHeader(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  

  return res.json();
};

/** ✅ Delete FAQ */
export const deleteFaq = async (faqId: string) => {
  const res = await fetch(`${BASE_URL}/${faqId}`, {
    method: "DELETE",
    headers: await getAuthHeader(),
    cache: "no-store",
  });

 

  return res.json();
};
