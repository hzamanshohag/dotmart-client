"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  Ban,
  Package,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { getSinglelOrdersAdmin } from "@/modules/services/orders/orders.service";

/* ================= Types ================= */
type OrderStatus = "pending" | "processing" | "delivered" | "cancelled";
type PaymentStatus = "pending" | "paid" | "failed";

type OrderItem = {
  product: {
    _id: string;
    name: string;
    images?: string[];
    price: number;
  };
  quantity: number;
  price: number;
};

type OrderType = {
  _id: string;
  createdAt: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  items: OrderItem[];
};

/* ================= Status Config ================= */
const STATUS_CONFIG: Record<
  OrderStatus,
  { badge: string; icon: LucideIcon }
> = {
  pending: {
    badge:
      "bg-yellow-50 text-yellow-700 border border-yellow-200",
    icon: Clock,
  },
  processing: {
    badge:
      "bg-amber-50 text-amber-700 border border-amber-200",
    icon: Package,
  },
  delivered: {
    badge:
      "bg-green-50 text-green-700 border border-green-200",
    icon: CheckCircle2,
  },
  cancelled: {
    badge:
      "bg-red-50 text-red-700 border border-red-200",
    icon: Ban,
  },
};

const PAYMENT_BADGE: Record<PaymentStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  paid: "bg-green-50 text-green-700 border border-green-200",
  failed: "bg-red-50 text-red-700 border border-red-200",
};

/* ================= Component ================= */
export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= Fetch ================= */
  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await getSinglelOrdersAdmin(id);

        if (res?.status) {
          setOrder(res.data);
        } else {
          toast.error("Order not found ❌");
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to load order ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const totalItems = useMemo(
    () => order?.items.reduce((sum, i) => sum + i.quantity, 0) || 0,
    [order]
  );

  /* ================= Loading ================= */
  if (loading) {
    return (
      <div className="bg-white border rounded-3xl p-6 shadow-sm text-center text-gray-500">
        Loading order details...
      </div>
    );
  }

  /* ================= Empty ================= */
  if (!order) {
    return (
      <div className="bg-white border rounded-3xl p-6 shadow-sm text-center">
        <p className="text-lg font-semibold text-gray-900">
          Order not found 😥
        </p>

        <Link
          href="/user/dashboard/orders"
          className="inline-flex mt-5 rounded-full
            bg-gradient-to-r from-blue-600 to-green-600
            text-white px-6 py-3 font-semibold hover:opacity-90 transition"
        >
          Back to Orders →
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.orderStatus];
  const StatusIcon = statusConfig?.icon || Package;

  /* ================= UI ================= */
  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm">
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <Link
          href="/user/dashboard/orders"
          className="inline-flex items-center gap-2 rounded-full
            border border-gray-300 px-5 py-2 text-sm font-semibold
            hover:bg-blue-50 hover:text-blue-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full
            bg-gradient-to-r from-blue-600 to-green-600
            text-white px-5 py-2 text-sm font-semibold hover:opacity-90 transition"
        >
          Continue Shopping →
        </Link>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
      <p className="text-sm text-gray-600 mt-1">
        Order ID:{" "}
        <span className="font-semibold text-gray-900">{order._id}</span>
      </p>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-600">Order Status</p>
          <div
            className={`mt-2 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full
              ${statusConfig.badge}`}
          >
            <StatusIcon className="h-4 w-4" />
            {order.orderStatus.toUpperCase()}
          </div>
        </div>

        <div className="rounded-2xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-600">Payment Status</p>
          <div
            className={`mt-2 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full
              ${PAYMENT_BADGE[order.paymentStatus]}`}
          >
            <PackageCheck className="h-4 w-4" />
            {order.paymentStatus.toUpperCase()}
          </div>
        </div>

        <div className="rounded-2xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-600">Order Date</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border bg-gray-50 p-4 flex justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              ৳{order.totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Items</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{totalItems}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>

        <div className="space-y-4">
          {order.items.map((item, idx) => {
            const img = item.product?.images?.[0] || "/placeholder.png";
            const lineTotal = item.price * item.quantity;

            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center gap-4
                  border rounded-2xl p-4 bg-gray-50"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border bg-white">
                  <Image
                    src={img}
                    alt={item.product?.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-bold text-gray-900 line-clamp-1">
                    {item.product?.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    ৳{item.price} × {item.quantity}
                  </p>
                </div>

                <p className="text-sm font-bold text-gray-900">
                  ৳{lineTotal.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}