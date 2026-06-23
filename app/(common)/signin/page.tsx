"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/modules/AuthService";
import { useUser } from "@/modules/context/UserContext";
import Image from "next/image";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { refetchUser } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirectPath");

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    try {
      const res = await loginUser(values);

      if (!res?.success) {
        toast.error(res?.message || "Something went wrong");
        return;
      }

      toast.success(res?.message || "Login successful");
      await refetchUser();
      router.push(redirect || "/");
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  // Modified: Strictly populates and validates the fields without auto-submitting
  const handleDemoLogin = (email: string, password: string) => {
    form.setValue("email", email, { shouldValidate: true, shouldDirty: true });
    form.setValue("password", password, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <section className="flex items-center justify-center bg-gray-50 px-4 py-4 md:py-16">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center rounded-3xl bg-white border shadow-sm p-10">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.svg"
              width={144}
              height={64}
              alt="Dotmart Logo"
              priority
            />
          </Link>

          <h2 className="text-3xl font-bold text-gray-900 mt-8">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600 mt-3 leading-relaxed">
            Sign in to access your orders, add to cart, and exclusive deals.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-blue-50 p-4">
              <p className="text-sm font-semibold text-gray-900">
                Fast Delivery 🚚
              </p>
              <p className="text-sm text-gray-600 mt-1">Instant delivery.</p>
            </div>

            <div className="rounded-2xl border bg-green-50 p-4">
              <p className="text-sm font-semibold text-gray-900">
                Best Deals 💎
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Discounts on top products
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="rounded-3xl bg-white border shadow-sm p-8 md:p-10">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-6">
            <Image
              src="/images/logo.svg"
              width={144}
              height={64}
              alt="Dotmart Logo"
              priority
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Log In
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Enter your email and password to continue.
          </p>

          {/* FORM */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 space-y-4"
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
                          className="h-12 pl-10 rounded-full focus-visible:ring-blue-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-12 pl-10 pr-12 rounded-full focus-visible:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quick Demo Access Options */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Quick Demo Access (Autofill)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDemoLogin("user@gmail.com", "123456")}
                    className="h-10 rounded-full border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <User className="h-3.5 w-3.5" /> User Credentials
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      handleDemoLogin("admin@gmail.com", "123456789")
                    }
                    className="h-10 rounded-full border-dashed border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" /> Admin Credentials
                  </Button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="
                  w-full h-12 rounded-full mt-2
                  bg-gradient-to-r from-blue-600 to-green-600
                  hover:from-blue-700 hover:to-green-700
                "
              >
                {form.formState.isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>

          {/* Sign Up */}
          <p className="text-sm text-gray-600 mt-6 text-center">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
