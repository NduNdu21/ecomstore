"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FiHeart,
  FiLogIn,
  FiLogOut,
  FiSettings,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import { supabase } from "../utils/supabase";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setIsLoggedIn(Boolean(data.session));
        setIsAdmin(data.session?.user.app_metadata?.role === "admin");
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(Boolean(session));
        setIsAdmin(session?.user.app_metadata?.role === "admin");
      },
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    function closeMenuOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeMenuOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeMenuOnEscape);
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
  }

  return (
    <nav
      aria-label="Main navigation"
      className="border-b border-[#1f2a24]/15 bg-[#f4f0e8]/95 px-6 py-5 backdrop-blur sm:px-10"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
        <Link
          href="/"
          className="shrink-0 font-serif text-2xl font-semibold tracking-tight transition-opacity hover:opacity-70"
        >
          Ecom Store
        </Link>

        <div className="hidden items-center gap-9 text-sm font-medium md:flex">
          <Link className="transition-colors hover:text-[#c95d3f]" href="/shop">
            Shop
          </Link>
          <a className="transition-colors hover:text-[#c95d3f]" href="#about">
            About us
          </a>
          <a className="transition-colors hover:text-[#c95d3f]" href="#contact">
            Contact
          </a>
        </div>

        <div className="flex items-center gap-1">
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              aria-label="Open profile menu"
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
              className="flex size-10 items-center justify-center rounded-full text-xl transition-colors hover:bg-[#1f2a24]/10"
              onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
              title="Profile menu"
            >
              <FiUser aria-hidden="true" />
            </button>

            {isProfileOpen ? (
              <div
                className="absolute right-0 top-12 z-20 w-52 border border-[#1f2a24]/15 bg-[#f4f0e8] p-2 shadow-[0_12px_30px_rgba(31,42,36,0.12)]"
                role="menu"
              >
                <Link
                  href="#profile"
                  role="menuitem"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-[#1f2a24]/10 hover:text-[#c95d3f]"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <FiUser aria-hidden="true" /> Profile
                </Link>
                <Link
                  href="#settings"
                  role="menuitem"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-[#1f2a24]/10 hover:text-[#c95d3f]"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <FiSettings aria-hidden="true" /> Settings
                </Link>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    role="menuitem"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-[#1f2a24]/10 hover:text-[#c95d3f]"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FiSettings aria-hidden="true" /> Admin dashboard
                  </Link>
                ) : null}
                {isLoggedIn ? (
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-[#1f2a24]/10 hover:text-[#c95d3f]"
                    onClick={handleLogout}
                  >
                    <FiLogOut aria-hidden="true" /> Log out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    role="menuitem"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-[#1f2a24]/10 hover:text-[#c95d3f]"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FiLogIn aria-hidden="true" /> Login / Sign up
                  </Link>
                )}
              </div>
            ) : null}
          </div>
          <a
            aria-label="Shopping cart"
            className="flex size-10 items-center justify-center rounded-full text-xl transition-colors hover:bg-[#1f2a24]/10"
            href="#cart"
            title="Shopping cart"
          >
            <FiShoppingBag aria-hidden="true" />
          </a>
          <a
            aria-label="Wishlist"
            className="flex size-10 items-center justify-center rounded-full text-2xl transition-colors hover:bg-[#1f2a24]/10"
            href="#wishlist"
            title="Wishlist"
          >
            <FiHeart aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-7xl items-center justify-center gap-6 text-sm font-medium md:hidden">
        <Link className="transition-colors hover:text-[#c95d3f]" href="/shop">
          Shop
        </Link>
        <a className="transition-colors hover:text-[#c95d3f]" href="#about">
          About us
        </a>
        <a className="transition-colors hover:text-[#c95d3f]" href="#contact">
          Contact
        </a>
      </div>
    </nav>
  );
}