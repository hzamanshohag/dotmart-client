"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";

import { getAllReviewsPublic } from "@/modules/services/reviews/reviews.service";

// ✅ Backend social type (object)
type Social = {
  platform: "twitter" | "facebook" | "linkedin" | "instagram" | "youtube";
};

// ✅ Review type from backend
export type Review = {
  _id: string;
  name: string;
  userImage: string;
  social?: Social; // ✅ backend returns object
  rating: number;
  text: string;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// ✅ Strongly typed map (FIXED ✅)
const SocialIcons: Record<Social["platform"], any> = {
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
};

// ✅ normalize platform to avoid case mismatch (instagram / Instagram)
const normalizePlatform = (platform?: string) => {
  if (!platform) return null;
  return platform.toLowerCase() as Social["platform"];
};

// Loading Component
const LoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-blue-600 border-r-green-600 animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ how many reviews visible at first
  const [visibleCount, setVisibleCount] = useState(30);

  // ✅ Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await getAllReviewsPublic({ page: 1, limit: 50 });

      // ✅ FIX: your backend returns reviews in res.data.data
      const list = res?.data?.data || [];

      setReviews(Array.isArray(list) ? list : []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load reviews ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ✅ Filter only approved reviews
  const approvedReviews = useMemo(() => {
    return reviews
      .filter((r) => r.isApproved === true)
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
  }, [reviews]);

  // ✅ Visible reviews
  const visibleReviews = approvedReviews.slice(0, visibleCount);

  // ✅ Group into slides (2 reviews per slide)
  const slides = useMemo(() => {
    const chunk: Review[][] = [];
    for (let i = 0; i < visibleReviews.length; i += 2) {
      chunk.push(visibleReviews.slice(i, i + 2));
    }
    return chunk;
  }, [visibleReviews]);

  // ✅ Reset index when visible reviews change
  useEffect(() => {
    setCurrentIndex(0);
  }, [visibleCount]);

  // ✅ Auto play
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => setCurrentIndex(index);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 2, approvedReviews.length));
  };

  const canLoadMore = visibleCount < approvedReviews.length;

  // ✅ Full Page Loading UI
  if (loading) {
    return <LoadingSpinner />;
  }

  // ✅ No reviews
  if (approvedReviews.length === 0) return null;

  return (
    <section className="w-[90%] py-10 bg-gray-50">
      <div className="container mx-auto px-4 md:px-10 lg:px-28">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            What Our Customers Say
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Don&apos;t just take our word for it - hear from our happy customers
          </p>
        </div>

        {/* Slider */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {slides.map((slideReviews, slideIndex) => (
                <div
                  key={slideIndex}
                  className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-6 bg-transparent"
                >
                  {slideReviews.map((review) => {
                    const platform = normalizePlatform(review.social?.platform);
                    const IconComponent = platform
                      ? SocialIcons[platform]
                      : null;

                    return (
                      <div
                        key={review._id}
                        className="rounded-2xl bg-white shadow-xl p-7 md:p-8 hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="flex flex-col gap-5">
                          {/* User */}
                          <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-full overflow-hidden border-4 border-blue-100">
                              <Image
                                src={review.userImage || "/placeholder.png"}
                                alt={review.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </div>

                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {review.name}
                              </h4>

                              {/* Rating */}
                              <div className="flex mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Review Text */}
                          <blockquote className="text-gray-700 text-base italic line-clamp-4">
                            "{review.text}"
                          </blockquote>

                          {/* Social Icon */}
                          {IconComponent && (
                            <div className="flex gap-3">
                              <span
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                aria-label={platform || "social"}
                              >
                                <IconComponent className="w-5 h-5" />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {slides.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="
    absolute left-0 top-1/2 z-10 h-12 w-12 -translate-y-1/2 
    -translate-x-1/2 md:-translate-x-12
    rounded-full 
    bg-gradient-to-r from-blue-600/70 to-green-600/70 shadow-md backdrop-blur 
    hover:from-blue-700/80 hover:to-green-700/80
    active:scale-95 
    text-white 
    flex items-center justify-center
  "
                aria-label="Previous reviews"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={goToNext}
                className="
    absolute right-0 top-1/2 z-10 h-12 w-12 -translate-y-1/2 
    translate-x-1/2 md:translate-x-12
    rounded-full 
    bg-gradient-to-r from-blue-600/70 to-green-600/70 shadow-md backdrop-blur 
    hover:from-blue-700/80 hover:to-green-700/80
    active:scale-95 
    text-white
    flex items-center justify-center
  "
                aria-label="Next reviews"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {slides.length > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-blue-600 to-green-600"
                    : "bg-gray-300 hover:bg-blue-600"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {canLoadMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-300"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
