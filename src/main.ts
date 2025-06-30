// router.ts
import { Router } from "@vaadin/router";
import "./index.css";
import "./config/env-ui";
import "./pages/insert-stuff-search-page";
import "./pages/insert-stuff-details-page";
import "./pages/insert-stuff-insert-page";

// Define the outlet with proper typing
const outlet: HTMLElement | null = document.getElementById("outlet");

if (outlet) {
  const router = new Router(outlet);

  router.setRoutes([
    { path: "/", component: "env-ui" },
    { path: "/page-1", component: "insert-stuff-search-page" },
    { path: "/page-2", component: "insert-stuff-details-page" },
    { path: "/page-3", component: "insert-stuff-insert-page" },

    { path: "/layout", component: "page-layout" },
    { path: "/mam-dialog", component: "mam-insert-dialog2" },
  ]);
} else {
  console.error("Router outlet not found");
}
