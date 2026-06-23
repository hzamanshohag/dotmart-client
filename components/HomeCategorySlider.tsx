"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/modules/services/category/category.service";
import { useRouter } from "next/navigation";

/* ---------------- Types ---------------- */
type Item = {
  _id: string;
  title: string;
  image: string;
};

const AUTO_DELAY = 4000; // ⏱ auto slide interval (ms)

/* ---------------- Component ---------------- */
export default function HomeCategorySlider() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState(0);
  const [maxVisibleOffset, setMaxVisibleOffset] = useState(4); // 🖥 default
  const router = useRouter();

  /* ---------------- Fetch categories ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllCategories();
        const list = res?.data?.data || res?.data || [];

        setItems(
          list
            .filter((c: any) => c?.photo)
            .map((c: any) => ({
              _id: c._id,
              title: c.name,
              image: c.photo,
            })),
        );
      } catch {
        setItems([]);
      }
    })();
  }, []);

  /* ---------------- Responsive visible cards ---------------- */
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        // 📱 Mobile → 3 cards total
        setMaxVisibleOffset(1);
      } else {
        // 🖥 Desktop → 8 cards total
        setMaxVisibleOffset(4);
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  /* ---------------- Auto slider ---------------- */
  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1 >= items.length ? 0 : prev + 1));
    }, AUTO_DELAY);

    return () => clearInterval(interval);
  }, [items.length]);

  /* ---------------- Controls ---------------- */
  const next = () => setActive((p) => (p + 1 >= items.length ? 0 : p + 1));

  const prev = () => setActive((p) => (p - 1 < 0 ? items.length - 1 : p - 1));

  if (!items.length) return null;

  return (
    <section className="w-[90%] mx-auto py-10 overflow-hidden">
      {/* Header */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-foreground">
          Explore Categories
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Curated collections just for you
        </p>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Left Arrow */}
        <Button
          size="icon"
          onClick={prev}
          className="
            absolute left-6 z-20
            rounded-full
            bg-gradient-to-r from-blue-600/70 to-green-600/70
            shadow-md backdrop-blur
            hover:from-blue-700/80 hover:to-green-700/80
            active:scale-95 text-white
          "
        >
          <ChevronLeft />
        </Button>

        {/* Right Arrow */}
        <Button
          size="icon"
          onClick={next}
          className="
            absolute right-6 z-20
            rounded-full
            bg-gradient-to-r from-blue-600/70 to-green-600/70
            shadow-md backdrop-blur
            hover:from-blue-700/80 hover:to-green-700/80
            active:scale-95 text-white
          "
        >
          <ChevronRight />
        </Button>

        {/* Slider */}
        <div className="relative h-[360px] w-full flex items-center justify-center">
          {items.map((item, i) => {
            const offset = i - active;

            return (
              <motion.div
                key={item._id}
                className="absolute cursor-pointer"
                animate={{
                  x: offset * 260,
                  scale: offset === 0 ? 1 : 0.82,
                  opacity: Math.abs(offset) > maxVisibleOffset ? 0 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                }}
                onClick={() => router.push(`/products?category=${item._id}`)}
              >
                <div
                  className="
                    relative h-[280px] w-[220px]
                    rounded-3xl overflow-hidden
                    shadow-lg hover:shadow-2xl
                    transition
                  "
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Title */}
                  <div className="absolute bottom-4 w-full text-center">
                    <span
                      className="
                        inline-block rounded-full
                        bg-gradient-to-r from-blue-600/70 to-green-600/70
                        shadow-md backdrop-blur
                        px-4 py-1.5
                        text-sm font-semibold text-white
                      "
                    >
                      {item.title}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
