"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { getAllCategories } from "@/modules/services/category/category.service";

type CategoryType = {
  _id: string;
  name: string;
  slug?: string;
  photo: string;
};

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

const FooterSection = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [catLoading, setCatLoading] = useState(true);

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/hzaman-shohag/",
    },
  ];
    // {
    //   icon: Twitter,
    //   href: "#",
    // },
    // {
    //   icon: Youtube,
    //   href: "#",
    // },
  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        const list = res?.data?.data || res?.data || [];
        setCategories(Array.isArray(list) ? list : []);
      } catch (err) {
        console.log("❌ failed to fetch categories");
      } finally {
        setCatLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      {/* GLOBAL FOOTER LOADING */}
      {catLoading && <LoadingSpinner />}

      <footer className="w-full bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-28 py-12">
          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Logo + About */}
            <div>
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo.svg"
                  width={144}
                  height={64}
                  alt="Dotmart"
                  priority
                />
              </Link>

              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                Your one-stop shop for quality products at great prices.
                Discover amazing deals and exclusive offers.
              </p>
            </div>

            {/* Quick Links + Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:col-span-2">
              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Quick Links</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    { label: "Home", href: "/" },
                    { label: "All Products", href: "/products" },
                    { label: "Contact", href: "/contact" },
                    { label: "About Us", href: "/about-us" },
                    {label:"Privacy Policy",href:"/privacy-policy"},
                    
                  ].map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-gray-600 hover:text-blue-600 transition"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {categories.slice(0, 5).map((category) => (
                    <li key={category._id}>
                      <Link
                        href={`/products?category=${category._id}`}
                        className="text-gray-600 hover:text-blue-600 transition"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Social + Contact */}
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Connect With Us
              </h3>

              <div className="flex gap-3 mt-4">
                {socialLinks.map(({ icon: Icon, href }, i) => (
                  <Link
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full border flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex gap-3">
                  <Mail className="h-4 w-4 text-blue-600" />
                  dotmart@gmail.com
                </div>
                <div className="flex gap-3">
                  <Phone className="h-4 w-4 text-blue-600" />
                  +880 1312116844
                </div>
                <div className="flex gap-3">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  khulna, Bangladesh
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-gray-50 border-t">
          <div className="container mx-auto px-4 md:px-10 lg:px-28 py-6">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} Dotmart. All rights reserved. Design
              by{" "}
              <Link
                href="https://www.linkedin.com/in/hzaman-shohag"
                target="_blank"
                className="text-blue-600 font-medium hover:underline"
              >
                Shohag
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterSection;
