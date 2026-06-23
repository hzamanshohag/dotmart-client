"use client";



import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, Plus, Search } from "lucide-react";
import {
  approveReviewAdmin,
  createReviewAdmin,
  deleteReviewAdmin,
  getAllReviewsPublic,
  updateReviewAdmin,
} from "@/modules/services/reviews/reviews.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


type ReviewType = any;

const PLATFORMS = ["twitter", "facebook", "linkedin", "instagram", "Youtube"];
const RATINGS = [1, 2, 3, 4, 5];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Search + Pagination
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ✅ Create/Edit Modal
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewType | null>(null);

  // ✅ Form fields
  const [name, setName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState("");

  // ✅ Fetch Reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await getAllReviewsPublic();

      // ✅ API response:
      const list = res?.data?.data || [];
      setReviews(Array.isArray(list) ? list : []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load reviews ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ✅ Search by ID / Name / Platform
  const filteredReviews = useMemo(() => {
    if (!searchText.trim()) return reviews;

    const q = searchText.toLowerCase();

    return reviews.filter((r) => {
      const id = r?._id?.toLowerCase() || "";
      const uname = r?.name?.toLowerCase() || "";
      const plat = r?.social?.platform?.toLowerCase() || "";

      return id.includes(q) || uname.includes(q) || plat.includes(q);
    });
  }, [reviews, searchText]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage]);

  // ✅ Helpers
  const resetForm = () => {
    setName("");
    setUserImage("");
    setPlatform("linkedin");
    setRating(5);
    setText("");
  };

  const openCreateModal = () => {
    resetForm();
    setOpenCreate(true);
  };

  const openEditModal = (review: ReviewType) => {
    setSelectedReview(review);

    setName(review?.name || "");
    setUserImage(review?.userImage || "");
    setPlatform(review?.social?.platform || "linkedin");
    setRating(Number(review?.rating || 5));
    setText(review?.text || "");

    setOpenEdit(true);
  };

  // ✅ Validation (Schema rules)
  const validate = () => {
    if (!name.trim()) return toast.error("Name is required!");
    if (name.trim().length < 2)
      return toast.error("Name must be at least 2 characters!");

    if (!userImage.trim()) return toast.error("User image is required!");
    if (!/^(https?:\/\/).+\.(jpg|jpeg|png|webp)$/.test(userImage.trim()))
      return toast.error("User image must be a valid jpg/jpeg/png/webp URL!");

    if (!platform.trim()) return toast.error("Social platform is required!");

    if (!rating || rating < 1 || rating > 5)
      return toast.error("Rating must be between 1 and 5!");

    if (!text.trim()) return toast.error("Review text is required!");
    if (text.trim().length < 10)
      return toast.error("Review must be at least 10 characters!");

    return true;
  };

  // ✅ Create Review
  const handleCreate = async () => {
    const ok = validate();
    if (ok !== true) return;

    try {
      const payload = {
        name,
        userImage,
        social: { platform },
        rating,
        text,
      };

      const res = await createReviewAdmin(payload);

      if (res?.status) {
        toast.success("Review created ✅");
        setOpenCreate(false);
        fetchReviews();
      } else {
        toast.error(res?.message || "Create failed ❌");
      }
    } catch (err: any) {
      toast.error(err?.message || "Create failed ❌");
    }
  };

  // ✅ Update Review
  const handleUpdate = async () => {
    if (!selectedReview?._id) return;

    const ok = validate();
    if (ok !== true) return;

    try {
      const payload = {
        name,
        userImage,
        social: { platform },
        rating,
        text,
      };

      const res = await updateReviewAdmin(selectedReview._id, payload);

      if (res?.status) {
        toast.success("Review updated ✅");
        setOpenEdit(false);
        fetchReviews();
      } else {
        toast.error(res?.message || "Update failed ❌");
      }
    } catch (err: any) {
      toast.error(err?.message || "Update failed ❌");
    }
  };

  // ✅ Approve Review
  const handleApprove = async (id: string) => {
    try {
      const res = await approveReviewAdmin(id);

      if (res?.status) {
        toast.success("Review approved ✅");
        fetchReviews();
      } else {
        toast.error(res?.message || "Approve failed ❌");
      }
    } catch (err: any) {
      toast.error(err?.message || "Approve failed ❌");
    }
  };

  // ✅ Delete Review
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteReviewAdmin(id);

      if (res?.status) {
        toast.success("Review deleted ✅");
        fetchReviews();
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
        <h1 className="text-2xl font-bold">Reviews</h1>

        <Button
          onClick={openCreateModal}
          className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Review
        </Button>
      </div>

      {/* ✅ Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by ID / Name / Platform..."
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
        <table className="w-full text-sm min-w-[1100px]">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Platform</th>
              <th className="text-left px-4 py-3">Rating</th>
              <th className="text-left px-4 py-3">Approved</th>
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
            ) : paginatedReviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No reviews found ❌
                </td>
              </tr>
            ) : (
              paginatedReviews.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={r.userImage}
                      alt={r.name}
                      className="w-10 h-10 rounded-md object-cover border"
                    />
                    <span className="font-medium">{r.name}</span>
                  </td>

                  <td className="px-4 py-3">
                    {r?.social?.platform?.toUpperCase()}
                  </td>

                  <td className="px-4 py-3">{r.rating} ⭐</td>

                  <td className="px-4 py-3">
                    {r.isApproved ? "✅ Yes" : "❌ No"}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40 bg-white">
                        <DropdownMenuItem onClick={() => openEditModal(r)}>
                          Edit
                        </DropdownMenuItem>

                        {!r.isApproved && (
                          <DropdownMenuItem
                            onClick={() => handleApprove(r._id)}
                          >
                            Approve
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                          onClick={() => handleDelete(r._id)}
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
      <ReviewModal
        open={openCreate}
        setOpen={setOpenCreate}
        title="Create Review"
        name={name}
        setName={setName}
        userImage={userImage}
        setUserImage={setUserImage}
        platform={platform}
        setPlatform={setPlatform}
        rating={rating}
        setRating={setRating}
        text={text}
        setText={setText}
        onSubmit={handleCreate}
        submitText="Create Review"
      />

      {/* ✅ Edit Modal */}
      <ReviewModal
        open={openEdit}
        setOpen={setOpenEdit}
        title="Update Review"
        name={name}
        setName={setName}
        userImage={userImage}
        setUserImage={setUserImage}
        platform={platform}
        setPlatform={setPlatform}
        rating={rating}
        setRating={setRating}
        text={text}
        setText={setText}
        onSubmit={handleUpdate}
        submitText="Update Review"
      />
    </div>
  );
}

/* ✅ Reusable Modal */
function ReviewModal(props: any) {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={props.name}
              onChange={(e) => props.setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">User Image URL</label>
            <Input
              value={props.userImage}
              onChange={(e) => props.setUserImage(e.target.value)}
              placeholder="https://example.com/user.webp"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Social Platform</label>
            <select
              value={props.platform}
              onChange={(e) => props.setPlatform(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PLATFORMS.map((p: string) => (
                <option key={p} value={p}>
                  {p.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Rating Dropdown */}
          <div>
            <label className="text-sm font-medium">Rating</label>
            <select
              value={props.rating}
              onChange={(e) => props.setRating(Number(e.target.value))}
              className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {RATINGS.map((r: number) => (
                <option key={r} value={r}>
                  {r} ⭐
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Review Text</label>
            <Input
              value={props.text}
              onChange={(e) => props.setText(e.target.value)}
              placeholder="Write review..."
            />
          </div>

          <Button
            onClick={props.onSubmit}
            className="w-full rounded-xl py-5 text-base bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
          >
            {props.submitText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
