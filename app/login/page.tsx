"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError) {
      setError("That email and password combination could not be verified.");
      setIsSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#1f2a24]">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.85fr_1.15fr]">
        <section className="flex flex-col justify-between bg-[#1f2a24] px-6 py-8 text-[#f4f0e8] sm:px-10 lg:px-14 lg:py-12">
          <Link href="/" className="font-serif text-2xl tracking-tight hover:text-[#e89572]">
            Ecom Store
          </Link>
          <div className="max-w-md py-16 lg:py-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e89572]">
              Welcome back
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-[0.95] sm:text-7xl">
              Good things await.
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-6 text-[#f4f0e8]/65">
              Sign in to revisit your saved pieces and keep an eye on every order.
            </p>
          </div>
          <p className="text-xs text-[#f4f0e8]/45">Thoughtful goods for everyday living.</p>
        </section>

        <section className="flex items-center px-6 py-12 sm:px-10 lg:px-20">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c95d3f]">
                Your account
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-none">Sign in</h2>
              <p className="mt-4 text-sm text-[#1f2a24]/60">
                New here? <Link href="/register" className="font-medium text-[#c95d3f] hover:underline">Create an account</Link>
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium">
                Email address
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full border-b border-[#1f2a24]/25 bg-transparent px-0 py-3 outline-none transition-colors placeholder:text-[#1f2a24]/35 focus:border-[#c95d3f]"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block text-sm font-medium">
                Password
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full border-b border-[#1f2a24]/25 bg-transparent px-0 py-3 outline-none transition-colors placeholder:text-[#1f2a24]/35 focus:border-[#c95d3f]"
                  placeholder="Your password"
                />
              </label>

              {error ? <p role="alert" className="text-sm text-[#c95d3f]">{error}</p> : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-between bg-[#c95d3f] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#b74f34] disabled:cursor-wait disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
                {isSubmitting ? <FiCheckCircle aria-hidden="true" /> : <FiArrowRight aria-hidden="true" />}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}