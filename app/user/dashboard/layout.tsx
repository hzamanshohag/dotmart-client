"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { logout } from "@/modules/AuthService";
import { useUser } from "@/modules/context/UserContext";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsLoading, refetchUser } = useUser();

  const links = [
    { label: "Overview", href: "/user/dashboard", icon: LayoutDashboard },
    { label: "Orders", href: "/user/dashboard/orders", icon: ShoppingBag },
    { label: "Profile", href: "/user/dashboard/profile", icon: User },
    { label: "Change password", href: "/user/dashboard/change-password", icon: User },
  ];

  const activeLink = links.find((l) => pathname === l.href) || links[0];

  const handleLogOut = () => {
    logout();
    setIsLoading(true);
    refetchUser();
    router.push("/");
    router.refresh();
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="w-[95%] md:w-[92%] mx-auto py-6">
        {/* ================= Mobile / Tablet ================= */}
        <div className="lg:hidden mb-4">
          <div className="flex items-center justify-between bg-white border rounded-2xl p-3 shadow-sm">
            {/* Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-3 h-11 rounded-full px-4"
                >
                  <activeLink.icon className="h-4 w-4 shrink-0 text-blue-600 " />
                  <span className="text-sm font-semibold">
                    {activeLink.label}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-60 rounded-xl p-1 bg-white"
              >
                {links.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;

                  return (
                    <DropdownMenuItem
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`flex items-center gap-3 h-11 px-4 rounded-lg cursor-pointer
                        ${
                          active
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <Icon className="h-4 w-4 w-4 shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Logout */}
            <Button
              variant="ghost"
              onClick={handleLogOut}
              className="h-11 w-11 rounded-full text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ================= Layout ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-3xl border shadow-sm p-5 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 text-white flex items-center justify-center">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
              </div>

              <nav className="flex flex-col gap-2">
                {links.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition
                        ${
                          active
                            ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 ${
                          active ? "text-white" : "text-blue-600"
                        }`}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogOut}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-full
                border border-gray-300 py-3 text-sm font-semibold text-gray-700
                hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-3xl border shadow-sm p-4 sm:p-6 min-h-[70vh]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
