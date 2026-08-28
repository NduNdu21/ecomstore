"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { supabase } from "../../utils/supabase";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[A-Za-z0-9_]{3,32}$/.test(normalizedUsername)) {
      setError("Use 3 to 32 letters, numbers, or underscores for your username.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { username: normalizedUsername },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.session) {
      setMessage("Your account is ready. You are now signed in.");
    } else {
      setMessage("Check your email to confirm your account before signing in.");
    }

    setIsSubmitting(false);
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
              A considered collection
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-[0.95] sm:text-7xl">
              Make room for good things.
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-6 text-[#f4f0e8]/65">
              Create an account to save pieces you love and follow every order from checkout to doorstep.
            </p>
          </div>
          <p className="text-xs text-[#f4f0e8]/45">Thoughtful goods for everyday living.</p>
        </section>

        <section className="flex items-center px-6 py-12 sm:px-10 lg:px-20">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c95d3f]">
                Join the store
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-none">Create your account</h2>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium">
                Username
                <input
                  required
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="mt-2 w-full border-b border-[#1f2a24]/25 bg-transparent px-0 py-3 outline-none transition-colors placeholder:text-[#1f2a24]/35 focus:border-[#c95d3f]"
                  placeholder="your_name"
                />
              </label>

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
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full border-b border-[#1f2a24]/25 bg-transparent px-0 py-3 outline-none transition-colors placeholder:text-[#1f2a24]/35 focus:border-[#c95d3f]"
                  placeholder="At least 8 characters"
                />
              </label>

              <label className="block text-sm font-medium">
                Confirm password
                <input
                  required
                  type="password"
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-2 w-full border-b border-[#1f2a24]/25 bg-transparent px-0 py-3 outline-none transition-colors placeholder:text-[#1f2a24]/35 focus:border-[#c95d3f]"
                  placeholder="Repeat your password"
                />
              </label>

              {error ? <p role="alert" className="text-sm text-[#c95d3f]">{error}</p> : null}
              {message ? (
                <p role="status" className="flex items-center gap-2 text-sm text-[#52745b]">
                  <FiCheckCircle aria-hidden="true" /> {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-between bg-[#c95d3f] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#b74f34] disabled:cursor-wait disabled:opacity-60"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
                <FiArrowRight aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}