"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle, Send, Heart } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      whatsapp: formData.get("whatsapp"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    console.log("📩 Contact Form Data:", data);

    // simulate api
    setTimeout(() => {
      setLoading(false);
      setSuccess("✅ Your message has been sent successfully!");
      e.currentTarget.reset();
    }, 800);
  };

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-10 lg:px-28">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
            Contact Us
          </h1>
          <p className="text-gray-600 mt-3">
            Have questions? Need support? Send us a message and we&apos;ll get
            back to you as soon as possible 💬
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Contact Info */}
          <div className="space-y-4">
            {/* WhatsApp */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-green-100 text-blue-600">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">WhatsApp</h3>
                  <p className="text-sm text-gray-600">Chat with us anytime</p>
                </div>
              </div>

              <Link
                href="https://wa.me/8801312116844"
                target="_blank"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300"
              >
                Message on WhatsApp →
              </Link>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Number: +880 1312116844
              </p>
            </div>

            {/* Phone */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-green-100 text-blue-600">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">Phone</h3>
                  <p className="text-sm text-gray-600">Call our support team</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mt-4 font-medium">
                +880 1312116844
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Available: 10AM - 10PM (Everyday)
              </p>
            </div>

            {/* Email */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-green-100 text-blue-600">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">Email</h3>
                  <p className="text-sm text-gray-600">
                    Send us an email anytime
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mt-4 font-medium">
                dotmart@gmail.com
              </p>
            </div>

            {/* Address */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-green-100 text-blue-600">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">Address</h3>
                  <p className="text-sm text-gray-600">Visit our office</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mt-4 font-medium leading-relaxed">
                khulna, Bangladesh
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              Send us a Message
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Fill out the form below and we&apos;ll respond quickly ✅
            </p>

            {/* Success */}
            {success && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="Your name"
                    className="mt-2 w-full h-12 px-4 rounded-full border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="mt-2 w-full h-12 px-4 rounded-full border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="+880 1XXXXXXXXX"
                    className="mt-2 w-full h-12 px-4 rounded-full border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    name="subject"
                    required
                    placeholder="Order / Support / Others"
                    className="mt-2 w-full h-12 px-4 rounded-full border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  placeholder="Write your message..."
                  className="mt-2 w-full min-h-[140px] px-4 py-3 rounded-2xl border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Message"}
                <Send className="h-4 w-4" />
              </button>

              <p className="text-xs text-gray-500 text-center">
                We usually reply within 24 hours ✅
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
