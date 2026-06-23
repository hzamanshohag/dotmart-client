"use client";

import {
  getAllOrdersAdmin,
  updateOrderStatus,
  updatePaymentStatus,
} from "@/modules/services/orders/orders.service";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Order, OrderStatus, PaymentStatus } from "@/modules/Type/order.types";

type OrderType = Order;
type DateSort = "newest" | "oldest";

const ORDER_STATUSES: OrderStatus[] = [
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Filters
  const [searchText, setSearchText] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "all">(
    "all",
  );
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "all">("all");
  const [dateSort, setDateSort] = useState<DateSort>("newest");

  // 📅 Date range filter
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // 📄 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 👁 Modal
  const [openView, setOpenView] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  /* ================= Fetch ================= */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrdersAdmin();
      setOrders(Array.isArray(res?.data) ? res.data : []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load orders ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= Filter + Sort ================= */
  const filteredOrders = useMemo(() => {
    let list = [...orders];

    // 🔍 Search
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      list = list.filter(
        (o) =>
          o._id?.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q),
      );
    }

    // 💳 Payment
    if (paymentFilter !== "all") {
      list = list.filter((o) => o.paymentStatus === paymentFilter);
    }

    // 📦 Order status
    if (orderFilter !== "all") {
      list = list.filter((o) => o.orderStatus === orderFilter);
    }

    // 📅 Date range filter
    if (fromDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      list = list.filter(
        (o) => new Date(o.createdAt).getTime() >= from.getTime(),
      );
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      list = list.filter(
        (o) => new Date(o.createdAt).getTime() <= to.getTime(),
      );
    }

    // 🔄 Date sort
    list.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return dateSort === "newest" ? bTime - aTime : aTime - bTime;
    });

    return list;
  }, [
    orders,
    searchText,
    paymentFilter,
    orderFilter,
    dateSort,
    fromDate,
    toDate,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, paymentFilter, orderFilter, dateSort, fromDate, toDate]);

  /* ================= Pagination ================= */
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  /* ================= Actions ================= */
  const openViewModal = (order: OrderType) => {
    setSelectedOrder(order);
    setOpenView(true);
  };

  const closeViewModal = () => {
    setOpenView(false);
    setSelectedOrder(null);
  };

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    const res = await updateOrderStatus(id, status);
    if (res?.status) {
      toast.success("Order status updated ✅");
      fetchOrders();
    }
  };

  const handleUpdatePaymentStatus = async (
    id: string,
    status: PaymentStatus,
  ) => {
    const res = await updatePaymentStatus(id, status);
    if (res?.status) {
      toast.success("Payment status updated ✅");
      fetchOrders();
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-4 md:p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {/* Filters */}
      <div className="mb-4 space-y-3">
        {/* Search (full width always) */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search order / user / email..."
            className="pl-9 w-full md:max-w-md"
          />
        </div>

        {/* Other filters */}
        <div
          className="
      grid grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3
      lg:grid-cols-6
      gap-3
    "
        >
          {/* From Date */}
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          {/* To Date */}
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          {/* Payment */}
          <select
            value={paymentFilter}
            onChange={(e) =>
              setPaymentFilter(e.target.value as PaymentStatus | "all")
            }
            className="border rounded-md px-3 py-2 text-sm bg-white w-full"
          >
            <option value="all">All Payments</option>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Order Status */}
          <select
            value={orderFilter}
            onChange={(e) =>
              setOrderFilter(e.target.value as OrderStatus | "all")
            }
            className="border rounded-md px-3 py-2 text-sm bg-white w-full"
          >
            <option value="all">All Orders</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Date Sort */}
          <select
            value={dateSort}
            onChange={(e) => setDateSort(e.target.value as DateSort)}
            className="border rounded-md px-3 py-2 text-sm bg-white w-full"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Table (unchanged except filtering applied) */}
      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Order Date</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Order Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((o) => (
              <tr key={o._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{o._id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{o.user?.name}</p>
                  <p className="text-xs text-gray-500">{o.user?.email}</p>
                </td>
                <td className="px-4 py-3">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 font-semibold">৳{o.totalAmount}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.paymentStatus}
                    onChange={(e) =>
                      handleUpdatePaymentStatus(
                        o._id,
                        e.target.value as PaymentStatus,
                      )
                    }
                    className="border rounded-md px-2 py-1 text-sm bg-white"
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.orderStatus}
                    onChange={(e) =>
                      handleUpdateOrderStatus(
                        o._id,
                        e.target.value as OrderStatus,
                      )
                    }
                    className="border rounded-md px-2 py-1 text-sm bg-white"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openViewModal(o)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex flex-wrap gap-2">
            {/* Prev */}
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}

            {/* Next */}
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ================= Modal ================= */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="w-[95vw] max-w-3xl">
          <DialogHeader className="space-y-1">
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View full order information here.
            </DialogDescription>
          </DialogHeader>

          <button
            onClick={closeViewModal}
            className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>

          {selectedOrder && (
            <div className="mt-4 space-y-4 text-sm">
              <div className="border rounded-lg p-4 space-y-1">
                <p>
                  <b>Order:</b> {selectedOrder._id}
                </p>
                <p>
                  <b>User:</b> {selectedOrder.user?.name} (
                  {selectedOrder.user?.email})
                </p>
                <p>
                  <b>Date:</b>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
                <p>
                  <b>Total:</b> ৳{selectedOrder.totalAmount}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="font-semibold mb-3">Products</p>

                <div className="space-y-3">
                  {selectedOrder.items.map((it, i) => {
                    const product = it.product;
                    const image = product?.images?.[0] || "/placeholder.png";

                    return (
                      <div
                        key={i}
                        className="flex items-center gap-4 border rounded-lg p-3"
                      >
                        <img
                          src={image}
                          alt={product?.name}
                          className="w-16 h-16 rounded-md object-cover border"
                        />

                        <div className="flex-1">
                          <p className="font-medium">{product?.name}</p>
                          <p className="text-xs text-gray-500">
                            ৳{it.price} × {it.quantity}
                          </p>
                        </div>

                        <p className="font-semibold">
                          ৳{it.price * it.quantity}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
