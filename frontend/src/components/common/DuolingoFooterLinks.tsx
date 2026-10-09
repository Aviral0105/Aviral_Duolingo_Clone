"use client";

import React from "react";

interface DuolingoFooterLinksProps {
  className?: string;
  align?: "center" | "left";
}

export default function DuolingoFooterLinks({
  className = "",
  align = "center",
}: DuolingoFooterLinksProps) {
  const isLeft = align === "left";
  const justifyClass = isLeft ? "justify-start" : "justify-center";
  const textClass = isLeft ? "text-left" : "text-center";

  return (
    <footer
      className={`${textClass} text-[11px] font-black text-gray-400 uppercase tracking-widest space-y-1.5 select-none ${className}`}
    >
      <div className={`flex flex-wrap items-center ${justifyClass} gap-x-4 gap-y-1`}>
        <a
          href="https://about.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition"
        >
          ABOUT
        </a>
        <a
          href="https://blog.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition"
        >
          BLOG
        </a>
        <a
          href="https://store-asia.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition"
        >
          STORE
        </a>
        <a
          href="https://www.duolingo.com/efficacy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition"
        >
          EFFICACY
        </a>
        <a
          href="https://careers.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition"
        >
          CAREERS
        </a>
      </div>
      <div className={`flex flex-wrap items-center ${justifyClass} gap-x-4 gap-y-1`}>
        <a
          href="https://investors.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition"
        >
          INVESTORS
        </a>
        <a
          href="https://www.duolingo.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition"
        >
          TERMS
        </a>
        <a
          href="https://www.duolingo.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition"
        >
          PRIVACY
        </a>
      </div>
    </footer>
  );
}
