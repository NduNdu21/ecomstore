
import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#1f2a24]">
      <Navbar />

      <section className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-start justify-center gap-8 px-6 py-20 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c95d3f]">
          Curated essentials
        </p>
        <h1 className="max-w-3xl font-serif text-6xl leading-[0.95] tracking-tight sm:text-8xl">
          Thoughtful goods for everyday living.
        </h1>
        <p className="max-w-xl text-base leading-7 text-[#1f2a24]/70">
          Discover a calmer way to shop for home, daily rituals, and objects built to last.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center bg-[#1f2a24] px-6 py-3 text-sm font-medium text-[#f4f0e8] transition hover:bg-[#2b3a34]"
        >
          Browse the shop
        </Link>
      </section>

      <Footer />
    </main>
  );
}
