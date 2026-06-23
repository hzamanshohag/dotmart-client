"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Truck, Gift, Minus, Plus, X } from "lucide-react";

import { useUser } from "@/modules/context/UserContext";
import { getSingleProductByID } from "@/modules/services/product/product.service";
import { addToCart } from "@/modules/services/cart/cart.service";
import OrderModal from "@/components/OrderModal";

// Loading Component
const LoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-blue-600 border-r-green-600 animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

// ✅ Product Badge Enum (optional)
export enum ProductBadge {
  HOT = "Hot Deal",
  NEW = "New",
  SALE = "Sale",
  FEATURED = "Featured",
  LIMITED = "Limited Offer",
}

// ✅ Category Type
type Category = {
  _id: string;
  name: string;
  photo?: string;
  isActive?: boolean;
};

// ✅ Product Type
export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: boolean;
  status: "enable" | "disable";
  badge?: ProductBadge | string;
  freeShipping?: boolean;
  freeGift?: boolean;
  isNewArrivals?: boolean;
  isBestDeal?: boolean;
  meta?: {
    title?: string;
    description?: string;
    keyword?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const { userInfo } = useUser();

  const [openOrderModal, setOpenOrderModal] = useState(false);

  // ✅ Cart Quantity Modal
  const [openCartModal, setOpenCartModal] = useState(false);
  const [cartQty, setCartQty] = useState(1);

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  // ✅ Fetch Product Details
  const fetchProduct = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const res = await getSingleProductByID(id);
      if (!res?.status || !res?.data) {
        toast.error(res?.message || "Product not found ❌");
        router.push("/products");
        return;
      }

      setProduct(res.data);
      setActiveImage(res.data.images?.[0] || "/placeholder.png");
    } catch (err: any) {
      toast.error(err?.message || "Failed to load product ❌");
      router.push("/products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ✅ Discount %
  const discount = useMemo(() => {
    if (!product?.originalPrice) return 0;
    if (product.originalPrice <= product.price) return 0;

    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    );
  }, [product]);

  // ✅ Open Cart Modal
  const handleOpenCartModal = () => {
    if (!product) return;

    const userId = userInfo?._id;

    if (!userId) {
      toast.error("Please login first ❌");
      return;
    }

    if (!product.stock) {
      toast.error("Product out of stock ❌");
      return;
    }

    setCartQty(1);
    setOpenCartModal(true);
  };

  // ✅ Confirm Add To Cart with quantity
  const handleConfirmAddToCart = async () => {
    if (!product) return;

    const userId = userInfo?._id;

    if (!userId) {
      toast.error("Please login first ❌");
      return;
    }

    if (cartQty < 1) {
      toast.error("Quantity must be at least 1 ❌");
      return;
    }

    try {
      setAdding(true);

      const res = await addToCart({
        user: userId,
        product: product._id,
        quantity: cartQty,
      });

      // ✅ backend returns "status"
      if (res?.status === true) {
        toast.success(res?.message || `${product.name} added to cart ✅`);

        // ✅ CLOSE MODAL ✅
        setOpenCartModal(false);

        // ✅ reset qty
        setCartQty(1);
      } else {
        toast.error(res?.message || "Failed to add to cart ❌");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong ❌");
    } finally {
      setAdding(false);
    }
  };

  // ✅ Quantity Actions
  const increaseQty = () => setCartQty((prev) => prev + 1);
  const decreaseQty = () => setCartQty((prev) => (prev > 1 ? prev - 1 : 1));

  // ✅ Full Page Loading UI
  if (loading) {
    return <LoadingSpinner />;
  }

  // ✅ Empty UI
  if (!product) {
    return (
      <section className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10 lg:px-28 text-center">
          <p className="text-lg font-semibold text-gray-900">
            Product not found 😥
          </p>
          <Link
            href="/products"
            className="inline-block mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium hover:from-blue-700 hover:to-green-700 transition"
          >
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-10 lg:px-28">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full h-[320px] sm:h-[420px] bg-white rounded-2xl border overflow-hidden">
              <Image
                src={activeImage || "/placeholder.png"}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {/* Discount */}
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-green-600 text-white text-xs px-3 py-1 rounded-full">
                  -{discount}%
                </span>
              )}

              {/* Badge */}
              {product.badge && (
                <span className="absolute bottom-3 left-3 bg-black/70 text-white text-[11px] px-3 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl border overflow-hidden ${
                      activeImage === img
                        ? "border-blue-600"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`thumb-${i}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Content */}
          <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
            {/* Category */}
            <p className="text-xs text-gray-500 mb-2">
              Category:{" "}
              <span className="text-gray-800 font-semibold">
                {product.category?.name}
              </span>
            </p>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mt-5">
              <span className="text-3xl font-bold text-blue-600">
                ৳{product.price}
              </span>

              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    ৳{product.originalPrice}
                  </span>
                )}
            </div>

            {/* Stock */}
            <div className="mt-4">
              {product.stock ? (
                <span className="inline-flex items-center text-sm font-medium px-4 py-1 rounded-full bg-green-50 text-green-700">
                  ✅ In Stock
                </span>
              ) : (
                <span className="inline-flex items-center text-sm font-medium px-4 py-1 rounded-full bg-red-50 text-red-700">
                  ❌ Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed mt-5">
              {product.description}
            </p>

            {/* Extras */}
            <div className="mt-6 space-y-3">
              {product.freeShipping && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Truck className="w-4 h-4 text-blue-600" />
                  Free Shipping Available
                </div>
              )}

              {product.freeGift && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Gift className="w-4 h-4 text-blue-600" />
                  Free Gift Included
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {userInfo?._id && (
                <button
                  disabled={!product.stock}
                  onClick={handleOpenCartModal}
                  className={`w-full rounded-full py-3 font-semibold text-white transition ${
                    product.stock
                      ? "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Add to Cart
                </button>
              )}

              <button
                disabled={!product.stock || !userInfo?._id}
                onClick={() => setOpenOrderModal(true)}
                className={`w-full rounded-full py-3 font-semibold text-white transition ${
                  product.stock && userInfo?._id
                    ? "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {userInfo?._id ? "Buy Now" : "Login to Buy"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ CART QUANTITY MODAL */}
      {openCartModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold text-gray-900">Add to Cart</h2>

              <button
                onClick={() => setOpenCartModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Product Info */}
              <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border bg-gray-50">
                  <Image
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">${product.price}</p>
                </div>
              </div>

              {/* Quantity Controller */}
              <div className="flex items-center justify-between bg-gray-50 border rounded-xl p-3">
                <p className="text-sm font-semibold text-gray-900">Quantity</p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQty}
                    className="h-9 w-9 rounded-full border bg-white hover:bg-gray-100 transition flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="text-base font-bold w-8 text-center">
                    {cartQty}
                  </span>

                  <button
                    onClick={increaseQty}
                    className="h-9 w-9 rounded-full border bg-white hover:bg-gray-100 transition flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-600">Total</p>
                <p className="font-bold text-gray-900">
                  ${(product.price * cartQty).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex gap-3">
              <button
                onClick={() => setOpenCartModal(false)}
                className="w-full rounded-full py-2 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                disabled={adding || cartQty < 1}
                onClick={handleConfirmAddToCart}
                className="w-full rounded-full py-2 font-semibold bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 transition disabled:opacity-60"
              >
                {adding ? "Adding..." : "Confirm Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      <OrderModal
        open={openOrderModal}
        onClose={() => setOpenOrderModal(false)}
        product={{
          _id: product._id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          images: product.images,
        }}
      />
    </section>
  );
}
