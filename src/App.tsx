import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { techcupFaviconSvg } from "./components/TechCupLogo";

function FaviconAndTitle() {
  useEffect(() => {
    document
      .querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon'], link[rel='shortcut icon']")
      .forEach((el) => el.remove());

    [
      { rel: "icon", type: "image/png" },
      { rel: "shortcut icon", type: "image/png" },
      { rel: "apple-touch-icon", sizes: "180x180", type: "image/png" },
    ].forEach(({ rel, type, sizes }: any) => {
      const link = document.createElement("link");
      link.rel = rel;
      if (type) link.type = type;
      if (sizes) link.setAttribute("sizes", sizes);
      link.href = techcupFaviconSvg;
      document.head.appendChild(link);
    });

    document.title = "TechCup Fútbol — Torneos de Fútbol 7";
  }, []);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <FaviconAndTitle />
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}