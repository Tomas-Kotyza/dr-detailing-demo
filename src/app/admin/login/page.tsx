import { Suspense } from "react";
import AdminLoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="admin-card admin-login">Načítám…</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
