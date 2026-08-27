
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#1f2a24]">
      <Navbar />

      <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 py-20 sm:px-10">
        <h1 className="max-w-3xl font-serif text-6xl leading-[0.95] tracking-tight sm:text-8xl">
          Thoughtful goods for everyday living.
        </h1>
      </section>

      <Footer />
    </main>
  );
}
