/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  product: { _id: string; [key: string]: any };
  [key: string]: any;
}

interface OrderData {
  _id: string;
  user: object;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  transactionId: string;
  OrderId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatusBadge({ value }: { value: string }) {
  const colors: Record<string, string> = {
    paid: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    processing: "bg-blue-500/15 text-blue-600 border-blue-500/30",
    pending: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
    failed: "bg-red-500/15 text-red-600 border-red-500/30",
  };
  const cls =
    colors[value.toLowerCase()] ??
    "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${cls}`}
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
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
        <Icon className="h-4 w-4 text-primary shrink-0" />
        <span className="shrink-0">{label}</span>
      </div>
      {badge ?? (
        <span className="font-semibold text-sm text-foreground text-right break-all">
          {value}
        </span>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const { userInfo } = useUser();
  const invoiceId = searchParams.get("transactionId");

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    if (!invoiceId) {
      toast.error("Payment verification failed ❌");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyPayment(invoiceId);

        // Guard: check status flag and that payment status is "paid"
        if (!res?.status || res?.data?.status?.toLowerCase() !== "paid") {
          toast.error("Payment verification failed ❌");
          setLoading(false);
          return;
        }

        const order: OrderData = res.data.orderData;
        setOrderData(order);

        fbTrack("Purchase", {
          value: order.totalAmount,
          currency: "BDT",
          content_ids: order.items.map((i) => i.product._id),
          content_type: "product",
        });

        if (userInfo?._id) {
          await clearUserCart(userInfo._id);
        }
      } catch (err: any) {
        toast.error(err?.message || "Verification failed ❌");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [invoiceId, userInfo?._id]);

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <section className="min-h-[90vh] flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm animate-pulse">
          Confirming your payment…
        </p>
      </section>
    );
  }

  // ── Failure ──────────────────────────────────────────────────────────────

  if (!orderData) {
    return (
      <section className="min-h-[90vh] flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-2xl p-10 text-center shadow-sm max-w-sm w-full">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            Payment Verification Failed
          </h1>
          <p className="text-sm text-muted-foreground mb-7">
            We couldn&apos;t confirm your payment. If money was deducted, contact
            support with your transaction ID.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center w-full rounded-xl
              bg-primary text-primary-foreground px-6 py-3 font-semibold
              hover:opacity-90 transition"
          >
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────────

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl opacity-40" />
      </div>

      <div className="relative w-full max-w-xl">
        {/* ── Card ── */}
        <div className="bg-card border border-border rounded-3xl shadow-xl p-8 sm:p-10 text-center">
          {/* Icon */}
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl
            bg-gradient-to-br from-primary to-secondary shadow-lg"
          >
            <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-foreground">
            Order Confirmed 🎉
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
            Thank you for shopping with{" "}
            <span className="font-semibold text-primary">Dotmart</span>. Your
            order is being prepared for delivery.
          </p>

          {/* Amount highlight */}
          <div className="mt-6 inline-flex items-baseline gap-1 rounded-2xl bg-primary/10 border border-primary/20 px-6 py-3">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Total Paid
            </span>
            <span className="ml-2 text-2xl font-bold text-primary">
              {formatCurrency(orderData.totalAmount)}
            </span>
          </div>

          {/* Order details */}
          <div className="mt-7 bg-accent/30 border border-border rounded-2xl px-6 py-2 text-left">
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

          {/* Items count note */}
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Package className="h-3.5 w-3.5 text-primary" />
            {orderData.items.length}{" "}
            {orderData.items.length === 1 ? "item" : "items"} in this order
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={`/user/dashboard/orders/${orderData._id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl
                bg-gradient-to-r from-primary to-secondary
                text-primary-foreground py-3 font-semibold
                hover:opacity-90 transition shadow-md"
            >
              <ShoppingBag className="h-4 w-4" />
              Track Your Order
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl
                border border-border py-3 font-medium text-sm
                text-foreground hover:bg-accent transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5">
          Thank you for choosing Dotmart 💙
        </p>
      </div>
    </section>
  );
}
