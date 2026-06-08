import { useNavigate } from "react-router-dom";
import { PageShell } from "../ui/PageShell";
import { AdminLoginCard } from "./AdminLoginCard";

export function AdminLoginPage() {
  const navigate = useNavigate();

  return (
    <PageShell title="Админ → Вход" subtitle="После входа откроется админ панель. Нужен пользователь с ролью admin.">
      <AdminLoginCard
        onSuccess={() => {
          navigate("/admin");
        }}
      />
    </PageShell>
  );
}

