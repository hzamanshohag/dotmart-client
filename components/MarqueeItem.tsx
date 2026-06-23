"use client";

import { getAllAnnouncement } from "@/modules/services/announcement/announcement.service";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type AnnouncementType = {
  _id: string;
  text: string;
};

export default function MarqueeItem() {
  const [announcement, setAnnouncement] = useState<string>("");

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const res = await getAllAnnouncement();
      const data: AnnouncementType[] = Array.isArray(res?.data) ? res.data : [];
      if (data.length > 0) {
        setAnnouncement(data[data.length - 1].text);
      }
    };

    fetchAnnouncement();
  }, []);

  if (!announcement) return null;

  return (
    <div className="container mx-auto px-4 md:px-10 lg:px-28">
      <div className="overflow-hidden rounded-full border border-border bg-card shadow-sm">
        <motion.div
          className="flex w-max items-center py-3 px-6"
          animate={{ x: [0, -1200] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">
            {announcement}
          </span>

          <span className="mx-20 whitespace-nowrap text-sm font-medium text-muted-foreground">
            {announcement}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
