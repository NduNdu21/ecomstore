import Link from "next/link";
import { FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";

export default function Navbar() {
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
          <a className="transition-colors hover:text-[#c95d3f]" href="#shop">
            Shop
          </a>
          <a className="transition-colors hover:text-[#c95d3f]" href="#about">
            About us
          </a>
          <a className="transition-colors hover:text-[#c95d3f]" href="#contact">
            Contact
          </a>
        </div>

        <div className="flex items-center gap-1">
          <a
            aria-label="User profile"
            className="flex size-10 items-center justify-center rounded-full text-xl transition-colors hover:bg-[#1f2a24]/10"
            href="#profile"
            title="User profile"
          >
            <FiUser aria-hidden="true" />
          </a>
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
        <a className="transition-colors hover:text-[#c95d3f]" href="#shop">
          Shop
        </a>
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