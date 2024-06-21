import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "@/layouts";
import routes from "@/routes";
import Page404 from "@/pages/Page404";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <Page404 />,
      children: routes,
    },
    {
      path: "*",
      element: <Page404 />,
    },
  ]);

  useEffect(() => {
    const loaderInterval = setInterval(() => {
      const navState = router.state.navigation.state;

      if (navState === "idle") {
        setIsLoading(false);
        clearInterval(loaderInterval);
      }
    }, 1500);

    () => clearInterval(loaderInterval);
  }, [router.state.navigation.state]);

  return isLoading ? (
    <div className="min-vh-100 text-light">Loading Website...</div>
  ) : (
    <RouterProvider router={router} />
  );
}
