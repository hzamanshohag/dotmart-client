"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-yellow-600 shrink-0" />
        <span>{label}</span>
      </div>

      <span className="font-semibold text-sm text-right break-all">
        {value}
      </span>
    </div>
  );
}

function IconHash({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
}

function IconBag({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconInfo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export default function PaymentCancelPage() {
  const params = useParams();
  const transactionId = params.transactionId as string;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-500/10 blur-3xl opacity-50" />
      </div>

      <div className="relative w-full max-w-xl">
        <div className="bg-card border rounded-3xl shadow-xl p-8 sm:p-10 text-center">
          {/* Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 shadow-lg">
            <span className="text-4xl text-white">⚠️</span>
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-2xl sm:text-3xl font-bold">
            Payment Cancelled
          </h1>

          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Your payment process was cancelled before completion. No charges
            have been made to your account.
          </p>

          {/* Transaction ID */}
          {transactionId && (
            <div className="mt-6 border rounded-2xl px-6 py-2 text-left bg-muted/20">
              <InfoRow
                icon={IconHash}
                label="Transaction ID"
                value={transactionId}
              />
            </div>
          )}

          {/* Notice */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-left">
            <div className="flex items-center gap-2 mb-3">
              <IconInfo className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-semibold">What happens next?</span>
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Your order has not been completed.</li>
              <li>• No payment has been collected.</li>
              <li>• You can retry checkout at any time.</li>
              <li>• Contact support if you experienced an issue.</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            {/* <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-xl bg-yellow-500 text-white py-3 font-semibold hover:bg-yellow-600 transition"
            >
              Retry Payment
            </Link> */}

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 border rounded-xl py-3 font-medium hover:bg-muted transition"
            >
              <IconBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5">
          You can return anytime and complete your purchase 💙
        </p>
      </div>
    </section>
  );
}
