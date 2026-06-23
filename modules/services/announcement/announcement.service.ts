"use server";

import { cookies } from "next/headers";

const BASE_URL = `${process.env.BACKEND_URL}/announcement`;

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

/** ✅ Get All Announcements */
export const getAllAnnouncement = async () => {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: await getAuthHeader(),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Get Single Announcement */
export const getSingleAnnouncement = async (announcementId: string) => {
  const res = await fetch(`${BASE_URL}/${announcementId}`, {
    method: "GET",
    headers: await getAuthHeader(),
    cache: "no-store",
  });

  return res.json();
};

/** ✅ Create Announcement */
export const createAnnouncement = async (payload: { text: string }) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: await getAuthHeader(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });



  return res.json();
};

/** ✅ Update Announcement */
export const updateAnnouncement = async (
  announcementId: string,
  payload: { text: string },
) => {
  const res = await fetch(`${BASE_URL}/${announcementId}`, {
    method: "PUT",
    headers: await getAuthHeader(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  

  return res.json();
};

/** ✅ Delete Announcement */
export const deleteAnnouncement = async (announcementId: string) => {
  const res = await fetch(`${BASE_URL}/${announcementId}`, {
    method: "DELETE",
    headers: await getAuthHeader(),
    cache: "no-store",
  });

 

  return res.json();
};
