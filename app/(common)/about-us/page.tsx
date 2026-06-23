"use client";

import { motion, Variants } from "framer-motion"; // Added Variants import
import {
  ShoppingBag,
  ShieldCheck,
  Zap,
  Clock,
  HeartHandshake,
  Award,
} from "lucide-react";

export default function AboutPage() {
  // Explicitly typing this as Variants solves the type widening issue
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };

  const coreValues = [
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: "Instant Delivery",
      description:
        "No more waiting. Get your digital goods delivered securely via Email and WhatsApp seconds after purchasing.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
      title: "100% Safe Payments",
      description:
        "Shop with total peace of mind using your preferred local mobile wallets like bKash and Nagad with fully secured checkouts.",
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      title: "24/7 Premium Support",
      description:
        "Our dedicated support engineers are online around the clock to help you with troubleshooting, activation, or inquiries.",
    },
    {
      icon: <Award className="h-6 w-6 text-amber-600" />,
      title: "Replacement Warranty",
      description:
        "We stand behind our products. Enjoy stress-free replacement warranties on our entire catalog if issues arise.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-10 lg:px-28 max-w-6xl space-y-20">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={1}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium">
              <ShoppingBag className="h-4 w-4" /> About Dotmart
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Your Ultimate Destination for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Premium Digital Services
              </span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              At Dotmart, we are redefining how digital products and premium
              subscriptions are accessed in Bangladesh. We bridge the gap
              between complex cross-border checkouts and your local payment
              methods, offering a seamless and instantaneous marketplace
              experience.
            </p>
            <p className="text-base text-slate-500 leading-relaxed">
              Whether you need software licenses, streaming subscriptions, or
              digital assets, our platform is engineered to deliver
              authenticity, blazing speed, and iron-clad customer protection
              under one hub.
            </p>
          </motion.div>

          {/* Graphical/Accent Element */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={2}
            className="relative flex justify-center items-center lg:justify-end"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-blue-400 to-green-400 rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="relative border border-slate-200 bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full border-t-4 border-t-blue-600">
              <span className="text-5xl font-extrabold text-blue-600 tracking-tight block mb-2">
                100%
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Authentic & Licensed
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                We work directly with primary suppliers and global wholesalers
                to ensure that every single code, product, or account dispatched
                is fully verified and legit.
              </p>

              <hr className="my-6 border-slate-100" />

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Trusted Ecosystem
                  </h4>
                  <p className="text-xs text-slate-400">
                    Serving digital convenience daily.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Values Grid */}
        <div className="space-y-10 pt-10 border-t border-slate-200/60">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Why Thousands Choose Dotmart
            </h2>
            <p className="text-sm md:text-base text-slate-500">
              We stand apart by setting high-quality baselines for digital
              commerce logistics and consumer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={idx + 1}
                className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-xl w-fit border border-slate-100 shadow-inner">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {value.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mission Statement Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Our Core Promise
          </h2>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-300 leading-relaxed">
            &ldquo;To make global premium digital services universally
            available, fast, and remarkably affordable for every shopper in
            Bangladesh with the safety nets they deserve.&rdquo;
          </p>
        </motion.div>
      </div>
    </div>
  );
}