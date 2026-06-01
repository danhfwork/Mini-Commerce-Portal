"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/api/auth.api";
import { useAuth } from "@/lib/auth/auth-store";
import type { AuthSession } from "@/lib/types/auth";

const TEST_USERNAME = "emilys";
const TEST_PASSWORD = "emilyspass";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, setSession } = useAuth();
  const [username, setUsername] = useState(TEST_USERNAME);
  const [password, setPassword] = useState(TEST_PASSWORD);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = searchParams.get("next") || "/products";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login({
        username: username.trim(),
        password,
        expiresInMins: 30,
      });
      const nextSession: AuthSession = {
        user: {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          gender: response.gender,
          image: response.image,
        },
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };

      setSession(nextSession);
      router.push(redirectTo);
    } catch {
      setError("Login failed. Check the DummyJSON test credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function fillTestCredentials() {
    setUsername(TEST_USERNAME);
    setPassword(TEST_PASSWORD);
    setError(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-md border border-emerald-100 bg-white p-6"
    >
      {session ? (
        <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
          You are logged in as {session.user.username}.
        </div>
      ) : null}

      <div>
        <label htmlFor="username" className="text-sm font-semibold text-emerald-900">
          Username
        </label>
        <input
          id="username"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          className="mt-2 h-10 w-full rounded-md border border-emerald-200 px-3 text-sm text-emerald-950 outline-none transition duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-semibold text-emerald-900">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          className="mt-2 h-10 w-full rounded-md border border-emerald-200 px-3 text-sm text-emerald-950 outline-none transition duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 cursor-pointer rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition duration-200 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-200"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          onClick={fillTestCredentials}
          disabled={isSubmitting}
          className="h-10 cursor-pointer rounded-md border border-emerald-200 px-4 text-sm font-semibold text-emerald-800 transition duration-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-emerald-700/40"
        >
          Fill test credentials
        </button>
      </div>
    </form>
  );
}
