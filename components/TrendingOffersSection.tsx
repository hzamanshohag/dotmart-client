"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getAllTrendingOffers } from "@/modules/services/trendingOffer/trendingOffer.service";

/* ---------------- Types ---------------- */
export type Offer = {
  _id: string;
  title: string;
  description: string;
  image: string;
  ctaLink: string;
  priority: number;
  isActive: boolean;
};

/* ---------------- Loading ---------------- */
const LoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90">
    <div className="flex flex-col items-center gap-3">
      <div className="h-14 w-14 rounded-full border-4 border-gray-200 border-t-blue-600 border-r-green-600 animate-spin" />
      <p className="text-sm text-gray-600 font-medium">Loading offers...</p>
    </div>
  </div>
);

export default function TrendingOffersSection() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch offers ---------------- */
const fetchOffers = async () => {
  try {
    setLoading(true);

    const res = await getAllTrendingOffers(); 

    const list = res?.data?.data || res?.data || [];
    setOffers(Array.isArray(list) ? list : []);
  } catch (err: any) {
    toast.error(err?.message || "Failed to load trending offers ❌");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchOffers();
  }, []);

  /* ---------------- Active offers ---------------- */
  const activeOffers = useMemo(() => {
    return offers
      .filter((o) => o.isActive)
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 4);
  }, [offers]);

  if (loading) return <LoadingSpinner />;
  if (!activeOffers.length) return null;

  const [featured, ...others] = activeOffers;

  return (
    <section className="w-[90%] mx-auto py-10">
      <div className="px-4">
        {/* ================= Header ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Trending Offers
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Limited-time deals you shouldn’t miss
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center justify-center w-full sm:w-auto
              rounded-full border border-gray-300 px-5 py-2.5
              text-sm font-medium
              hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200
              transition"
          >
            View All Products →
          </Link>
        </div>

        {/* ================= Featured Offer ================= */}
        <Link
          href={`/product/${featured.ctaLink}`}
          className="group relative block w-full
            h-[220px] sm:h-[300px] md:h-[380px]
            rounded-3xl overflow-hidden bg-gray-200
            shadow-sm hover:shadow-xl transition"
        >
          <Image
            src={featured.image}
            alt={featured.title}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            className="object-cover group-hover:scale-105 transition duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-4 sm:p-6 md:p-8">
              <div className="max-w-xl">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                  {featured.title}
                </h3>

                <p className="mt-2 text-sm sm:text-base text-white/80 line-clamp-2">
                  {featured.description}
                </p>

                <span className="inline-flex mt-4 rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition">
                  Shop Now →
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* ================= Other Offers ================= */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {others.map((offer) => (
            <Link
              key={offer._id}
              href={`/product/${offer.ctaLink}`}
              className="group rounded-xl border bg-white overflow-hidden
                hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative w-full h-40 sm:h-44 bg-gray-100">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Content */}
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                  {offer.title}
                </h4>

                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {offer.description}
                </p>

                <span className="inline-flex mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">
                  View Deal →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
