"use client";

import React from "react";

export default function DuolingoFooterLinks({ className = "" }: { className?: string }) {
  return (
    <footer className={`text-center text-[11px] font-black text-gray-400 uppercase tracking-widest space-y-2 select-none ${className}`}>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <a
          href="https://about.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 transition"
        >
          ABOUT
        </a>
        <a
          href="https://blog.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 transition"
        >
          BLOG
        </a>
        <a
          href="https://store-asia.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 transition"
        >
          STORE
        </a>
        <a
          href="https://www.duolingo.com/efficacy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 transition"
        >
          EFFICACY
        </a>
        <a
          href="https://careers.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 transition"
        >
          CAREERS
        </a>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <a
          href="https://investors.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 transition"
        >
          INVESTORS
        </a>
        <a
          href="https://www.duolingo.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 transition"
        >
          TERMS
        </a>
        <a
          href="https://www.duolingo.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 transition"
        >
          PRIVACY
        </a>
      </div>
    </footer>
  );
}
