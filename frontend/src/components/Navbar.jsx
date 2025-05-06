"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react"; // You can use any icon library, or SVG

const pages = [
  { href: "/", label: "Home" },
  { href: "/SpamCheck", label: "Spam Check" },
  { href: "/PhishingCheck", label: "Phishing Check" },
  { href: "/Articles", label: "Articles" },
];

const Navbar = () => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-b from-teal-700 to-transparent p-4 text-white">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-start space-x-4">
          <div className="border-l-2 border-white pl-4">
            <h1 className="text-lg font-bold">DeceptiScan</h1>
            <p className="text-sm leading-tight">
              Spam and <br /> Phishing Detector
            </p>
          </div>
        </div>

        {/* Hamburger Button */}
        <button
          className="sm:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex space-x-6 text-base font-semibold">
          {pages.map((page, index) => (
            <Link
              key={index}
              href={page.href}
              className={`hover:underline ${
                pathName === page.href ? "underline" : ""
              }`}
            >
              {page.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="flex flex-col sm:hidden mt-4 space-y-2 text-base font-semibold">
          {pages.map((page, index) => (
            <Link
              key={index}
              href={page.href}
              className={`hover:underline ${
                pathName === page.href ? "underline" : ""
              }`}
              onClick={() => setIsOpen(false)} // Close menu on selection
            >
              {page.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
