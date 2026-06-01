"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getCurrentUser } from "@/lib/api/auth.api";
import { useAuth } from "@/lib/auth/auth-store";
import type { AuthUser } from "@/lib/types/auth";

export function AccountProfile() {
  const router = useRouter();
  const { session, isHydrated, logout, setUser } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(session?.user ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!session) {
      router.replace("/login?next=/account");
      return;
    }

    let isActive = true;
    const accessToken = session.accessToken;

    async function loadProfile() {
      setIsLoading(true);
      setError(null);

      try {
        const user = await getCurrentUser(accessToken);

        if (!isActive) {
          return;
        }

        setProfile(user);
        setUser(user);
      } catch (caughtError) {
        if (!isActive) {
          return;
        }

        if (caughtError instanceof ApiError && caughtError.status === 401) {
          logout();
          router.replace("/login?next=/account");
          return;
        }

        setError("Could not load your account profile. Please try again.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, [isHydrated, logout, router, session, setUser]);

  if (!isHydrated || (!session && !error)) {
    return (
      <div className="rounded-md border border-emerald-100 bg-white p-6 text-sm font-semibold text-emerald-800">
        Checking session...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 h-10 cursor-pointer rounded-md bg-red-700 px-4 text-sm font-medium text-white transition hover:bg-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-md border border-emerald-100 bg-white p-6 text-sm font-semibold text-emerald-800">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="grid gap-4 rounded-md border border-emerald-100 bg-white p-6 sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="relative h-24 w-24 overflow-hidden rounded-md bg-emerald-50">
        {profile.image ? (
          <Image
            src={profile.image}
            alt={`${profile.firstName} ${profile.lastName}`}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-emerald-700">
            No avatar
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-emerald-950">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-sm text-emerald-800/80">{profile.email}</p>
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <ProfileField label="Username" value={profile.username} />
          <ProfileField label="Gender" value={profile.gender} />
          <ProfileField label="User ID" value={String(profile.id)} />
        </dl>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="h-10 cursor-pointer rounded-md border border-emerald-200 px-4 text-sm font-semibold text-emerald-800 transition duration-200 hover:bg-emerald-50"
          >
            Logout
          </button>
          {isLoading ? (
            <p className="text-sm text-emerald-700">Refreshing profile...</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-emerald-700">{label}</dt>
      <dd className="mt-1 text-emerald-950">{value}</dd>
    </div>
  );
}
