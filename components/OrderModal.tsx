"use client";

import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { createOrder } from "@/modules/services/orders/orders.service";
import { useUser } from "@/modules/context/UserContext";

type Props = {
  open: boolean;
  onClose: () => void;
  product: {
    _id: string;
    name: string;
    price: number;
    stock: boolean;
    images?: string[];
  };
};

export default function OrderModal({ open, onClose, product }: Props) {
  const { userInfo } = useUser();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalAmount = useMemo(
    () => product.price * quantity,
    [product, quantity]
  );

  if (!open) return null;

 const handleCreateOrder = async () => {
   if (!userInfo?._id) {
     toast.error("Please login first ❌");
     return;
   }

   if (!product?.stock) {
     toast.error("This product is out of stock ❌");
     return;
   }

   if (loading) return; // prevent double click

   try {
     setLoading(true);

     const payload = {
       user: userInfo._id,
       items: [
         {
           product: product._id,
           quantity,
         },
       ],
     };

     const res = await createOrder(payload);

     if (!res?.status) {
       toast.error(res?.message || "Order failed ❌");
       return;
     }

     const paymentUrl = res?.data?.paymentUrl;

     toast.success("Order placed successfully ✅");

     // ✅ If payment required → redirect
     if (paymentUrl) {
       window.location.href = paymentUrl;
       return;
     }

     // ✅ If no payment flow
     onClose();
   } catch (err: any) {
     toast.error(err?.message || "Failed to create order ❌");
   } finally {
     setLoading(false);
   }
 };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-lg font-bold text-gray-900">
            Confirm Your Order
          </h2>

          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Product */}
          <div className="flex gap-4">
            <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-50 border relative">
              <img
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-bold ">৳{product.price}</span>
              </p>
              <p className="text-xs mt-1">
                {product.stock ? (
                  <span className="text-green-600 font-medium">
                    ✅ In Stock
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    ❌ Out of Stock
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-10 w-10 rounded-full border hover:bg-gray-50 transition"
              >
                -
              </button>

              <span className="text-base font-bold">{quantity}</span>

              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="h-10 w-10 rounded-full border hover:bg-gray-50 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm font-semibold text-gray-700">Total Amount</p>
            <p className="text-lg font-bold text-gray-900">৳{totalAmount}</p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-5 flex gap-3">
          <button
            onClick={onClose}
            className="w-full rounded-full py-3 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleCreateOrder}
            className={`w-full rounded-full py-3 font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
            }`}
          >
            {loading ? "Placing..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
