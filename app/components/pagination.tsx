"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();

    // Preserve existing filter params
    preserveParams.forEach((param) => {
      const value = searchParams.get(param);
      if (value) {
        params.set(param, value);
      }
    });

    // Set the new page
    params.set("page", page.toString());

    return `${baseUrl}?${params.toString()}`;
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);

      if (start > 2) pages.push("...");

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

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
        className={`px-4 py-2 border rounded ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed pointer-events-none"
            : "hover:bg-gray-100"
        }`}
        aria-disabled={currentPage === 1}
      >
        Previous
      </Link>

      {getPageNumbers().map((page, index) => (
        <span key={index}>
          {page === "..." ? (
            <span className="px-3 py-2">…</span>
          ) : (
            <Link
              href={buildUrl(page as number)}
              className={`px-3 py-2 border rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </Link>
          )}
        </span>
      ))}

      <Link
        href={buildUrl(Math.min(totalPages, currentPage + 1))}
        className={`px-4 py-2 border rounded ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed pointer-events-none"
            : "hover:bg-gray-100"
        }`}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </Link>
    </div>
  );
}
