"use client";

import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/modules/services/category/category.service";

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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [isActive, setIsActive] = useState(true);

  /* ================= Fetch ================= */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategories();
      setCategories(Array.isArray(res?.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= Filter ================= */
  const filteredCategories = useMemo(() => {
    if (!searchId.trim()) return categories;
    const q = searchId.toLowerCase();
    return categories.filter(
      (c) =>
        c?._id?.toLowerCase().includes(q) ||
        c?.name?.toLowerCase().includes(q),
    );
  }, [categories, searchId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchId]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(start, start + itemsPerPage);
  }, [filteredCategories, currentPage]);

  /* ================= CRUD ================= */
  const openCreateModal = () => {
    setName("");
    setPhoto("");
    setIsActive(true);
    setOpenCreate(true);
  };

  const openEditModal = (cat: any) => {
    setSelectedCategory(cat);
    setName(cat.name);
    setPhoto(cat.photo);
    setIsActive(!!cat.isActive);
    setOpenEdit(true);
  };

  const handleCreate = async () => {
    if (!name.trim() || !photo.trim())
      return toast.error("All fields are required");

    const res = await createCategory({ name, photo, isActive });
    if (res?.status || res?.success) {
      toast.success("Category created");
      setOpenCreate(false);
      fetchCategories();
    }
  };

  const handleUpdate = async () => {
    if (!selectedCategory?._id) return;
    const res = await updateCategory(selectedCategory._id, {
      name,
      photo,
      isActive,
    });
    if (res?.status || res?.success) {
      toast.success("Category updated");
      setOpenEdit(false);
      fetchCategories();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteCategory(id);
    if (res?.status || res?.success) {
      toast.success("Category deleted");
      fetchCategories();
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500">Manage product categories</p>
        </div>

        <Button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Category
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-wrap gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search by ID or name..."
            className="pl-9"
          />
        </div>

        {searchId && (
          <Button variant="outline" onClick={() => setSearchId("")}>
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Category ID</th>
              <th className="px-4 py-3 text-left">Photo</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : paginatedCategories.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-500">
                  No categories found
                </td>
              </tr>
            ) : (
              paginatedCategories.map((cat) => (
                <tr key={cat._id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">{cat._id}</td>

                  <td className="px-4 py-3">
                    <img
                      src={cat.photo}
                      alt={cat.name}
                      className="w-10 h-10 rounded-md border object-cover"
                    />
                  </td>

                  <td className="px-4 py-3 font-medium">{cat.name}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        cat.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem onClick={() => openEditModal(cat)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(cat._id)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-between items-center gap-3">
          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2 flex-wrap">
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

      {/* Create Modal */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Photo URL"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
            />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active</span>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <Button
              onClick={handleCreate}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
            >
              Create Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <Input value={photo} onChange={(e) => setPhoto(e.target.value)} />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active</span>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <Button
              onClick={handleUpdate}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
            >
              Update Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
