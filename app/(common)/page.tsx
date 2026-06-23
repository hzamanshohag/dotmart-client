import TextMarquee from "@/components/MarqueeItem";
import { Carousel } from "@/components/carousel";
import FAQSection from "@/components/FAQSection";
import FeaturedProductsSection from "@/components/featuredProducts";
import HomeCategorySlider from "@/components/HomeCategorySlider";
import NewArrivalsSection from "@/components/NewArrivals";
import ReviewSection from "@/components/ReviewSection";
import { ServiceHighlights } from "@/components/ServiceHighlights";
import TrendingOffersSection from "@/components/TrendingOffersSection";

const page = async () => {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content with 90% width */}
      <main className="container mx-auto">
        <section className="pt-8 md:pt-6 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Carousel />
          </div>
        </section>
         <section className="container mx-auto px-4 py-8">
        <TextMarquee/>
         </section>
        <ServiceHighlights />
        <HomeCategorySlider />
        <NewArrivalsSection />
        <TrendingOffersSection />
        <FeaturedProductsSection />
        <ReviewSection />
        <FAQSection/>
      </main>
    </div>
  );
};

export default page;
