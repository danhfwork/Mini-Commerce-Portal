import { AccountProfile } from "@/components/auth/AccountProfile";

export default function AccountPage() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-500">Account</p>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
      </div>
      <AccountProfile />
    </section>
  );
}
