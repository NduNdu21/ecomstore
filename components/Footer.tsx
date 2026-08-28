import { FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-[#f4f0e8]/20 bg-[#1f2a24] px-6 py-14 text-[#f4f0e8] sm:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.3fr_0.7fr_0.7fr_1.3fr]">
        <div>
          <p className="font-serif text-3xl tracking-tight">Ecom Store</p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#f4f0e8]/65">
            Thoughtful goods for everyday living, chosen with care.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <a
              aria-label="Ecom Store on Instagram"
              className="flex size-9 items-center justify-center rounded-full border border-[#f4f0e8]/25 transition-colors hover:border-[#f4f0e8]"
              href="#instagram"
              title="Instagram"
            >
              <FiInstagram aria-hidden="true" />
            </a>
            <a
              aria-label="Ecom Store on Twitter"
              className="flex size-9 items-center justify-center rounded-full border border-[#f4f0e8]/25 transition-colors hover:border-[#f4f0e8]"
              href="#twitter"
              title="Twitter"
            >
              <FiTwitter aria-hidden="true" />
            </a>
            <a
              aria-label="Ecom Store on YouTube"
              className="flex size-9 items-center justify-center rounded-full border border-[#f4f0e8]/25 transition-colors hover:border-[#f4f0e8]"
              href="#youtube"
              title="YouTube"
            >
              <FiYoutube aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4f0e8]/55">
            Explore
          </h2>
          <div className="mt-5 flex flex-col items-start gap-3 text-sm">
            <a className="transition-colors hover:text-[#c95d3f]" href="/shop">
              Shop
            </a>
            <a className="transition-colors hover:text-[#c95d3f]" href="#about">
              About us
            </a>
            <a className="transition-colors hover:text-[#c95d3f]" href="#contact">
              Contact
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4f0e8]/55">
            Account
          </h2>
          <div className="mt-5 flex flex-col items-start gap-3 text-sm">
            <a className="transition-colors hover:text-[#c95d3f]" href="#profile">
              Profile
            </a>
            <a className="transition-colors hover:text-[#c95d3f]" href="#cart">
              Cart
            </a>
            <a className="transition-colors hover:text-[#c95d3f]" href="#wishlist">
              Wishlist
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4f0e8]/55">
            Stay in the loop
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#f4f0e8]/65">
            New arrivals and considered edits, sent occasionally.
          </p>
          <form className="mt-5 flex max-w-sm border-b border-[#f4f0e8]/40 pb-2">
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#f4f0e8]/45"
              id="footer-email"
              placeholder="Your email address"
              type="email"
            />
            <button
              className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:text-[#c95d3f]"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-[#f4f0e8]/15 pt-5 text-xs text-[#f4f0e8]/45">
        © 2026 Ecom Store. All rights reserved.
      </div>
    </footer>
  );
}