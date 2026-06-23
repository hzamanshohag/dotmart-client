"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/modules/context/UserContext";
import { getUserOrders } from "@/modules/services/orders/orders.service";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

/* ================= Types ================= */
type OrderStatus = "pending" | "processing" | "delivered" | "cancelled";

type OrderItem = {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
};

type OrderType = {
  _id: string;
  createdAt: string;
  orderStatus: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
};

/* ================= Status Config ================= */
const STATUS_CONFIG: Record<
  OrderStatus,
  { style: string; icon: LucideIcon }
> = {
  pending: {
    style:
      "bg-yellow-50 text-yellow-700 border border-yellow-200",
    icon: Clock,
  },
  processing: {
    style:
      "bg-amber-50 text-amber-700 border border-amber-200",
    icon: Package,
  },
  delivered: {
    style:
      "bg-green-50 text-green-700 border border-green-200",
    icon: CheckCircle2,
  },
  cancelled: {
    style:
      "bg-red-50 text-red-700 border border-red-200",
    icon: Truck,
  },
};

const STATUSES: (OrderStatus | "all")[] = [
  "all",
  "pending",
  "processing",
  "delivered",
  "cancelled",
];

/* ================= Component ================= */
export default function UserOrdersPage() {
  const { userInfo } = useUser();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [page, setPage] = useState(1);

  const PER_PAGE = 5;

  /* ================= Fetch ================= */
  useEffect(() => {
    if (!userInfo?._id) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getUserOrders(userInfo._id);

        if (res?.status) {
          const list = res?.data || res?.data?.data || [];
          setOrders(Array.isArray(list) ? list : []);
        } else {
          toast.error("Failed to load orders ❌");
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to load orders ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo?._id]);

  /* ================= Filter ================= */
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch = order._id
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        status === "all" ? true : order.orderStatus === status;

      return matchSearch && matchStatus;
    });
  }, [orders, search, status]);

  /* ================= Pagination ================= */
  const totalPages = Math.ceil(filteredOrders.length / PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filteredOrders.slice(start, start + PER_PAGE);
  }, [filteredOrders, page]);

  /* ================= UI ================= */
  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Orders
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Search, filter & track your orders
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full
            border border-gray-300 px-5 py-2 text-sm font-semibold
            hover:bg-blue-50 hover:text-blue-600 transition"
        >
          Continue Shopping →
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Order ID..."
            className="pl-10 h-11 rounded-full"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full h-11">
              Status: {status}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-48 bg-white">
            {STATUSES.map((s) => (
              <DropdownMenuItem
                key={s}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
                className="capitalize cursor-pointer"
              >
                {s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-10 text-center text-gray-500">
          Loading orders...
        </div>
      )}

      {/* Orders */}
      {!loading && paginatedOrders.length > 0 && (
        <div className="mt-6 space-y-4">
          {paginatedOrders.map((order) => {
            const config =
              STATUS_CONFIG[order.orderStatus];

            const Icon =
              config?.icon || Package;

            return (
              <div
                key={order._id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4
                  rounded-2xl border bg-gray-50 p-4 hover:shadow-sm transition"
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5
                    rounded-full text-xs font-semibold
                    ${config.style}`}
                >
                  <Icon className="h-4 w-4" />
                  {order.orderStatus.toUpperCase()}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                  <p className="text-sm font-bold text-gray-900">
                    ৳{order.totalAmount.toFixed(2)}
                  </p>

                  <Link
                    href={`/user/dashboard/orders/${order._id}`}
                    className="rounded-full bg-gradient-to-r from-blue-600 to-green-600
                      text-white px-5 py-2 text-sm font-semibold hover:opacity-90"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty */}
      {!loading && filteredOrders.length === 0 && (
        <div className="mt-10 text-center rounded-2xl border bg-gray-50 p-10">
          <p className="text-lg font-semibold text-gray-900">
            No orders found 😥
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Try changing search or filter.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          <Button variant="secondary">
            Page {page} / {totalPages}
          </Button>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}