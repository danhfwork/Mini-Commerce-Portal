import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-md space-y-4">
      <div>
        <p className="text-sm font-bold uppercase text-emerald-700">Auth</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-950">
          Login
        </h1>
      </div>
      <Suspense
        fallback={
          <div className="rounded-md border border-emerald-100 bg-white p-6 text-sm font-semibold text-emerald-800">
            Loading login form...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </section>
  );
}
