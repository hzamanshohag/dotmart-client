/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShoppingBag,
  Hash,
  CreditCard,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";

import { clearUserCart } from "@/modules/services/cart/cart.service";
import { useUser } from "@/modules/context/UserContext";
import { fbTrack } from "@/lib/metaPixel";
import { verifyPayment } from "@/modules/services/orders/orders.service";

interface OrderItem {
  product: {
    _id: string;
    [key: string]: any;
  };
}

interface OrderData {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  transactionId: string;
  OrderId: string;
  createdAt: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatusBadge({ value }: { value: string }) {
  const colors: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-700 border-emerald-300",
    processing: "bg-blue-100 text-blue-700 border-blue-300",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    failed: "bg-red-100 text-red-700 border-red-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold capitalize ${
        colors[value.toLowerCase()] ||
        "bg-gray-100 text-gray-700 border-gray-300"
      }`}
    >
      <BadgeCheck className="h-3 w-3" />
      {value}
    </span>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b last:border-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <span>{label}</span>
      </div>

      {badge || (
        <span className="text-sm font-semibold text-right break-all">
          {value}
        </span>
      )}
    </div>
  );
}

export default function OrderSuccessPage() {
  const params = useParams();
  const transactionId = params.transactionId as string;

  const { userInfo } = useUser();

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    if (!transactionId) {
      toast.error("Payment verification failed ❌");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyPayment(transactionId);

        if (!res?.data) {
          toast.error("Payment verification failed ❌");
          return;
        }

        const order =
          res?.data?.orderData || res?.data?.data?.orderData || res?.data;

        setOrderData(order);

        fbTrack("Purchase", {
          value: order.totalAmount,
          currency: "BDT",
          content_ids: order.items?.map((item: OrderItem) => item.product._id),
          content_type: "product",
        });

        if (userInfo?._id) {
          await clearUserCart(userInfo._id);
        }

        toast.success("Payment verified successfully 🎉");
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || "Payment verification failed ❌");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [transactionId, userInfo?._id]);

  if (loading) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-gray-500 animate-pulse">
          Confirming your payment...
        </p>
      </section>
    );
  }

  if (!orderData) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border rounded-3xl p-8 text-center shadow-lg">
          <div className="text-6xl mb-4">❌</div>

          <h1 className="text-2xl font-bold mb-3">
            Payment Verification Failed
          </h1>

          <p className="text-gray-500 mb-6">
            We couldn't verify your payment. Please contact support if your
            balance was deducted.
          </p>

          <Link
            href="/products"
            className="inline-flex w-full justify-center rounded-xl bg-blue-600 text-white px-5 py-3 font-semibold hover:bg-blue-700 transition"
          >
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-500/20 to-green-500/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl">
        <div className="bg-white border rounded-3xl shadow-xl p-8 md:p-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 shadow-lg">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>

          <h1 className="mt-6 text-3xl font-bold">Payment Successful 🎉</h1>

          <p className="mt-2 text-gray-500 max-w-sm mx-auto">
            Thank you for shopping with Dotmart. Your order has been received
            and is now being processed.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-50 border border-blue-100 px-6 py-3">
            <span className="text-sm text-blue-600 font-medium">
              Total Paid
            </span>

            <span className="text-2xl font-bold text-blue-700">
              {formatCurrency(orderData.totalAmount)}
            </span>
          </div>

          <div className="mt-7 border rounded-2xl px-6 py-2 text-left bg-gray-50">
            <InfoRow icon={Hash} label="Order ID" value={orderData.OrderId} />

            <InfoRow
              icon={CreditCard}
              label="Transaction ID"
              value={orderData.transactionId}
            />

            <InfoRow
              icon={ShoppingBag}
              label="Payment Status"
              badge={<StatusBadge value={orderData.paymentStatus} />}
            />

            <InfoRow
              icon={Package}
              label="Order Status"
              badge={<StatusBadge value={orderData.orderStatus} />}
            />

            <InfoRow
              icon={Clock}
              label="Placed At"
              value={formatDate(orderData.createdAt)}
            />
          </div>

          <p className="mt-4 text-sm text-gray-500 flex items-center justify-center gap-2">
            <Package className="h-4 w-4" />
            {orderData.items.length} item(s) purchased
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={`/user/dashboard/orders/${orderData._id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 font-semibold hover:opacity-90"
            >
              <ShoppingBag className="h-4 w-4" />
              Track Order
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl border py-3 font-medium hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Thank you for choosing Dotmart 💙
        </p>
      </div>
    </section>
  );
}
