"use client";

import {
  createHero,
  deleteHero,
  getAllHero,
  updateHero,
} from "@/modules/services/hero/hero.service";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreVertical, Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

/* ================= Types ================= */
type HeroImage = {
  image: string;
  alt: string;
  link: string;
};

type HeroType = {
  _id: string;
  carouselImages: HeroImage[];
  sideImages: HeroImage[];
  isActive: boolean;
};

/* ================= Page ================= */
export default function HeroPage() {
  const [heroes, setHeroes] = useState<HeroType[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [carouselImages, setCarouselImages] = useState<HeroImage[]>([]);
  const [sideImages, setSideImages] = useState<HeroImage[]>([]);
  const [isActive, setIsActive] = useState(true);

  const hero = useMemo(
    () => (heroes.length ? heroes[heroes.length - 1] : null),
    [heroes],
  );

  /* ================= Fetch ================= */
  const fetchHero = async () => {
    try {
      setLoading(true);
      const res = await getAllHero();
      setHeroes(Array.isArray(res?.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch hero");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  /* ================= Actions ================= */
  const handleCreateHero = async () => {
    if (heroes.length) return toast.error("Hero already exists");
    const res = await createHero({
      carouselImages: [],
      sideImages: [],
      isActive: true,
    });

    if (res?.status) {
      toast.success("Hero created");
      fetchHero();
    }
  };

  const openEditModal = () => {
    if (!hero) return;
    setCarouselImages(hero.carouselImages || []);
    setSideImages(hero.sideImages || []);
    setIsActive(hero.isActive);
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    if (!hero) return;
    const res = await updateHero(hero._id, {
      carouselImages,
      sideImages,
      isActive,
    });

    if (res?.status) {
      toast.success("Hero updated");
      setOpenEdit(false);
      fetchHero();
    }
  };

  const handleDeleteHero = async () => {
    if (!hero) return;
    const res = await deleteHero(hero._id);
    if (res?.status) {
      toast.success("Hero deleted");
      setHeroes([]);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hero Section</h1>
          <p className="text-sm text-slate-500">Manage homepage hero content</p>
        </div>

        <Button
          onClick={handleCreateHero}
          disabled={heroes.length >= 1}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Hero
        </Button>
      </div>

      {/* Empty */}
      {!hero && !loading && (
        <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
          No hero data found. Click <b>Create Hero</b> to add one.
        </div>
      )}

      {/* Desktop Table */}
      {hero && (
        <div className="hidden md:block rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Carousel</th>
                <th className="px-4 py-3 text-left">Side</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-slate-50 ">
                <td className="px-4 py-3 font-medium">
                  {hero.carouselImages.length}
                </td>
                <td className="px-4 py-3">{hero.sideImages.length}</td>
                <td className="px-4 py-3">
                  {hero.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem onClick={openEditModal}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleDeleteHero}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Card */}
      {hero && (
        <div className="md:hidden rounded-xl border bg-white p-4 space-y-3">
          <p className="text-sm">
            <b>Carousel:</b> {hero.carouselImages.length}
          </p>
          <p className="text-sm">
            <b>Side:</b> {hero.sideImages.length}
          </p>
          <p className="text-sm">
            <b>Status:</b> {hero.isActive ? "Active" : "Inactive"}
          </p>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={openEditModal}>
              Edit
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDeleteHero}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* ================= Edit Dialog ================= */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hero</DialogTitle>
          </DialogHeader>

          {/* Active */}
          <div className="flex items-center justify-between border rounded-lg p-3">
            <p className="text-sm font-medium">Hero Active</p>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {/* Carousel */}
          <Section
            title="Carousel Images"
            items={carouselImages}
            onAdd={() =>
              setCarouselImages([
                ...carouselImages,
                { image: "", alt: "", link: "" },
              ])
            }
            onDelete={(i: any) =>
              setCarouselImages(carouselImages.filter((_, x) => x !== i))
            }
            onChange={(i: any, f: any, v: any) => {
              const c = [...carouselImages];
              c[i] = { ...c[i], [f]: v };
              setCarouselImages(c);
            }}
          />

          {/* Side */}
          <Section
            title="Side Images"
            items={sideImages}
            onAdd={() =>
              setSideImages([...sideImages, { image: "", alt: "", link: "" }])
            }
            onDelete={(i: any) =>
              setSideImages(sideImages.filter((_, x) => x !== i))
            }
            onChange={(i: any, f: any, v: any) => {
              const s = [...sideImages];
              s[i] = { ...s[i], [f]: v };
              setSideImages(s);
            }}
          />

          <Button
            onClick={handleUpdate}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
          >
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================= Reusable Section ================= */
function Section({ title, items, onAdd, onDelete, onChange }: any) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Button
          size="sm"
          onClick={onAdd}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {items.map((item: any, idx: number) => (
        <div
          key={idx}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 border rounded-lg p-3"
        >
          <Input
            placeholder="Image URL"
            value={item.image}
            onChange={(e) => onChange(idx, "image", e.target.value)}
          />
          <Input
            placeholder="Alt text"
            value={item.alt}
            onChange={(e) => onChange(idx, "alt", e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Link"
              value={item.link}
              onChange={(e) => onChange(idx, "link", e.target.value)}
            />
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onDelete(idx)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
