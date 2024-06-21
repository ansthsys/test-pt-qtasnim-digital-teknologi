import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function Layout() {
  return (
    <div className="container-xxl p-0">
      <Navbar />
      <div className="d-flex flex-row flex-md-row position-relative">
        <Sidebar />
        <main className="bg-white w-100">
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
