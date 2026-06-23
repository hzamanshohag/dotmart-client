import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-3xl text-center bg-white border shadow-sm rounded-3xl p-8 md:p-12">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 font-extrabold text-2xl tracking-wide">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.svg"
                width={144}
                height={64}
                alt="Dotmart Logo"
                priority
              />
            </Link>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">
          404
        </h1>

        <p className="text-xl md:text-2xl font-semibold text-gray-800 mt-3">
          Page Not Found 😢
        </p>

        <p className="text-sm md:text-base text-gray-600 mt-3 max-w-xl mx-auto">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="
              h-12 rounded-full px-6
              bg-gradient-to-r from-blue-600 to-green-600
              text-white font-semibold
              hover:from-blue-700 hover:to-green-700
              transition
            "
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
