"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

// ─── Inline SVG Icons (no external dependency) ────────────────────────────────

function IconXCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function IconRefresh({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
}

function IconHeadphones({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function IconWarning({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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
      <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
        <Icon className="h-4 w-4 text-destructive shrink-0" />
        <span>{label}</span>
      </div>
      <span className="font-semibold text-sm text-foreground text-right break-all">
        {value}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  const commonReasons = [
    "Insufficient balance in your mobile banking account",
    "Transaction was cancelled or timed out",
    "Incorrect PIN or OTP entered",
    "Network or connectivity issue during payment",
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-br from-destructive/15 to-orange-500/10 blur-3xl opacity-50" />
      </div>

      <div className="relative w-full max-w-xl">
        <div className="bg-card border border-border rounded-3xl shadow-xl p-8 sm:p-10 text-center">
          {/* Icon badge */}
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl
            bg-gradient-to-br from-destructive/80 to-destructive shadow-lg"
          >
            <p className="h-10 w-10 text-white">❌</p>
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-foreground">
            Payment Failed
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
            We couldn&apos;t process your payment. No money has been deducted
            from your account. Please try again or use a different method.
          </p>

          {/* Transaction ID (only if present in URL) */}
          {transactionId && (
            <div className="mt-6 bg-accent/30 border border-border rounded-2xl px-6 py-2 text-left">
              <InfoRow
                icon={IconHash}
                label="Transaction ID"
                value={transactionId}
              />
            </div>
          )}

          {/* Common reasons */}
          <div className="mt-6 bg-destructive/5 border border-destructive/20 rounded-2xl p-5 text-left">
            <div className="flex items-center gap-2 mb-3">
              <IconWarning className="h-4 w-4 text-destructive shrink-0" />
              <span className="text-sm font-semibold text-foreground">
                Why did this happen?
              </span>
            </div>
            <ul className="space-y-2">
              {commonReasons.map((reason) => (
                <li
                  key={reason}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive/60 shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl
                border border-border py-3 font-medium text-sm
                text-foreground hover:bg-accent transition"
            >
              <IconBag className="h-4 w-4" />
              Back to Products
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2
                text-sm text-muted-foreground hover:text-primary transition py-1"
            >
              <IconHeadphones className="h-4 w-4" />
              Need help? Contact Support
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5">
          If money was deducted, it will be refunded within 3–5 business days 💙
        </p>
      </div>
    </section>
  );
}
