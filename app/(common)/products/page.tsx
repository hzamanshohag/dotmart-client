"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import { getAllProductsPublic } from "@/modules/services/product/product.service";
import { getAllCategories } from "@/modules/services/category/category.service";

export enum ProductBadge {
  HOT = "Hot Deal",
  NEW = "New",
  SALE = "Sale",
  FEATURED = "Featured",
  LIMITED = "Limited Offer",
}

type Category = {
  _id: string;
  name: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: boolean;
  status: "enable" | "disable";
  badge?: ProductBadge | string;
  createdAt?: string;
};

type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  sortOrder: "asc" | "desc";
};

function ProductSkeleton() {
  return (
    <div className="w-full h-full flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm animate-pulse">
      <div className="relative h-52 w-full bg-gray-200" />
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="h-3 w-1/3 bg-gray-200 rounded-full" />
        <div className="h-4 w-3/4 bg-gray-200 rounded-full mt-1" />
        <div className="space-y-1.5 mt-2">
          <div className="h-3 w-full bg-gray-200 rounded-full" />
          <div className="h-3 w-5/6 bg-gray-200 rounded-full" />
        </div>
        <div className="h-5 w-1/2 bg-gray-200 rounded-full mt-auto pt-3" />
        <div className="h-10 w-full bg-gray-200 rounded-full mt-4" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryCategory = searchParams.get("category") || "all";
  const querySearch = searchParams.get("search") || "";
  const queryPage = Number(searchParams.get("page") || "1");
  const queryLimit = Number(searchParams.get("limit") || "12");
  const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

  const queryMinPrice = searchParams.get("minPrice") || "";
  const queryMaxPrice = searchParams.get("maxPrice") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: queryLimit,
    total: 0,
    totalPages: 1,
    sortOrder: "desc",
  });

  const [search, setSearch] = useState(querySearch);
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);

  const [minPrice, setMinPrice] = useState(queryMinPrice);
  const [maxPrice, setMaxPrice] = useState(queryMaxPrice);

  useEffect(() => {
    setSearch(querySearch);
    setSelectedCategory(queryCategory);
    setMinPrice(queryMinPrice);
    setMaxPrice(queryMaxPrice);
  }, [querySearch, queryCategory, queryMinPrice, queryMaxPrice]);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      const list = res?.data?.data || res?.data || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load categories ❌");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fixed arguments to safe-guard against rigid backend type definitions
      const apiParams: any = {
        search: querySearch || undefined,
        category: querySearch
          ? undefined
          : queryCategory !== "all"
            ? queryCategory
            : undefined,
        page: queryPage,
        limit: queryLimit,
        sortOrder,
      };

      // Only inject if the backend fields are open, otherwise dynamic filtering manages it downstream
      if (queryMinPrice) apiParams.minPrice = Number(queryMinPrice);
      if (queryMaxPrice) apiParams.maxPrice = Number(queryMaxPrice);

      const res = await getAllProductsPublic(apiParams);

      setProducts(res?.data?.data || []);
      setMeta(
        res?.data?.meta || {
          page: 1,
          limit: queryLimit,
          total: 0,
          totalPages: 1,
          sortOrder: "desc",
        },
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to load products ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [
    querySearch,
    queryCategory,
    queryPage,
    queryLimit,
    sortOrder,
    queryMinPrice,
    queryMaxPrice,
  ]);

  // Robust client-side protection filtering and sorting engine fallback
  const activeProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      if (p.status !== "enable") return false;

      const minBound = queryMinPrice ? Number(queryMinPrice) : 0;
      const maxBound = queryMaxPrice ? Number(queryMaxPrice) : Infinity;

      return p.price >= minBound && p.price <= maxBound;
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  }, [products, queryMinPrice, queryMaxPrice, sortOrder]);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    params.set("page", "1");

    router.push(`/products?${params.toString()}`);
  };

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("search", search.trim());
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/products?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    router.push("/products");
  };

  return (
    <section className="w-full py-10 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              All Products
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Browse & filter products from our store
            </p>
          </div>

          {/* Search Content */}
          <div className="w-full md:max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleSearchSubmit();
                  }
                }}
                placeholder="Search products..."
                className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white text-sm"
              />
            </div>
            <button
              disabled={loading}
              onClick={handleSearchSubmit}
              className="mt-3 w-full rounded-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 font-semibold text-sm hover:from-blue-700 hover:to-green-700 transition disabled:opacity-50"
            >
              Search →
            </button>
          </div>
        </div>

        {/* Filters Configuration Panel */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 flex-1">
            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <p className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                Category:
              </p>
              <select
                value={selectedCategory}
                onChange={(e) => updateQuery("category", e.target.value)}
                className="h-11 rounded-full border border-gray-200 px-4 text-sm bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 min-w-[160px]"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Target UI */}
            <form
              onSubmit={handlePriceSubmit}
              className="flex flex-wrap items-center gap-3"
            >
              <p className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                Price Range (৳):
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-20 h-11 px-3 text-sm bg-white border border-gray-200 rounded-full outline-none text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <span className="text-gray-400 text-sm">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-24 h-11 px-3 text-sm bg-white border border-gray-200 rounded-full outline-none text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  className="h-11 px-4 text-xs font-bold text-blue-600 border border-blue-200 rounded-full bg-blue-50 hover:bg-blue-100 transition whitespace-nowrap"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>

          {/* Sorting and Clear Strategy */}
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-700">Sort:</p>
              <select
                value={sortOrder}
                onChange={(e) => updateQuery("sortOrder", e.target.value)}
                className="h-11 rounded-full border border-gray-200 px-4 text-sm bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 min-w-[160px]"
              >
                <option value="asc">Price: Low → High</option>
                <option value="desc">Price: High → Low</option>
              </select>
            </div>

            {(querySearch ||
              queryCategory !== "all" ||
              queryMinPrice ||
              queryMaxPrice) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-red-500 hover:text-red-600 hover:underline transition whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Content Layout Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: queryLimit }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        ) : activeProducts.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-700">
              No products found inside this range 😥
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            {activeProducts.map((product) => {
              const img = product.images?.[0] || "/placeholder.png";
              const discount =
                product.originalPrice && product.originalPrice > product.price
                  ? Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100,
                    )
                  : 0;

              return (
                <div
                  key={product._id}
                  className="group h-full flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative h-52 bg-gray-50 flex-shrink-0">
                    <Image
                      src={img}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1 min-h-0">
                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">
                      {product.category?.name || "Uncategorized"}
                    </p>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed flex-1">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mt-4 pt-1">
                      <span className="text-base font-bold text-blue-600">
                        ৳{product.price}
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ৳{product.originalPrice}
                          </span>
                        )}
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-4 block w-full text-center text-xs font-semibold bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-full shadow-sm hover:from-blue-700 hover:to-green-700 transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Section */}
        {!loading && meta && meta.totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2 flex-wrap">
            {Array.from({ length: meta.totalPages }).map((_, i) => {
              const page = i + 1;
              const active = page === meta.page;

              return (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`h-10 w-10 rounded-full border text-sm font-semibold transition-all duration-150 ${
                    active
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}