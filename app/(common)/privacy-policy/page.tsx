"use client";

import { Shield, Clock, ArrowRight, Lock, Eye, FileText } from "lucide-react";
import { useState } from "react";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", label: "1. Introduction" },
    { id: "data-collection", label: "2. Information We Collect" },
    { id: "data-usage", label: "3. How We Use Information" },
    { id: "data-sharing", label: "4. Information Sharing & Disclosure" },
    { id: "data-security", label: "5. Data Security" },
    { id: "user-rights", label: "6. Your Rights & Choices" },
    { id: "changes", label: "7. Changes to This Policy" },
    { id: "contact", label: "8. Contact Us" },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // offset for sticky headers
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-10 lg:px-28 max-w-6xl">
        {/* Header Block */}
        <div className="border-b border-slate-200 pb-8 mb-12">
          <div className="flex items-center gap-3 text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
            <Shield className="h-5 w-5" /> Legal & Trust
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            <span>Last Updated: June 17, 2026</span>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          {/* Sticky Sidebar Nav (Desktop only) */}
          <aside className="hidden lg:block sticky top-24 col-span-1 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-3">
              Table of Contents
            </p>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left text-sm px-3 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-between group ${
                  activeSection === section.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{section.label}</span>
                <ArrowRight
                  className={`h-3 w-3 opacity-0 transition-transform group-hover:opacity-100 ${
                    activeSection === section.id
                      ? "opacity-100 text-blue-600 translate-x-0.5"
                      : ""
                  }`}
                />
              </button>
            ))}
          </aside>

          {/* Policy Text Content */}
          <main className="col-span-1 lg:col-span-3 bg-white border border-slate-200 p-6 md:p-10 rounded-3xl shadow-sm space-y-10 text-slate-600 leading-relaxed text-sm md:text-base">
            <section id="introduction" className="space-y-3 scroll-mt-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600 shrink-0" /> 1.
                Introduction
              </h2>
              <p>
                Welcome to <strong>Dotmart</strong>. We value your trust and
                respect your privacy. This Privacy Policy details how we
                collect, utilize, safeguard, and disclose your data when you
                visit our website, place orders, or interact with our digital
                delivery channels (including Email and WhatsApp updates).
              </p>
              <p>
                By accessing our services, you explicitly agree to the
                collection and handling structures outlined in this document.
              </p>
            </section>

            <section id="data-collection" className="space-y-3 scroll-mt-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600 shrink-0" /> 2.
                Information We Collect
              </h2>
              <p>
                We collect structural components required to complete orders
                securely:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 marker:text-blue-500">
                <li>
                  <strong>Personal Data:</strong> Name, Email address, WhatsApp
                  phone number, and account credentials.
                </li>
                <li>
                  <strong>Transaction Details:</strong> Payment confirmation
                  timestamps, mobile wallet reference markers (bKash/Nagad
                  transactional parameters), and purchase history.
                </li>
                <li>
                  <strong>Technical Logs:</strong> IP addresses, browser
                  variants, operating systems, and device telemetry used during
                  connection cycles.
                </li>
              </ul>
            </section>

            <section id="data-usage" className="space-y-3 scroll-mt-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600 shrink-0" /> 3. How We
                Use Information
              </h2>
              <p>
                Dotmart utilizes your data strictly for legitimate operational
                purposes:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 marker:text-blue-500">
                <li>
                  Processing transactions and instantly dispatching licensed
                  keys/credentials via Email and WhatsApp.
                </li>
                <li>
                  Verifying checkout payments against local mobile banking
                  networks to block fraudulent actions.
                </li>
                <li>
                  Providing continuous 24/7 technical customer support and
                  executing product replacement warranties.
                </li>
                <li>
                  Improving overall application performance and sending
                  transactional notices.
                </li>
              </ul>
            </section>

            <section id="data-sharing" className="space-y-3 scroll-mt-6">
              <h2 className="text-xl font-bold text-slate-900">
                4. Information Sharing & Disclosure
              </h2>
              <p>
                <strong>
                  We do not sell, lease, or distribute your private contact
                  details to third-party marketing entities.
                </strong>{" "}
                Your data is shared exclusively with necessary processors:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 marker:text-blue-500">
                <li>
                  Authorized payment aggregators overseeing secure bKash and
                  Nagad transfers.
                </li>
                <li>
                  Communication channels tasked with dispatching automated
                  purchase confirmations (such as global SMS, SMTP, and WhatsApp
                  cloud APIs).
                </li>
                <li>
                  Law enforcement or regulatory institutions if mandated legally
                  to prevent financial crime.
                </li>
              </ul>
            </section>

            <section id="data-security" className="space-y-3 scroll-mt-6">
              <h2 className="text-xl font-bold text-slate-900">
                5. Data Security
              </h2>
              <p>
                We execute robust protective protocols including layered Secure
                Socket Layer (SSL) encryption setups to guard your transaction
                payloads. Account tokens and critical data pathways are stored
                safely.
              </p>
              <p>
                While we adapt to modern security frameworks, please note that
                no transmission channel across the open web remains completely
                impregnable; safeguard your local passwords accordingly.
              </p>
            </section>

            <section id="user-rights" className="space-y-3 scroll-mt-6">
              <h2 className="text-xl font-bold text-slate-900">
                6. Your Rights & Choices
              </h2>
              <p>You preserve full command over your digital profile:</p>
              <ul className="list-disc pl-6 space-y-1.5 marker:text-blue-500">
                <li>
                  You may check, alter, or request the purging of your stored
                  personal details at any point.
                </li>
                <li>
                  You can completely opt-out of secondary non-transactional
                  system newsletters.
                </li>
              </ul>
            </section>

            <section id="changes" className="space-y-3 scroll-mt-6">
              <h2 className="text-xl font-bold text-slate-900">
                7. Changes to This Policy
              </h2>
              <p>
                Dotmart reserves the right to modify this statement
                periodically. Any updates will trigger an updated time marker at
                the head of this viewport. Continued usage following
                modification implies consent to the restructured frameworks.
              </p>
            </section>

            <section
              id="contact"
              className="space-y-3 scroll-mt-6 pt-6 border-t border-slate-100"
            >
              <h2 className="text-xl font-bold text-slate-900">
                8. Contact Us
              </h2>
              <p>
                For legal inquiries, account data deletion protocols, or
                structural queries regarding your privacy, contact our support
                squad directly:
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-sm space-y-1 w-fit">
                <p>
                  <strong>Email:</strong> privacy@dotmart.com
                </p>
                <p>
                  <strong>Support Window:</strong> 24/7 Digital Hub Response
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
