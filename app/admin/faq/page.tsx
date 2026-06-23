"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MoreVertical, Plus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getAllfaq,
  createFaq,
  updateFaq,
  deleteFaq,
} from "@/modules/services/faq/faq.service";

/* ================= Types ================= */
type FAQType = {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
};

/* ================= Page ================= */
export default function FAQAdminPage() {
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // Form Fields State
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* ================= Fetch ================= */
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const res = await getAllfaq();
      // Sorted by newest created first
      const data: FAQType[] = Array.isArray(res?.data) ? res.data : [];
      setFaqs(
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch {
      toast.error("Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  /* ================= Actions ================= */
  const handleCreate = async () => {
    if (!question.trim()) return toast.error("Question is required");
    if (!answer.trim()) return toast.error("Answer is required");

    // The service payload is adjusted here to match the dynamic object parameters
    const res = await createFaq({ question, answer } as any);
    if (res?.status) {
      toast.success("FAQ created successfully");
      setQuestion("");
      setAnswer("");
      setOpenCreate(false);
      fetchFAQs();
    } else {
      toast.error(res?.message || "Failed to create FAQ");
    }
  };

  const openEditModal = (item: FAQType) => {
    setSelectedId(item._id);
    setQuestion(item.question);
    setAnswer(item.answer);
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    if (!question.trim()) return toast.error("Question is required");
    if (!answer.trim()) return toast.error("Answer is required");

    const res = await updateFaq(selectedId, { question, answer } as any);
    if (res?.status) {
      toast.success("FAQ updated successfully");
      setOpenEdit(false);
      setQuestion("");
      setAnswer("");
      setSelectedId(null);
      fetchFAQs();
    } else {
      toast.error(res?.message || "Failed to update FAQ");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteFaq(id);
    if (res?.status) {
      toast.success("FAQ deleted successfully");
      fetchFAQs();
    } else {
      toast.error(res?.message || "Failed to delete FAQ");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FAQs</h1>
          <p className="text-sm text-slate-500">
            Manage frequently asked questions and answers
          </p>
        </div>

        <Button
          onClick={() => {
            setQuestion("");
            setAnswer("");
            setOpenCreate(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="rounded-xl border bg-white p-10 text-center text-slate-400">
          Loading...
        </div>
      )}

      {/* Empty State */}
      {!loading && faqs.length === 0 && (
        <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
          No FAQs found. Click <b>Add FAQ</b> to create one.
        </div>
      )}

      {/* Desktop View (Table) */}
      {!loading && faqs.length > 0 && (
        <div className="hidden md:block rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left w-12">#</th>
                <th className="px-4 py-3 text-left w-1/3">Question</th>
                <th className="px-4 py-3 text-left">Answer</th>
                <th className="px-4 py-3 text-left w-36">Created At</th>
                <th className="px-4 py-3 text-right w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((item, idx) => (
                <tr
                  key={item._id}
                  className="hover:bg-slate-50 border-b last:border-0 align-top"
                >
                  <td className="px-4 py-3 text-slate-500 pt-4">{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 pt-4">
                    {item.question}
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-md pt-4">
                    <p className="line-clamp-2 title={item.answer}">{item.answer}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500 pt-4">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right pt-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem onClick={() => openEditModal(item)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile View (Cards) */}
      {!loading && faqs.length > 0 && (
        <div className="md:hidden space-y-3">
          {faqs.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border bg-white p-4 space-y-3 shadow-sm"
            >
              <div>
                <span className="text-xs font-semibold uppercase text-blue-600 tracking-wider flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" /> Question
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {item.question}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Answer
                </span>
                <p className="text-sm text-slate-600 mt-0.5 line-clamp-3">
                  {item.answer}
                </p>
              </div>
              <div className="text-xs text-slate-400 pt-1 border-t">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="flex gap-2 pt-1">
                <Button className="flex-1" onClick={() => openEditModal(item)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= Create Dialog ================= */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Question</label>
              <Input
                placeholder="e.g., What is your return policy?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Answer</label>
              <Textarea
                placeholder="Enter detailed answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={5}
              />
            </div>

            <Button
              onClick={handleCreate}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98] mt-2"
            >
              Create FAQ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= Edit Dialog ================= */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Question</label>
              <Input
                placeholder="Modify question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Answer</label>
              <Textarea
                placeholder="Modify answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={5}
              />
            </div>

            <Button
              onClick={handleUpdate}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98] mt-2"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}