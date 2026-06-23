"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Heart, Phone, Mail, CreditCard, Truck } from "lucide-react";

type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export default function CheckoutPage() {
  const [cartItems] = useState<CartItem[]>([
    {
      _id: "1",
      name: "Wireless Mouse",
      price: 25,
      quantity: 1,
      image:
        "https://www.startech.com.bd/image/cache/catalog/mouse/havit/ms989gt/ms989gt-black-blue-002-500x500.webp",
    },
    {
      _id: "2",
      name: "Gaming Keyboard",
      price: 45,
      quantity: 2,
      image:
        "https://www.startech.com.bd/image/cache/catalog/keyboard/havit/hv-kb488l/hv-kb488l-01-500x500.webp",
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState<
    "cod" | "card" | "bkash" | "nagad"
  >("cod");

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Order placed successfully ✅");
  };

  return (
    <section className="w-full py-10 bg-gray-50">
      <div className="w-[90%] mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Checkout
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Complete your order in a few steps
            </p>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-2 text-sm font-medium
              hover:bg-blue-50 hover:text-blue-600 transition"
          >
            ← Back to Cart
          </Link>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-2xl
                  bg-gradient-to-br from-blue-100 to-green-100 text-blue-600"
                >
                  <Truck className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold text-gray-900">
                  Shipping Information
                </h2>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    required
                    placeholder="Enter your name"
                    className="mt-2 w-full h-12 px-4 rounded-full border border-gray-300
                      outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      required
                      placeholder="+880 1XXXXXXXXX"
                      className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-300
                        outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-300
                        outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-2xl
                  bg-gradient-to-br from-blue-100 to-green-100 text-blue-600"
                >
                  <CreditCard className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    key: "cod",
                    title: "Cash on Delivery",
                    desc: "Pay when you receive",
                  },
                  {
                    key: "card",
                    title: "Card Payment",
                    desc: "Visa / Mastercard",
                  },
                  { key: "bkash", title: "bKash", desc: "Mobile wallet" },
                  { key: "nagad", title: "Nagad", desc: "Mobile wallet" },
                ].map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPaymentMethod(p.key as any)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      paymentMethod === p.key
                        ? "border-blue-600 bg-gradient-to-r from-blue-50 to-green-50"
                        : "border-gray-200 hover:bg-blue-50"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{p.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm h-fit">
            <div className="flex items-center gap-2">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-2xl
                bg-gradient-to-br from-blue-100 to-green-100 text-blue-600"
              >
                <Heart className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            </div>

            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border bg-gray-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ${item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full
                bg-gradient-to-r from-blue-600 to-green-600
                text-white py-3 font-semibold
                hover:from-blue-700 hover:to-green-700 transition"
            >
              Place Order →
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Secure payment • Fast delivery 🚚
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

// import { useRouter } from "next/navigation";

// const router = useRouter();

// // after order placed
// router.push("/order-success");
