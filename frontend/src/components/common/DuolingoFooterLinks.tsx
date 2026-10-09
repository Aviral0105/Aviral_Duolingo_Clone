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
      className={`${textClass} text-[10px] sm:text-[10.5px] font-black text-gray-400 uppercase tracking-wider space-y-1 select-none ${className}`}
    >
      {/* Row 1: 5 links, perfectly aligned on 1 line across all viewports */}
      <div className={`flex flex-wrap items-center ${justifyClass} gap-x-2.5 sm:gap-x-3.5 gap-y-1`}>
        <a
          href="https://about.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition whitespace-nowrap"
        >
          ABOUT
        </a>
        <a
          href="https://blog.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition whitespace-nowrap"
        >
          BLOG
        </a>
        <a
          href="https://store-asia.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition whitespace-nowrap"
        >
          STORE
        </a>
        <a
          href="https://www.duolingo.com/efficacy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition whitespace-nowrap"
        >
          EFFICACY
        </a>
        <a
          href="https://careers.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition whitespace-nowrap"
        >
          CAREERS
        </a>
      </div>

      {/* Row 2: 3 links, centered under Row 1 */}
      <div className={`flex flex-wrap items-center ${justifyClass} gap-x-2.5 sm:gap-x-3.5 gap-y-1`}>
        <a
          href="https://investors.duolingo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition whitespace-nowrap"
        >
          INVESTORS
        </a>
        <a
          href="https://www.duolingo.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition whitespace-nowrap"
        >
          TERMS
        </a>
        <a
          href="https://www.duolingo.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline transition whitespace-nowrap"
        >
          PRIVACY
        </a>
      </div>
    </footer>
  );
}
