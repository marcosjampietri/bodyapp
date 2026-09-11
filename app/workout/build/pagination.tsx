"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  preserveParams?: string[];
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  preserveParams = [],
}: PaginationProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const searchParams = useSearchParams();

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    preserveParams.forEach((param) => {
      const value = searchParams.get(param);
      if (value) {
        params.set(param, value);
      }
    });
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Link
        href={buildUrl(Math.max(1, currentPage - 1))}
        className={`px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wider transition ${
          currentPage === 1
            ? "opacity-30 cursor-not-allowed pointer-events-none"
            : isDark
              ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
              : "bg-gray-200 hover:bg-gray-300 text-zinc-600"
        }`}
      >
        Previous
      </Link>

      {getPageNumbers().map((page, index) => (
        <span key={index}>
          {page === "..." ? (
            <span className="px-3 py-2 text-zinc-500">…</span>
          ) : (
            <Link
              href={buildUrl(page as number)}
              className={`px-3 py-2 rounded-sm text-sm font-bold transition ${
                currentPage === page
                  ? isDark
                    ? "bg-orange-600 text-white"
                    : "bg-red-600 text-white"
                  : isDark
                    ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-zinc-600"
              }`}
            >
              {page}
            </Link>
          )}
        </span>
      ))}

      <Link
        href={buildUrl(Math.min(totalPages, currentPage + 1))}
        className={`px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wider transition ${
          currentPage === totalPages
            ? "opacity-30 cursor-not-allowed pointer-events-none"
            : isDark
              ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
              : "bg-gray-200 hover:bg-gray-300 text-zinc-600"
        }`}
      >
        Next
      </Link>
    </div>
  );
}
