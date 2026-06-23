"use client";

import { useEffect, useState } from "react";
import { ChevronDown, HelpCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllfaq } from "@/modules/services/faq/faq.service";

// Updated type definitions
export type FAQ = {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
};

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await getAllfaq();
        const data: FAQ[] = Array.isArray(res?.data) ? res.data : [];

        // 1. Sort by newest date first
        // 2. Extract only the latest 5 records
        const latestFaqs = data
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5);

        setFaqs(latestFaqs);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleAccordion = (id: string) => {
    setActiveIndex(activeIndex === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 text-muted-foreground">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p>No FAQs available at the moment.</p>
      </div>
    );
  }

  return (
    <section className="w-[90%] py-10">
      <div className="container mx-auto px-4 md:px-10 lg:px-28 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Showing the latest updates and common questions regarding Dotmart.
          </p>
        </div>

        {/* FAQ List Accordion */}
        <div className="space-y-4">
          {faqs.map((item) => {
            const isOpen = activeIndex === item._id;

            return (
              <div
                key={item._id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200"
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleAccordion(item._id)}
                  className="flex w-full items-center justify-between p-5 text-left font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  <span className="pr-4 text-base md:text-lg">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-0 text-muted-foreground text-sm md:text-base leading-relaxed border-t border-border/50 bg-muted/20">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
