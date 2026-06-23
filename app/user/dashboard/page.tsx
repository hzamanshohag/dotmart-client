"use client";
import Link from "next/link";
import { ClipboardList, User, Lock } from "lucide-react";
import { useUser } from "@/modules/context/UserContext";

const UserDashboardHomePage = () => {
  const { userInfo } = useUser();

  return (
    <section className="space-y-6">
      {/* ✅ Top Header */}
      <div className="border rounded-3xl shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center bg-gray-50">
            <User className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400" />
          </div>

          <div>
            <p className="text-sm text-gray-500">Hello,</p>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              {userInfo?.name || "User"}
            </h1>
          </div>
        </div>
      </div>

      {/* ✅ Dashboard Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        <DashboardCard
          title="Orders"
          href="/user/dashboard/orders"
          icon={<ClipboardList className="h-6 w-6" />}
        />
        <DashboardCard
          title="Edit Profile"
          href="/user/dashboard/profile"
          icon={<User className="h-6 w-6" />}
        />
      </div>
    </section>
  );
};

export default UserDashboardHomePage;

/* ✅ Reusable Card */
const DashboardCard = ({
  title,
  href,
  icon,
}: {
  title: string;
  href: string;
  icon: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="group border rounded-3xl hover:shadow-md transition p-4 sm:p-6 flex flex-col items-center justify-center text-center gap-3"
    >
      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full flex items-center justify-center text-blue-600">
        {icon}
      </div>

      <p className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition">
        {title}
      </p>
    </Link>
  );
};
