import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-md space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-500">Auth</p>
        <h1 className="text-3xl font-semibold tracking-tight">Login</h1>
      </div>
      <Suspense
        fallback={
          <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Loading login form...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </section>
  );
}
