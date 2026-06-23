"use client";

import {
  createProduct,
  deleteProduct,
  getAllProductsAdmin,
  updateProduct,
} from "@/modules/services/product/product.service";

import { getAllCategories } from "@/modules/services/category/category.service";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreVertical, Plus, Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type ProductType = any;

const BADGES = ["New", "Hot Deal", "Sale", "Featured", "Limited Offer"];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Search + Pagination
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ✅ Create/Edit Modal
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );

  // ✅ Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  // ✅ category dropdown
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [images, setImages] = useState<string>(""); // comma separated
  const [badge, setBadge] = useState<string>("New");

  const [freeShipping, setFreeShipping] = useState(false);
  const [freeGift, setFreeGift] = useState(false);
  const [isNewArrivals, setIsNewArrivals] = useState(false);
  const [isBestDeal, setIsBestDeal] = useState(false);
  const [stock, setStock] = useState(true);

  // ✅ Meta
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeyword, setMetaKeyword] = useState(""); // comma separated

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();

      // supports different response shapes
      const list = res?.data?.data || res?.data || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch (error: any) {
      toast.error("Failed to load categories ❌");
    }
  };

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await getAllProductsAdmin();

      const list = res?.data?.data || [];

      setProducts(Array.isArray(list) ? list : []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch products ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ✅ Search by ID or NAME
  const filteredProducts = useMemo(() => {
    if (!searchText.trim()) return products;

    const q = searchText.toLowerCase();
    return products.filter(
      (p) =>
        p?._id?.toLowerCase().includes(q) || p?.name?.toLowerCase().includes(q),
    );
  }, [products, searchText]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // ✅ Helpers
  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setSelectedCategoryId("");
    setPrice(0);
    setOriginalPrice(0);
    setImages("");
    setBadge("New");

    setFreeShipping(false);
    setFreeGift(false);
    setIsNewArrivals(false);
    setIsBestDeal(false);
    setStock(true);

    setMetaTitle("");
    setMetaDescription("");
    setMetaKeyword("");
  };

  // ✅ Open Create modal
  const openCreateModal = () => {
    resetForm();
    setOpenCreate(true);
  };

  // ✅ Open Edit modal
  const openEditModal = (product: ProductType) => {
    setSelectedProduct(product);

    setName(product?.name || "");
    setSlug(product?.slug || "");
    setDescription(product?.description || "");

    setSelectedCategoryId(product?.category?._id || "");

    setPrice(Number(product?.price || 0));
    setOriginalPrice(Number(product?.originalPrice || 0));
    setImages((product?.images || []).join(", "));
    setBadge(product?.badge || "New");

    setFreeShipping(!!product?.freeShipping);
    setFreeGift(!!product?.freeGift);
    setIsNewArrivals(!!product?.isNewArrivals);
    setIsBestDeal(!!product?.isBestDeal);
    setStock(!!product?.stock);

    setMetaTitle(product?.meta?.title || "");
    setMetaDescription(product?.meta?.description || "");
    setMetaKeyword((product?.meta?.keyword || []).join(", "));

    setOpenEdit(true);
  };

  // ✅ Payload Builder
  const buildPayload = () => {
    return {
      name,
      slug,
      description,
      category: selectedCategoryId,
      price,
      originalPrice,
      images: images
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      badge,
      freeShipping,
      freeGift,
      isNewArrivals,
      isBestDeal,
      stock,

      meta: {
        title: metaTitle,
        description: metaDescription,
        keyword: metaKeyword
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      },
    };
  };

  // ✅ Validation
  const validate = () => {
    if (!name.trim()) return toast.error("Name is required!");
    if (!slug.trim()) return toast.error("Slug is required!");
    if (!description.trim()) return toast.error("Description is required!");
    if (!selectedCategoryId) return toast.error("Category is required!");

    if (!price || price <= 0)
      return toast.error("Price must be greater than 0!");
    if (!originalPrice || originalPrice <= 0)
      return toast.error("Original price must be greater than 0!");
    if (!images.trim()) return toast.error("At least 1 image URL required!");

    if (!metaTitle.trim()) return toast.error("Meta title required!");
    if (!metaDescription.trim())
      return toast.error("Meta description required!");
    if (!metaKeyword.trim()) return toast.error("Meta keywords required!");

    return true;
  };

  // ✅ Create
  const handleCreate = async () => {
    const ok = validate();
    if (ok !== true) return;

    try {
      const payload = buildPayload();
      const res = await createProduct(payload);

      if (res?.status || res?.success) {
        toast.success("Product created ✅");
        setOpenCreate(false);
        fetchProducts();
      } else {
        toast.error(res?.message || "Create failed ❌");
      }
    } catch (err: any) {
      toast.error(err?.message || "Create failed ❌");
    }
  };

  // ✅ Update
  const handleUpdate = async () => {
    if (!selectedProduct?._id) return;
    const ok = validate();
    if (ok !== true) return;

    try {
      const payload = buildPayload();
      const res = await updateProduct(selectedProduct._id, payload);

      if (res?.status || res?.success) {
        toast.success("Product updated ✅");
        setOpenEdit(false);
        fetchProducts();
      } else {
        toast.error(res?.message || "Update failed ❌");
      }
    } catch (err: any) {
      toast.error(err?.message || "Update failed ❌");
    }
  };

  // ✅ Delete
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteProduct(id);

      if (res?.status || res?.success) {
        toast.success("Product deleted ✅");
        fetchProducts();
      } else {
        toast.error(res?.message || "Delete failed ❌");
      }
    } catch (err: any) {
      toast.error(err?.message || "Delete failed ❌");
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <Button
          onClick={openCreateModal}
          className=" w-full md:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-2 " />
          Create Product
        </Button>
      </div>

      {/* ✅ Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by ID or Name..."
            className="pl-9"
          />
        </div>

        {searchText && (
          <Button
            variant="outline"
            className="w-full md:w-auto"
            onClick={() => setSearchText("")}
          >
            Clear
          </Button>
        )}
      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="w-full text-sm min-w-[1200px]">
          <thead className="bg-gray-100 border-b">
            <tr>
              {/* ✅ NEW MongoDB ID Column */}
              <th className="text-left px-4 py-3">Product ID</th>

              <th className="text-left px-4 py-3">Image</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Stock</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No products found ❌
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  {/* ✅ MongoDB ID */}
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    {p._id}
                  </td>

                  <td className="px-4 py-3">
                    <img
                      src={p?.images?.[0]}
                      alt={p.name}
                      className="w-12 h-12 rounded-md object-cover border"
                    />
                  </td>

                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">{p?.category?.name || "N/A"}</td>
                  <td className="px-4 py-3">৳{p.price}</td>

                  <td className="px-4 py-3">
                    {p.stock ? "✅ In Stock" : "❌ Out"}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-36 bg-white">
                        <DropdownMenuItem onClick={() => openEditModal(p)}>
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDelete(p._id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mt-5">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>

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

      {/* ✅ Create Modal */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 ">
          <DialogHeader>
            <DialogTitle>Create Product</DialogTitle>
          </DialogHeader>

          <ProductForm
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            name={name}
            setName={setName}
            slug={slug}
            setSlug={setSlug}
            description={description}
            setDescription={setDescription}
            price={price}
            setPrice={setPrice}
            originalPrice={originalPrice}
            setOriginalPrice={setOriginalPrice}
            images={images}
            setImages={setImages}
            badge={badge}
            setBadge={setBadge}
            freeShipping={freeShipping}
            setFreeShipping={setFreeShipping}
            freeGift={freeGift}
            setFreeGift={setFreeGift}
            isNewArrivals={isNewArrivals}
            setIsNewArrivals={setIsNewArrivals}
            isBestDeal={isBestDeal}
            setIsBestDeal={setIsBestDeal}
            stock={stock}
            setStock={setStock}
            metaTitle={metaTitle}
            setMetaTitle={setMetaTitle}
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
            metaKeyword={metaKeyword}
            setMetaKeyword={setMetaKeyword}
            onSubmit={handleCreate}
            submitText="Create Product"
            submitClass="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
          />
        </DialogContent>
      </Dialog>

      {/* ✅ Edit Modal */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          <ProductForm
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            name={name}
            setName={setName}
            slug={slug}
            setSlug={setSlug}
            description={description}
            setDescription={setDescription}
            price={price}
            setPrice={setPrice}
            originalPrice={originalPrice}
            setOriginalPrice={setOriginalPrice}
            images={images}
            setImages={setImages}
            badge={badge}
            setBadge={setBadge}
            freeShipping={freeShipping}
            setFreeShipping={setFreeShipping}
            freeGift={freeGift}
            setFreeGift={setFreeGift}
            isNewArrivals={isNewArrivals}
            setIsNewArrivals={setIsNewArrivals}
            isBestDeal={isBestDeal}
            setIsBestDeal={setIsBestDeal}
            stock={stock}
            setStock={setStock}
            metaTitle={metaTitle}
            setMetaTitle={setMetaTitle}
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
            metaKeyword={metaKeyword}
            setMetaKeyword={setMetaKeyword}
            onSubmit={handleUpdate}
            submitText="Update Product"
            submitClass="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductForm(props: any) {
  return (
    <div className="space-y-5 mt-3">
      {/* Name + Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input
            value={props.name}
            onChange={(e) => props.setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Slug</label>
          <Input
            value={props.slug}
            onChange={(e) => props.setSlug(e.target.value)}
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-medium">Category</label>
        <select
          value={props.selectedCategoryId}
          onChange={(e) => props.setSelectedCategoryId(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Select Category</option>
          {props.categories.map((cat: any) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <Input
          value={props.description}
          onChange={(e) => props.setDescription(e.target.value)}
        />
      </div>

      {/* Price + Original Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Price</label>
          <Input
            type="number"
            value={props.price}
            onChange={(e) => props.setPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Original Price</label>
          <Input
            type="number"
            value={props.originalPrice}
            onChange={(e) => props.setOriginalPrice(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="text-sm font-medium">Images</label>
        <Input
          value={props.images}
          onChange={(e) => props.setImages(e.target.value)}
          placeholder="Comma separated image URLs"
        />
      </div>

      {/* Badge */}
      <div>
        <label className="text-sm font-medium">Badge</label>
        <select
          value={props.badge}
          onChange={(e) => props.setBadge(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {BADGES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Switch Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center justify-between border rounded-lg px-3 py-3">
          <span className="text-sm font-medium">Free Shipping</span>
          <Switch
            checked={props.freeShipping}
            onCheckedChange={props.setFreeShipping}
          />
        </div>

        <div className="flex items-center justify-between border rounded-lg px-3 py-3">
          <span className="text-sm font-medium">Free Gift</span>
          <Switch
            checked={props.freeGift}
            onCheckedChange={props.setFreeGift}
          />
        </div>

        <div className="flex items-center justify-between border rounded-lg px-3 py-3">
          <span className="text-sm font-medium">New Arrivals</span>
          <Switch
            checked={props.isNewArrivals}
            onCheckedChange={props.setIsNewArrivals}
          />
        </div>

        <div className="flex items-center justify-between border rounded-lg px-3 py-3">
          <span className="text-sm font-medium">Best Deal</span>
          <Switch
            checked={props.isBestDeal}
            onCheckedChange={props.setIsBestDeal}
          />
        </div>

        <div className="flex items-center justify-between border rounded-lg px-3 py-3 sm:col-span-2">
          <span className="text-sm font-medium">Stock Available</span>
          <Switch checked={props.stock} onCheckedChange={props.setStock} />
        </div>
      </div>

      {/* SEO Meta */}
      <div className="border-t pt-4 space-y-4">
        <p className="font-semibold text-sm">SEO Meta</p>

        <div>
          <label className="text-sm font-medium">Meta Title</label>
          <Input
            value={props.metaTitle}
            onChange={(e) => props.setMetaTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Meta Description</label>
          <Input
            value={props.metaDescription}
            onChange={(e) => props.setMetaDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Meta Keywords</label>
          <Input
            value={props.metaKeyword}
            onChange={(e) => props.setMetaKeyword(e.target.value)}
            placeholder="Comma separated keywords"
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={props.onSubmit}
        className={`w-full ${props.submitClass} rounded-xl py-5 text-base`}
      >
        {props.submitText}
      </Button>
    </div>
  );
}
