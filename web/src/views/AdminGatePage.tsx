import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { meApi } from "../api/me";
import { getToken } from "../auth/session";
import { ErrorState, Loading } from "../ui/States";

export function AdminGatePage({ children }: { children: React.ReactNode }) {
  const token = getToken();
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    meApi
      .profile()
      .then((r) => {
        if (cancelled) return;
        if (r.error) setError(r.error);
        else if (r.data) setRole(r.data.role);
        else setError("Profile missing");
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token) return <Navigate to="/admin/login" replace />;
  if (error) return <ErrorState message={error} />;
  if (!role) return <Loading />;
  if (role !== "admin") return <ErrorState message="Доступ запрещён: нужна роль admin." />;

  return <>{children}</>;
}

