"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { Search, Package, Users, ShoppingBag, DollarSign } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getAllOrdersAdmin } from "@/modules/services/orders/orders.service";
import { getAllProductsAdmin } from "@/modules/services/product/product.service";
import { getAllCategories } from "@/modules/services/category/category.service";
import { getAllUsers } from "@/modules/services/user/user.service";

/* ---------------- Helpers ---------------- */
const monthsShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function TakaIcon({ className }: { className?: string }) {
  return <span className={`font-bold ${className}`}>৳</span>;
}

const formatMoney = (n: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
  }).format(n);

const getMonthIndex = (date: string) => new Date(date).getMonth();

function AvatarText(name: string) {
  const parts = (name || "").split(" ");
  return `${parts[0]?.[0] || "U"}${parts[1]?.[0] || ""}`.toUpperCase();
}

/* ================= Component ================= */
export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");

  /* ---------------- Fetch ---------------- */
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [ordersRes, productsRes, categoriesRes, usersRes] =
        await Promise.all([
          getAllOrdersAdmin(),
          getAllProductsAdmin(),
          getAllCategories(),
          getAllUsers(),
        ]);

      setOrders(ordersRes?.data || []);
      setProducts(productsRes?.data?.data || productsRes?.data || []);
      setCategories(categoriesRes?.data?.data || categoriesRes?.data || []);
      setUsers(usersRes?.data?.data || []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ---------------- Calculations ---------------- */
  const paidOrders = useMemo(
    () => orders.filter((o) => o?.paymentStatus === "paid"),
    [orders],
  );

  const totalRevenue = useMemo(
    () => paidOrders.reduce((s, o) => s + Number(o?.totalAmount || 0), 0),
    [paidOrders],
  );

  const chartData = useMemo(() => {
    const data = monthsShort.map((m) => ({ month: m, value: 0 }));
    paidOrders.forEach((o) => {
      data[getMonthIndex(o.createdAt)].value += Number(o.totalAmount || 0);
    });
    return data;
  }, [paidOrders]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 6),
    [orders],
  );

  const filteredRecentOrders = useMemo(() => {
    if (!searchText) return recentOrders;
    const q = searchText.toLowerCase();
    return recentOrders.filter(
      (o) =>
        o._id?.toLowerCase().includes(q) ||
        o.user?.name?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q),
    );
  }, [recentOrders, searchText]);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchDashboard();
    setLoading(false);
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Store performance overview
          </p>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {loading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsContent value="overview" className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Revenue",
                value: formatMoney(totalRevenue),
                icon: TakaIcon,
              },
              {
                title: "Orders",
                value: orders.length,
                icon: ShoppingBag,
              },
              {
                title: "Users",
                value: users.length,
                icon: Users,
              },
              {
                title: "Products",
                value: products.length,
                icon: Package,
              },
            ].map((item, i) => (
              <Card key={i} className="hover:shadow-md transition">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-muted-foreground">
                    {item.title}
                  </CardTitle>
                  <item.icon className="h-5 w-5 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-slate-900">
                    {item.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart + Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Paid orders only
                </p>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any) =>
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "BDT",
                        }).format(value)
                      }
                    />
                    <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    className="pl-9"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
                {filteredRecentOrders.map((o) => (
                  <div
                    key={o._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold">
                        {AvatarText(o?.user?.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{o?.user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {o.paymentStatus} • {o.orderStatus}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatMoney(o.totalAmount)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-muted-foreground">Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
