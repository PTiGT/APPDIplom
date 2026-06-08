import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./ui/AppLayout";
import { HomePage } from "./views/HomePage";
import { LanguagesPage } from "./views/LanguagesPage";
import { LanguageDetailPage } from "./views/LanguageDetailPage";
import { GuidesPage } from "./views/GuidesPage";
import { ArticlesPage } from "./views/ArticlesPage";
import { ArticleDetailPage } from "./views/ArticleDetailPage";
import { DocumentationPage } from "./views/DocumentationPage";
import { AdminLoginPage } from "./views/AdminLoginPage";
import { AdminPanelPage } from "./views/AdminPanelPage";
import { AdminGatePage } from "./views/AdminGatePage";
import { DashboardPage } from "./views/DashboardPage";
import { ChallengesPage } from "./views/ChallengesPage";
import { ProfilePage } from "./views/ProfilePage";
import { LoginPage } from "./views/LoginPage";
import { RegisterPage } from "./views/RegisterPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/languages", element: <LanguagesPage /> },
      { path: "/languages/:id", element: <LanguageDetailPage /> },
      { path: "/guides", element: <GuidesPage /> },
      { path: "/challenges", element: <ChallengesPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/articles", element: <ArticlesPage /> },
      { path: "/articles/:id", element: <ArticleDetailPage /> },
      { path: "/documentation", element: <DocumentationPage /> },
      { path: "/admin/login", element: <AdminLoginPage /> },
      { path: "/admin", element: <AdminGatePage children={<AdminPanelPage />} /> },
    ],
  },
]);

