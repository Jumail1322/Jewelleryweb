import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <section className="page-section account-page">
      <header className="page-hero">
        <h1 className="sma-primary-heading">Account</h1>
      </header>
      <Suspense fallback={null}>
        <AccountView />
      </Suspense>
    </section>
  );
}
