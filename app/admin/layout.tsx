"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  User,
  AppWindow,
  MessageSquare,
  CheckSquare,
  Package,
  ShoppingCart,
  Star,
  Menu,
  LogOut,
  Home,
  HelpCircle
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { useUser } from "@/modules/context/UserContext";
import { logout } from "@/modules/AuthService";
import { protectedRoutes } from "@/modules/contants";
import Image from "next/image";

/* ================= Sidebar Links ================= */
const sidebarLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {label:"Announcement", href:"/admin/announcement",icon:Star},
  { label: "Hero Section", href: "/admin/hero", icon: CheckSquare },
  { label: "Categories", href: "/admin/categories", icon: AppWindow },
  {
    label: "Trending Offers",
    href: "/admin/trending-offers",
    icon: MessageSquare,
  },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  {label:"FAQ", href:"/admin/faq",icon:HelpCircle},
  { label: "Edit Profile", href: "/admin/edit-profile", icon: User},
];

/* ================= Sidebar ================= */
function SidebarContent({
  pathname,
  onClickLink,
  onLogout,
}: {
  pathname: string;
  onClickLink?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-6 py-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.svg"
            width={144}
            height={64}
            alt="Dotmart Logo"
            priority
          />
          
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-3 text-xs font-semibold text-muted-foreground">
          MANAGEMENT
        </p>

        <nav className="space-y-1">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClickLink}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    active ? "text-blue-600" : "text-gray-400",
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="px-4 py-4 border-t">
        <Button
          onClick={onLogout}
          variant="destructive"
          className="w-full rounded-xl text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}

/* ================= Layout ================= */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setIsLoading, refetchUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogOut = () => {
    logout();
    setIsLoading(true);
    refetchUser();
    router.refresh();

    if (protectedRoutes.some((route) => pathname.match(route))) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[260px] border-r bg-white sticky top-0 h-screen">
          <SidebarContent pathname={pathname} onLogout={handleLogOut} />
        </aside>

        {/* Main Area */}
        <div className="flex-1 min-w-0">
          {/* Mobile Topbar */}
          <div className="lg:hidden sticky top-0 z-50 bg-white border-b">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Dotmart Admin
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Control Panel
                </p>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="left" className="p-0 w-[260px]">
                  <SidebarContent
                    pathname={pathname}
                    onLogout={handleLogOut}
                    onClickLink={() => {}}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Page Content */}
          <main className="p-4 sm:p-6">
            <div className="rounded-2xl bg-white border shadow-sm p-4 sm:p-6 min-h-[calc(100vh-120px)]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
