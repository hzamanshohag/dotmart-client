"use client";

import {
  getAllTrendingOffers,
  createTrendingOffer,
  updateTrendingOffer,
  deleteTrendingOffer,
} from "@/modules/services/trendingOffer/trendingOffer.service";

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

export default function TrendingOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Search + Pagination
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Create/Edit Modal
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  // ✅ Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [ctaLink, setCtaLink] = useState(""); // Product ObjectId
  const [isActive, setIsActive] = useState(true);
  const [priority, setPriority] = useState(0);

  // ✅ Fetch offers
  const fetchOffers = async () => {
    setLoading(true);
    const res = await getAllTrendingOffers();

    // if your api returns {data: []}
    const list = Array.isArray(res?.data) ? res.data : res;
    setOffers(Array.isArray(list) ? list : []);

    setLoading(false);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // ✅ Search (by title or id)
  const filteredOffers = useMemo(() => {
    if (!searchText.trim()) return offers;

    const q = searchText.toLowerCase();
    return offers.filter(
      (offer) =>
        offer?._id?.toLowerCase().includes(q) ||
        offer?.title?.toLowerCase().includes(q)
    );
  }, [offers, searchText]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);

  const paginatedOffers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOffers.slice(start, start + itemsPerPage);
  }, [filteredOffers, currentPage]);

  // ✅ Open Create modal
  const openCreateModal = () => {
    setTitle("");
    setDescription("");
    setImage("");
    setCtaLink("");
    setIsActive(true);
    setPriority(0);
    setOpenCreate(true);
  };

  // ✅ Open Edit modal
  const openEditModal = (offer: any) => {
    setSelectedOffer(offer);
    setTitle(offer?.title || "");
    setDescription(offer?.description || "");
    setImage(offer?.image || "");
    setCtaLink(offer?.ctaLink || "");
    setIsActive(!!offer?.isActive);
    setPriority(Number(offer?.priority || 0));
    setOpenEdit(true);
  };

  // ✅ Create
  const handleCreate = async () => {
    if (title.trim().length < 5) return toast.error("Title min 5 characters!");
    if (!image.trim()) return toast.error("Image URL is required!");
    if (!ctaLink.trim()) return toast.error("CTA Product ID is required!");

    const payload = {
      title,
      description,
      image,
      ctaLink,
      isActive,
      priority,
    };

    const res = await createTrendingOffer(payload);

    if (res?.status || res?.success) {
      toast.success("Trending Offer created ✅");
      setOpenCreate(false);
      fetchOffers();
    } else {
      toast.error(res?.message || "Create failed ❌");
    }
  };

  // ✅ Update
  const handleUpdate = async () => {
    if (!selectedOffer?._id) return;

    if (title.trim().length < 5) return toast.error("Title min 5 characters!");
    if (!image.trim()) return toast.error("Image URL is required!");
    if (!ctaLink.trim()) return toast.error("CTA Product ID is required!");

    const payload = {
      title,
      description,
      image,
      ctaLink,
      isActive,
      priority,
    };

    const res = await updateTrendingOffer(selectedOffer._id, payload);

    if (res?.status || res?.success) {
      toast.success("Trending Offer updated ✅");
      setOpenEdit(false);
      fetchOffers();
    } else {
      toast.error(res?.message || "Update failed ❌");
    }
  };

  // ✅ Delete (soft delete)
  const handleDelete = async (id: string) => {
    const res = await deleteTrendingOffer(id);

    if (res?.status || res?.success) {
      toast.success("Offer deleted (inactive) ✅");
      fetchOffers();
    } else {
      toast.error(res?.message || "Delete failed ❌");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Trending Offers</h1>

        <Button
          onClick={openCreateModal}
          className=" w-full md:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Offer
        </Button>
      </div>

      {/* ✅ Search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by ID or Title..."
            className="pl-9"
          />
        </div>

        {searchText && (
          <Button variant="outline" onClick={() => setSearchText("")}>
            Clear
          </Button>
        )}
      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-4 py-3">Image</th>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Priority</th>
              <th className="text-left px-4 py-3">Active</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : paginatedOffers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No offers found ❌
                </td>
              </tr>
            ) : (
              paginatedOffers.map((offer) => (
                <tr key={offer._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-12 h-12 rounded-md object-cover border"
                    />
                  </td>

                  <td className="px-4 py-3 font-medium">{offer.title}</td>

                  <td className="px-4 py-3">{offer.priority}</td>

                  <td className="px-4 py-3">
                    {offer.isActive ? "✅ Active" : "❌ Inactive"}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-36 bg-white">
                        <DropdownMenuItem onClick={() => openEditModal(offer)}>
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDelete(offer._id)}
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
        <div className="flex justify-between items-center mt-5">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Trending Offer</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-3">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input value={image} onChange={(e) => setImage(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium">CTA Product ID</label>
              <Input
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="MongoDB Product ObjectId"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <Input
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Active</label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <Button
              onClick={handleCreate}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
            >
              Create Offer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ Edit Modal */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trending Offer</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-3">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input value={image} onChange={(e) => setImage(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium">CTA Product ID</label>
              <Input
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="MongoDB Product ObjectId"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <Input
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Active</label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <Button
              onClick={handleUpdate}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
            >
              Update Offer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
