import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";
import "./i18n";

// Apply theme before first render
try {
  const t = localStorage.getItem("mog:theme");
  if (t !== "dark") document.documentElement.classList.add("light");
} catch {
  document.documentElement.classList.add("light");
}

const router = getRouter();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
