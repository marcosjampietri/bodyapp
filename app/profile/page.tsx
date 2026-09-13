"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/theme/ThemeToggle";
import { useWorkoutStore } from "../stores/WorkoutStore";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ArrowLeft, LogOut, Mail, Calendar, Shield } from "lucide-react";
import dayjs from "dayjs";

interface UserInfo {
  _id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { resetStore } = useWorkoutStore();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      resetStore();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
      setLoggingOut(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="max-w-md mx-auto w-full px-4 py-6">
        {/* Header */}
        <div
          className={`flex items-center gap-3 mb-8 border-b pb-4 ${
            isDark ? "border-orange-900/20" : "border-orange-200"
          }`}
        >
          <Link
            href="/workout"
            className={`shrink-0 flex items-center gap-2 text-sm font-medium transition ${
              isDark
                ? "text-zinc-400 hover:text-white"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <h1
            className={`flex-1 text-center text-xl font-black tracking-tight ${
              isDark
                ? "bg-linear-to-r from-red-500 to-orange-400 bg-clip-text text-transparent"
                : "text-red-600"
            }`}
          >
            PROFILE
          </h1>

          <ThemeToggle />
        </div>

        {loading ? (
          <div
            className={`text-center py-12 text-sm ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Loading...
          </div>
        ) : user ? (
          <>
            {/* Avatar / identity */}
            <div className="flex flex-col items-center mb-8">
              <div
                className={`w-20 h-20 rounded-sm flex items-center justify-center mb-4 ${
                  isDark
                    ? "bg-linear-to-br from-red-600 to-orange-500 shadow-lg shadow-orange-600/30"
                    : "bg-red-600 shadow-md shadow-red-200"
                }`}
              >
                <Shield className="w-10 h-10 text-white" />
              </div>
              <p
                className={`text-[10px] uppercase tracking-[0.3em] font-black ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Fighter
              </p>
            </div>

            {/* Info card */}
            <Card variant="default" className="mb-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail
                    className={`w-4 h-4 shrink-0 ${
                      isDark ? "text-orange-400" : "text-red-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[10px] font-black uppercase tracking-wider ${
                        isDark ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      Email
                    </p>
                    <p
                      className={`text-sm font-bold truncate ${
                        isDark ? "text-white" : "text-zinc-800"
                      }`}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar
                    className={`w-4 h-4 shrink-0 ${
                      isDark ? "text-orange-400" : "text-red-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-[10px] font-black uppercase tracking-wider ${
                        isDark ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      Member since
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        isDark ? "text-white" : "text-zinc-800"
                      }`}
                    >
                      {dayjs(user.createdAt).format("DD MMM YYYY")}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Logout */}
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {loggingOut ? "Logging out..." : "Log Out"}
            </Button>
          </>
        ) : null}

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
