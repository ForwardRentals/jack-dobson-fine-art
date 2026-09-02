import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Prints } from "./pages/Prints";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "work", Component: Prints },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
      { path: "*", Component: Home },
    ],
  },
]);
