import FloatingContact from "@/components/FloatingContact";
import FooterSection from "@/components/layout/FooterSection";
import Navbar from "@/components/layout/NavbarSection";

const CommonLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
      <FloatingContact />
      <FooterSection />
    </div>
  );
};

export default CommonLayout;
