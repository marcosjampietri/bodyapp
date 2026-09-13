"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/theme/ThemeToggle";
import { Button } from "../components/ui/Button";
import { Shield, Mail, Lock, AlertCircle } from "lucide-react";
import { useWorkoutStore } from "../stores/WorkoutStore";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginForm, string>>
  >({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (serverError) setServerError("");
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    // Validate with zod
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof LoginForm, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Failed to log in");
        return;
      }

      // Success — redirect to workout
      // Before redirecting, reset any previous user's local data
      useWorkoutStore.getState().resetStore();
      router.push("/workout");
      router.refresh();
    } catch (err) {
      console.error(err);
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full pl-10 pr-3 py-3 text-sm rounded-sm border focus:outline-none focus:ring-2 transition ${
    isDark
      ? "bg-zinc-900 text-white border-zinc-700 focus:border-orange-500 focus:ring-orange-500/20"
      : "bg-white text-zinc-800 border-gray-200 focus:border-red-400 focus:ring-red-200"
  }`;

  const labelClass = `block text-xs font-black uppercase tracking-wider mb-1.5 ${
    isDark ? "text-zinc-400" : "text-zinc-500"
  }`;

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="max-w-md mx-auto w-full px-4 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className={`w-14 h-14 rounded-sm flex items-center justify-center mb-3 ${
              isDark
                ? "bg-linear-to-br from-red-600 to-orange-500 shadow-lg shadow-orange-600/30"
                : "bg-red-600 shadow-md shadow-red-200"
            }`}
          >
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1
            className={`text-2xl font-black tracking-tight ${
              isDark
                ? "bg-linear-to-r from-red-500 to-orange-400 bg-clip-text text-transparent"
                : "text-red-600"
            }`}
          >
            IRON
          </h1>
          <p
            className={`text-[10px] uppercase tracking-[0.3em] font-black mt-1 ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Pain is progress
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <div className="relative">
              <Mail
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              />
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className={inputClass}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <AlertCircle
                  className={`w-3 h-3 ${isDark ? "text-red-400" : "text-red-500"}`}
                />
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isDark ? "text-red-400" : "text-red-500"
                  }`}
                >
                  {errors.email}
                </span>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <div className="relative">
              <Lock
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              />
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                className={inputClass}
              />
            </div>
            {errors.password && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <AlertCircle
                  className={`w-3 h-3 ${isDark ? "text-red-400" : "text-red-500"}`}
                />
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isDark ? "text-red-400" : "text-red-500"
                  }`}
                >
                  {errors.password}
                </span>
              </div>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <div
              className={`flex items-center gap-2 p-3 rounded-sm border ${
                isDark
                  ? "bg-red-950/30 border-red-800/40"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <AlertCircle
                className={`w-4 h-4 shrink-0 ${
                  isDark ? "text-red-400" : "text-red-500"
                }`}
              />
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? "text-red-400" : "text-red-500"
                }`}
              >
                {serverError}
              </span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <span
            className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
          >
            Don't have an account?{" "}
          </span>
          <Link
            href="/register"
            className={`text-xs font-black uppercase tracking-wider ${
              isDark
                ? "text-orange-400 hover:text-orange-300"
                : "text-red-600 hover:text-red-700"
            }`}
          >
            Register
          </Link>
        </div>

        {/* Bottom accent */}
        <div className="mt-8 text-center">
          <p
            className={`text-[8px] uppercase tracking-[0.3em] font-black ${
              isDark ? "text-orange-900/30" : "text-red-200"
            }`}
          >
            Steel forged in blood
          </p>
        </div>
      </div>
    </div>
  );
}
