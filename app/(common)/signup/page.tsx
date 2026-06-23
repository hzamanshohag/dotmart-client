"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { registerUser } from "@/modules/AuthService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const signUpSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email"),
    phoneNumber: z
      .string()
      .regex(
        /^01\d{9}$/,
        "Phone number must start with 01 and be exactly 11 digits",
      ),
    password: z.string().min(6).max(30),
    confirmPassword: z.string().min(6),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      const res = await registerUser(data);

      if (!res?.success) {
        toast.error(res?.message || "Something went wrong");
        return;
      }

      toast.success(res?.message || "Account created successfully");
      router.push("/signin");
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || "Server error");
    }
  };

  return (
    <section className="flex items-center justify-center bg-gray-50 px-4 py-4 md:py-16">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="hidden lg:flex flex-col justify-center rounded-3xl bg-white border shadow-sm p-10">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.svg"
              width={144}
              height={64}
              alt="Smart It Hub BD Logo"
              priority
            />
          </Link>

          <h2 className="text-3xl font-bold text-gray-900 mt-8">
            Create your account 🎉
          </h2>
          <p className="text-gray-600 mt-3 leading-relaxed">
            Become a member of Smart It Hub BD to explore premium products and
            enjoy exclusive benefits.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-blue-50 p-4">
              <p className="text-sm font-semibold text-gray-900">
                Add to Cart 🛒
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Quickly save items you want to buy
              </p>
            </div>

            <div className="rounded-2xl border bg-green-50 p-4">
              <p className="text-sm font-semibold text-gray-900">
                Special Offers 💎
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Get discounts & exclusive deals
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
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
            Sign Up
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Create your account in just a few steps.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 space-y-4"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="Enter your name"
                          className="h-12 pl-10 rounded-full focus-visible:ring-blue-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* Phone */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="01XXXXXXXXX"
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
                          placeholder="Create a password"
                          className="h-12 pl-10 pr-12 rounded-full focus-visible:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="h-12 pl-10 pr-12 rounded-full focus-visible:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Terms */}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <p>
                        I agree to the{" "}
                        <Link
                          href="#"
                          className="text-blue-600 font-medium hover:underline"
                        >
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="#"
                          className="text-blue-600 font-medium hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="
                  w-full h-12 rounded-full
                  bg-gradient-to-r from-blue-600 to-green-600
                  hover:from-blue-700 hover:to-green-700
                "
              >
                {form.formState.isSubmitting
                  ? "Please wait..."
                  : "Create Account"}
              </Button>
            </form>
          </Form>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
