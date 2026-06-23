"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, X } from "lucide-react";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";

/* ---------------- LOADING SPINNER ---------------- */
const LoadingSpinner = () => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/90">
    <div className="flex flex-col items-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-green-600 animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-gray-600">Loading...</p>
    </div>
  </div>
);

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------------- AVATARS ---------------- */
  const avatars = [
    "https://i.ibb.co.com/Y7jcyQrV/young-business-girl-using-her-computer.jpg",
    "https://i.ibb.co.com/HSNwQv9/customer-service-handsome-young-guy-office-suit-with-laptop-headset-smiling-happily.jpg",
  ];

  const [currentAvatar, setCurrentAvatar] = useState(0);

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // small delay to avoid flicker

    return () => clearTimeout(timer);
  }, []);

  /* ---------------- AUTO AVATAR SLIDE ---------------- */
  useEffect(() => {
    if (open || loading) return;

    const interval = setInterval(() => {
      setCurrentAvatar((prev) => (prev + 1) % avatars.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [open, loading, avatars.length]);

  return (
    <>
      {/* LOADING */}
      {loading && <LoadingSpinner />}

      {!loading && (
        <div className="fixed right-5 bottom-10 md:bottom-20 z-[998]">
          {/* ACTION BUTTONS */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-3"
              >
                {/* Messenger */}
                <a
                  href="https://m.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="icon"
                    className="h-14 w-14 rounded-full bg-[#1877F2] hover:bg-[#1877F2]/90 shadow-md"
                  >
                    <FaFacebookMessenger className="h-7 w-7 text-white" />
                  </Button>
                </a>

                {/* WhatsApp */}
                <a href="https://wa.me/8801312116844" target="_blank">
                  <Button
                    size="icon"
                    className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#25D366]/90 shadow-md"
                  >
                    <FaWhatsapp className="h-7 w-7 text-white" />
                  </Button>
                </a>

                <a href="tel:+8801312116844" title="Call +880 1758 714822">
                  <Button
                    size="icon"
                    className="h-14 w-14 rounded-full bg-[#00C853] hover:bg-[#00C853]/90 shadow-md"
                  >
                    <Phone className="h-6 w-6 text-white" />
                  </Button>
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TOGGLE BUTTON */}
          <div className="mt-3 flex justify-center">
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-[#1877F2] hover:bg-[#1877F2]/90 shadow-md relative"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <>
                  <span className="absolute -top-1 -right-1 z-50 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white animate-ping" />

                  <div className="relative h-14 w-14 rounded-full overflow-hidden">
                    <Image
                      src={avatars[currentAvatar]}
                      alt="Support"
                      fill
                      className="object-cover"
                    />
                  </div>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
