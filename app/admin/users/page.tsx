"use client";

import {
  blockUser,
  createUser,
  deleteUser,
  getAllUsers,
  unblockUser,
  updateUser,
} from "@/modules/services/user/user.service";

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

type UserType = any;

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Search + Pagination
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ✅ Create/Edit Modal
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // ✅ Form Fields (NO DEFAULT DATA ✅)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [userStatus, setUserStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  // ✅ Fetch Users
const fetchUsers = async () => {
  try {
    setLoading(true);
    const res = await getAllUsers();
    const list = res?.data?.data || [];
    setUsers(Array.isArray(list) ? list : []);
  } catch (error: any) {
    toast.error(error?.message || "Failed to fetch users ❌");
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Search by ID / Name / Email
  const filteredUsers = useMemo(() => {
    if (!searchText.trim()) return users;

    const q = searchText.toLowerCase();
    return users.filter(
      (u) =>
        u?._id?.toLowerCase().includes(q) ||
        u?.name?.toLowerCase().includes(q) ||
        u?.email?.toLowerCase().includes(q)
    );
  }, [users, searchText]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  // ✅ Reset Form
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setPhotoUrl("");
    setRole("USER");
    setUserStatus("ACTIVE");
  };

  // ✅ Open Create modal
  const openCreateModal = () => {
    resetForm();
    setOpenCreate(true);
  };

  // ✅ Open Edit modal
  const openEditModal = (user: UserType) => {
    setSelectedUser(user);

    setName(user?.name || "");
    setEmail(user?.email || "");
    setPassword(""); // ✅ don't set from backend (security)
    setPhoneNumber(user?.phoneNumber || "");
    setPhotoUrl(user?.photoUrl || "");

    setRole(user?.role || "USER");
    setUserStatus(user?.userStatus || "ACTIVE");

    setOpenEdit(true);
  };

  // ✅ Payload Builder (NO DEFAULT DATA ✅)
  const buildPayload = () => {
    const payload: any = {
      name,
      email,
      phoneNumber,
      role,
      userStatus,
    };

    // only send optional fields when user filled
    if (photoUrl.trim()) payload.photoUrl = photoUrl.trim();

    // password only send if create OR admin wants to update
    if (password.trim()) payload.password = password.trim();

    return payload;
  };

  // ✅ Validation (Backend handles defaults ✅)
  const validate = (isEdit = false) => {
    if (!name.trim()) return toast.error("Name is required!");
    if (!email.trim()) return toast.error("Email is required!");
    if (!phoneNumber.trim()) return toast.error("Phone number is required!");

    // create user must include password
    if (!isEdit && !password.trim())
      return toast.error("Password is required!");

    return true;
  };

  // ✅ Create
const handleCreate = async () => {
  const ok = validate(false);
  if (ok !== true) return;

  try {
    const payload = buildPayload();
    const res = await createUser(payload);

    if (res?.status) {
      toast.success("User created ✅");
      setOpenCreate(false);
      fetchUsers();
    } else {
      toast.error(res?.message || "Create failed ❌");
    }
  } catch (err: any) {
    toast.error(err?.message || "Create failed ❌");
  }
};


  // ✅ Update
  const handleUpdate = async () => {
    if (!selectedUser?._id) return;
    const ok = validate(true);
    if (ok !== true) return;

    try {
      const payload = buildPayload();
      const res = await updateUser(selectedUser._id, payload);

      if (res?.status || res?.success) {
        toast.success("User updated ✅");
        setOpenEdit(false);
        fetchUsers();
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
      const res = await deleteUser(id);

      if (res?.status || res?.success) {
        toast.success("User deleted ✅");
        fetchUsers();
      } else {
        toast.error(res?.message || "Delete failed ❌");
      }
    } catch (err: any) {
      toast.error(err?.message || "Delete failed ❌");
    }
  };

  // ✅ Block / Unblock
  const handleToggleBlock = async (user: UserType) => {
    try {
      const isBlocked = user?.userStatus === "INACTIVE";

      const res = isBlocked
        ? await unblockUser(user._id)
        : await blockUser(user._id);

      if (res?.status || res?.success) {
        toast.success(isBlocked ? "User unblocked ✅" : "User blocked ✅");
        fetchUsers();
      } else {
        toast.error(res?.message || "Action failed ❌");
      }
    } catch (err: any) {
      toast.error(err?.message || "Action failed ❌");
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Users</h1>

        <Button
          onClick={openCreateModal}
          className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* ✅ Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by ID / Name / Email..."
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
              <th className="text-left px-4 py-3">Photo</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No users found ❌
                </td>
              </tr>
            ) : (
              paginatedUsers.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={
                        u?.photoUrl ||
                        "https://i.ibb.co.com/1fyRdSjb/demo-user-logo.png"
                      }
                      alt={u.name}
                      className="w-12 h-12 rounded-md object-cover border"
                    />
                  </td>

                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{u.email}</p>

                    {u?.phoneNumber && (
                      <p className="text-xs text-gray-500">
                        📞 {u.phoneNumber}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {u.role === "ADMIN" ? "👑 ADMIN" : "👤 USER"}
                  </td>

                  <td className="px-4 py-3">
                    {u.userStatus === "ACTIVE" ? "✅ ACTIVE" : "⛔ BLOCKED"}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40 bg-white">
                        <DropdownMenuItem onClick={() => openEditModal(u)}>
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleToggleBlock(u)}
                          className={
                            u?.userStatus === "ACTIVE"
                              ? "text-yellow-600 focus:text-yellow-600"
                              : "text-green-600 focus:text-green-600"
                          }
                        >
                          {u?.userStatus === "ACTIVE" ? "Block" : "Unblock"}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDelete(u._id)}
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
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
          </DialogHeader>

          <UserForm
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            photoUrl={photoUrl}
            setPhotoUrl={setPhotoUrl}
            role={role}
            setRole={setRole}
            userStatus={userStatus}
            setUserStatus={setUserStatus}
            onSubmit={handleCreate}
            submitText="Create User"
            submitClass="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
            isEdit={false}
          />
        </DialogContent>
      </Dialog>

      {/* ✅ Edit Modal */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          <UserForm
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            photoUrl={photoUrl}
            setPhotoUrl={setPhotoUrl}
            role={role}
            setRole={setRole}
            userStatus={userStatus}
            setUserStatus={setUserStatus}
            onSubmit={handleUpdate}
            submitText="Update User"
            submitClass="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:scale-[0.98]"
            isEdit={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserForm(props: any) {
  return (
    <div className="space-y-5 mt-3">
      {/* ✅ Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input
            value={props.name}
            onChange={(e) => props.setName(e.target.value)}
            placeholder="Name"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <Input
            value={props.email}
            onChange={(e) => props.setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
      </div>

      {/* ✅ Phone + Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Phone Number</label>
          <Input
            value={props.phoneNumber}
            onChange={(e) => props.setPhoneNumber(e.target.value)}
            placeholder="017XXXXXXXX"
          />
        </div>

        {/* <div>
          <label className="text-sm font-medium">
            Password {props.isEdit && "(Optional)"}
          </label>
          <Input
            type="password"
            value={props.password}
            onChange={(e) => props.setPassword(e.target.value)}
            placeholder={props.isEdit ? "Leave blank to keep unchanged" : "Password"}
          />
        </div> */}
      </div>

      {/* ✅ Photo URL */}
      <div>
        <label className="text-sm font-medium">Photo URL (Optional)</label>
        <Input
          value={props.photoUrl}
          onChange={(e) => props.setPhotoUrl(e.target.value)}
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      {/* ✅ Role + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Role</label>
          <select
            value={props.role}
            onChange={(e) => props.setRole(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">User Status</label>
          <select
            value={props.userStatus}
            onChange={(e) => props.setUserStatus(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* ✅ Quick Block Toggle */}
      <div className="flex items-center justify-between border rounded-lg px-3 py-3">
        <span className="text-sm font-medium">Blocked?</span>
        <Switch
          checked={props.userStatus === "INACTIVE"}
          onCheckedChange={(checked: boolean) =>
            props.setUserStatus(checked ? "INACTIVE" : "ACTIVE")
          }
        />
      </div>

      {/* ✅ Submit Button */}
      <Button
        onClick={props.onSubmit}
        className={`w-full ${props.submitClass} rounded-xl py-5 text-base`}
      >
        {props.submitText}
      </Button>
    </div>
  );
}
