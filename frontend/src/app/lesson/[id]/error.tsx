"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";

export default function LessonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lesson error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center select-none">
      <span className="text-7xl animate-bounce mb-4">🦉🤕</span>
      <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
        Oops, something went wrong!
      </h2>
      <p className="text-sm font-bold text-gray-500 max-w-md mb-8">
        We encountered an issue loading this lesson. Let&apos;s try reloading or jump back to your learning path.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={() => reset()}
          className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-wider btn-3d-green flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/learn"
          className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-wider btn-3d-white text-gray-700 flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Back to Path</span>
        </Link>
      </div>
    </div>
  );
}
