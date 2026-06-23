"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Heart,
  Search,
  ShoppingCart,
  Menu,
  User,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

import { useUser } from "@/modules/context/UserContext";
import { logout } from "@/modules/AuthService";
import { protectedRoutes } from "@/modules/contants";

import { getAllCategories } from "@/modules/services/category/category.service";
import Image from "next/image";

type CategoryType = {
  _id: string;
  name: string;
  slug?: string;
  photo: string;
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-blue-600 border-r-green-600 animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [navLoading, setNavLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { userInfo, setIsLoading, refetchUser } = useUser();

  const userName = userInfo?.name;
  const userEmail = userInfo?.email;
  const userImage = userInfo?.photoUrl;
  const isLoggedIn = !!userInfo?.email;
  const userRole = userInfo?.role;

  // ✅ categories state
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [catLoading, setCatLoading] = useState(false);

  // ✅ Fetch Categories and Save into State
  const fetchCategories = async () => {
    try {
      setCatLoading(true);
      if (categories.length === 0) {
        setIsInitialLoading(true);
      }

      const res = await getAllCategories();

      // ✅ supports different shapes (like your products page style)
      const list = res?.data?.data || res?.data || [];

      setCategories(Array.isArray(list) ? list : []);
    } catch (err) {
      console.log("❌ failed to fetch categories");
    } finally {
      setCatLoading(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-stop loading when route changes
  useEffect(() => {
    setNavLoading(false);
  }, [pathname, searchParams.toString()]);

  // ✅ navItems dynamic (max 5 categories)
  const navItems = useMemo(() => {
    const dynamic = categories.slice(0, 5).map((cat) => ({
      label: cat.name,
      href: `/products?category=${cat._id}`,
    }));

    return [{ label: "Home", href: "/" }, ...dynamic];
  }, [categories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = searchQuery.trim();
    if (!query) return;

    setNavLoading(true);

    const params = new URLSearchParams();

    // ✅ search across ALL categories
    params.set("search", query);

    // ✅ always reset pagination
    params.set("page", "1");
    setSearchQuery("");
    router.push(`/products?${params.toString()}`);
    setIsMobileMenuOpen(false);
  };

const handleLogOut = async () => {
  try {
    setNavLoading(true);

    await logout();
    await refetchUser();

    router.refresh();

    setTimeout(() => {
      window.location.reload();
    }, 300);
  } catch (error) {
    console.error("Logout failed:", error);
    setNavLoading(false);
  }
};

  return (
    <>
      {(isInitialLoading || navLoading) && <LoadingSpinner />}
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
        {/* Top Bar - Announcement or Promotions */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-1.5 text-center text-xs">
          <p>
            100% authentic digital products with instant delivery! | Instant
            delivery. Secure payment.
          </p>
        </div>

        {/* Main Navigation */}
        <div className="container mx-auto px-4 md:px-10 lg:px-28">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.svg"
                width={144}
                height={64}
                alt="Dotmart Logo"
                priority
                className="porda-no-filter"
              />
            </Link>

            {/* Search Bar - Smaller Size */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 h-10 rounded-full border-gray-300 focus-visible:ring-blue-500 focus-visible:border-blue-500 w-full pr-12"
                />
                <Button
                  disabled={navLoading}
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 rounded-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                >
                  Search
                </Button>
              </form>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {userRole === "USER" && (
                <Link href="/user/cart" className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full p-2 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="  flex items-center gap-1 rounded-full p-1 pr-3
    bg-blue-50/70
    hover:bg-gradient-to-r hover:from-blue-100 hover:to-green-100
    transition-colors"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={userImage || ""}
                          alt={userName || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-green-100 text-blue-600 text-xs">
                          {userName?.slice(0, 2)?.toUpperCase() || "US"}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className=" w-56
    rounded-2xl
    border border-gray-100
    bg-white
    shadow-xl
    p-1"
                  >
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium">{userName}</p>
                      {/* <p className="text-xs text-gray-500">{userEmail}</p> */}
                    </div>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${(userRole || "user").toLowerCase()}/dashboard`}
                        className="flex items-center gap-2 w-full"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogOut}
                      className="text-blue-600 focus:text-blue-600 cursor-pointer"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/signin">
                  <Button
                    variant="ghost"
                    className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden px-4">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-80 bg-white overflow-y-auto"
                >
                  <SheetHeader className="pb-4 border-b">
                    <SheetTitle className="flex items-center gap-2 text-blue-600 font-extrabold">
                      <Image
                        src="/images/logo.svg"
                        width={120}
                        height={40}
                        alt="Dotmart Logo"
                        priority
                      />
                    </SheetTitle>
                  </SheetHeader>

                  {/* User Info Section (if logged in) */}
                  {isLoggedIn && (
                    <div className="mt-2 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage
                            src={userImage || ""}
                            alt={userName || "User"}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-green-100 text-blue-600">
                            {userName?.slice(0, 2)?.toUpperCase() || "US"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-800">
                            {userName}
                          </p>
                          {/* <p className="text-xs text-gray-500">{userEmail}</p> */}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Search */}
                  <div className="mt-6 mx-4">
                    <form onSubmit={handleSearch} className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for products..."
                        className="pl-10 h-11 rounded-lg border-gray-300 focus-visible:ring-blue-500 focus-visible:border-blue-500 pr-12"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-9 rounded-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>

                  {/* Categories Section */}
                  <div className="mt-8 px-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Shop by Category
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {catLoading && categories.length === 0 ? (
                        <>
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 p-3 rounded-lg bg-gray-50"
                            >
                              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                          ))}
                        </>
                      ) : (
                        categories.slice(0, 6).map((cat) => (
                          <Link
                            key={cat._id}
                            href={`/products?category=${encodeURIComponent(
                              cat.name,
                            )}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
                          >
                            <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center flex-shrink-0">
                              {cat.photo ? (
                                <Image
                                  src={cat.photo}
                                  alt={cat.name}
                                  width={32}
                                  height={32}
                                  className="object-cover w-full h-full"
                                />
                              ) : null}
                              <span
                                className="text-xs font-bold text-blue-600 hidden"
                                style={{ display: cat.photo ? "none" : "flex" }}
                              >
                                {cat.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-700 truncate">
                              {cat.name}
                            </span>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="mt-8 px-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Navigation
                    </h3>
                    <div className="space-y-1">
                      <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between rounded-lg px-4 py-3 transition-all ${
                          pathname === "/"
                            ? "bg-gradient-to-r from-blue-600 to-green-600 text-white"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        <span className="font-medium">Home</span>
                        <span
                          className={`h-2 w-2 rounded-full ${
                            pathname === "/" ? "bg-white" : "bg-blue-300"
                          }`}
                        />
                      </Link>

                      <Link
                        href="/products"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between rounded-lg px-4 py-3 transition-all ${
                          pathname === "/products"
                            ? "bg-gradient-to-r from-blue-600 to-green-600 text-white"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        <span className="font-medium">All Products</span>
                        <span
                          className={`h-2 w-2 rounded-full ${
                            pathname === "/products"
                              ? "bg-white"
                              : "bg-blue-300"
                          }`}
                        />
                      </Link>

                      {userRole && (
                        <Link
                          href="/user/cart"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between rounded-lg px-4 py-3 transition-all ${
                            pathname === "/user/cart"
                              ? "bg-gradient-to-r from-blue-600 to-green-600 text-white"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        >
                          <span className="font-medium">My Cart</span>
                          <span
                            className={`h-2 w-2 rounded-full ${
                              pathname === "/user/cart"
                                ? "bg-white"
                                : "bg-blue-300"
                            }`}
                          />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Account Section */}
                  <div className="mt-8 px-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      My Account
                    </h3>
                    {!isLoggedIn ? (
                      <Link
                        href="/signin"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                          <User className="h-4 w-4 mr-2" />
                          Sign In / Register
                        </Button>
                      </Link>
                    ) : (
                      <div className="space-y-2">
                        <Link
                          href={`/${(userRole || "user").toLowerCase()}/dashboard`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
                        >
                          <LayoutDashboard className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-gray-700">
                            Dashboard
                          </span>
                        </Link>

                        <Button
                          onClick={() => {
                            handleLogOut();
                            setIsMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full rounded-lg border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        >
                          Logout
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="mt-8 px-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Need Help?
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Email:</span>{" "}
                      support@dotmart.com
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> 1-800-DOTMART
                    </p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Secondary Navigation - Desktop */}
        <nav className="hidden md:block bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-1 py-3 text-center mx-auto">
                {catLoading && categories.length === 0 ? (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 mx-1 h-8 w-20 bg-gray-200 rounded-lg animate-pulse"
                      ></div>
                    ))}
                  </>
                ) : (
                  navItems.map((item) => {
                    const active = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all 
                        ${
                          active
                            ? "bg-gradient-to-r from-blue-600 to-green-600 text-white "
                            : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 "
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })
                )}
              </div>

              {/* Contact Info */}
              {/* <div className="hidden lg:flex items-center gap-4 text-sm text-gray-600">
              <span>Need Help?</span>
              <span className="font-medium text-blue-600">1-800-DOTMART</span>
            </div> */}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
