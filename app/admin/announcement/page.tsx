"use client";

import {
  createAnnouncement,
  deleteAnnouncement,
  getAllAnnouncement,
  updateAnnouncement,
} from "@/modules/services/announcement/announcement.service";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreVertical, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

/* ================= Types ================= */
type AnnouncementType = {
  _id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

/* ================= Page ================= */
export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [text, setText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const announcement = useMemo(
    () =>
      announcements.length ? announcements[announcements.length - 1] : null,
    [announcements],
  );

  /* ================= Fetch ================= */
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await getAllAnnouncement();
      setAnnouncements(Array.isArray(res?.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  /* ================= Actions ================= */
  const handleCreate = async () => {
    if (!text.trim()) return toast.error("Announcement text is required");

    const res = await createAnnouncement({ text });
    if (res?.status) {
      toast.success("Announcement created");
      setText("");
      setOpenCreate(false);
      fetchAnnouncements();
    } else {
      toast.error(res?.message || "Failed to create announcement");
    }
  };

  const openEditModal = (item: AnnouncementType) => {
    setSelectedId(item._id);
    setText(item.text);
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    if (!text.trim()) return toast.error("Announcement text is required");

    const res = await updateAnnouncement(selectedId, { text });
    if (res?.status) {
      toast.success("Announcement updated");
      setOpenEdit(false);
      setText("");
      setSelectedId(null);
      fetchAnnouncements();
    } else {
      toast.error(res?.message || "Failed to update announcement");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteAnnouncement(id);
    if (res?.status) {
      toast.success("Announcement deleted");
      fetchAnnouncements();
    } else {
      toast.error(res?.message || "Failed to delete announcement");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
          <p className="text-sm text-slate-500">
            Manage homepage announcement bar
          </p>
        </div>

        <Button
          onClick={() => {
            setText("");
            setOpenCreate(true);
          }}
          disabled={announcements.length >= 1}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Announcement
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border bg-white p-10 text-center text-slate-400">
          Loading...
        </div>
      )}

      {/* Empty */}
      {!loading && announcements.length === 0 && (
        <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
          No announcements found. Click <b>Add Announcement</b> to create one.
        </div>
      )}

      {/* Desktop Table */}
      {!loading && announcements.length > 0 && (
        <div className="hidden md:block rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Text</th>
                <th className="px-4 py-3 text-left">Created At</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((item, idx) => (
                <tr
                  key={item._id}
                  className="hover:bg-slate-50 border-b last:border-0"
                >
                  <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium max-w-md truncate">
                    {item.text}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
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

      {/* Mobile Cards */}
      {!loading && announcements.length > 0 && (
        <div className="md:hidden space-y-3">
          {announcements.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border bg-white p-4 space-y-3"
            >
              <p className="text-sm text-slate-700">{item.text}</p>
              <p className="text-xs text-slate-400">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <div className="flex gap-2">
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Announcement</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="Enter announcement text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
            <Button
              onClick={handleCreate}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
            >
              Create Announcement
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= Edit Dialog ================= */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="Enter announcement text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
            <Button
              onClick={handleUpdate}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
