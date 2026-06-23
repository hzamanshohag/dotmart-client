"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getAllHero } from "@/modules/services/hero/hero.service";

type HeroImage = {
  image: string;
  alt: string;
  link?: string;
};

type HeroType = {
  _id?: string;
  carouselImages: HeroImage[];
  sideImages: HeroImage[];
  isActive?: boolean;
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

export function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [carouselImages, setCarouselImages] = useState<HeroImage[]>([]);
  const [sideImages, setSideImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHero = async () => {
    try {
      setLoading(true);

      const res = await getAllHero();
      const list = res?.data?.data || res?.data || [];

      let hero: HeroType | null = null;

      if (Array.isArray(list)) {
        hero = list.find((h) => h?.isActive === true) || list[0] || null;
      } else {
        hero = list;
      }

      if (!hero) return;

      setCarouselImages(
        Array.isArray(hero.carouselImages) ? hero.carouselImages : [],
      );
      setSideImages(Array.isArray(hero.sideImages) ? hero.sideImages : []);
      setCurrentSlide(0);
    } catch (error) {
      console.log("❌ hero fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  const nextSlide = () => {
    if (!carouselImages.length) return;
    setCurrentSlide((prev) =>
      prev === carouselImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    if (!carouselImages.length) return;
    setCurrentSlide((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1,
    );
  };

  // ✅ Auto slide
  useEffect(() => {
    if (isPaused) return;
    if (!carouselImages.length) return;

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === carouselImages.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, carouselImages.length]);

  // ✅ Full Page Loading UI
  if (loading) {
    return <LoadingSpinner />;
  }

  // ✅ Empty UI
  if (!carouselImages.length) {
    return (
      <div className="w-full rounded-2xl border bg-white p-6 text-center text-sm text-gray-500">
        No hero images found ❌
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {/* ✅ MAIN CAROUSEL */}
      <div
        className="relative w-full lg:w-2/3 overflow-hidden rounded-2xl shadow-lg"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative h-[250px] sm:h-[320px] md:h-[400px] lg:h-[450px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {carouselImages[currentSlide]?.link ? (
                <Link
                  href={
                    carouselImages[currentSlide]?.link
                      ? `/product/${carouselImages[currentSlide].link}`
                      : "/products"
                  }
                  className="absolute inset-0 z-10 cursor-pointer"
                >
                  <Image
                    src={carouselImages[currentSlide].image}
                    alt={carouselImages[currentSlide].alt}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </Link>
              ) : (
                <>
                  <Image
                    src={carouselImages[currentSlide].image}
                    alt={carouselImages[currentSlide].alt}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <Button
            variant="secondary"
            size="icon"
            onClick={prevSlide}
            className="absolute left-2 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-600/70 to-green-600/70 shadow-md backdrop-blur hover:from-blue-700/80 hover:to-green-700/80 active:scale-95 text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={nextSlide}
            className="absolute right-2 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-600/70 to-green-600/70 shadow-md backdrop-blur hover:from-blue-700/80 hover:to-green-700/80 active:scale-95 text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {carouselImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? "w-8 bg-gradient-to-r from-blue-600 to-green-600"
                    : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ✅ SIDE IMAGES */}
      <div className="hidden lg:flex w-full lg:w-1/3 flex-col gap-4">
        {sideImages.slice(0, 2).map((image, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl shadow-md flex-1 group"
          >
            <div className="relative h-[220px] lg:h-full">
              {image?.link ? (
                <Link
                  href={image.link ? `/product/${image.link}` : "/products"}
                  className="absolute inset-0 z-10 cursor-pointer"
                >
                  <Image
                    src={image.image}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="35vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-medium">{image.alt}</p>
                  </div>
                </Link>
              ) : (
                <>
                  <Image
                    src={image.image}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="35vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-medium">{image.alt}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
