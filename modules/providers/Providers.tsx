"use client";

import { Toaster } from "sonner";
import UserProvider from "../context/UserContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          classNames: {
            success: "bg-red-600 text-white border-red-600",
            error: "bg-red-600 text-white border-red-600",
            warning: "bg-red-600 text-white border-red-600",
            info: "bg-red-600 text-white border-red-600",
            loading: "bg-red-600 text-white border-red-600",
          },
        }}
      />
    </UserProvider>
  );
};

export default Providers;
