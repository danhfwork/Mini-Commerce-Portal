import { AccountProfile } from "@/components/auth/AccountProfile";

export default function AccountPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase text-emerald-700">Account</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-950">
          Profile
        </h1>
      </div>
      <AccountProfile />
    </section>
  );
}
