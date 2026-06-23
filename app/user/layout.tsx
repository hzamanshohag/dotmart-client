// app/(user)/layout.tsx

import FloatingContact from "@/components/FloatingContact";
import FooterSection from "@/components/layout/FooterSection";
import Navbar from "@/components/layout/NavbarSection";
import { ReactNode } from "react";

const UserLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <FloatingContact />
      <FooterSection />
    </div>
  );
};

export default UserLayout;
