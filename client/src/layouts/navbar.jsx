import { useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import Constants from "@/routes/constants";
import { handlerCanvas } from "@/utlis/sidebar";
import Logo from "@/assets/react.svg";

export default function Navbar() {
  const btnCloseRef = useRef(null);
  const navLinkRef = useRef(null);

  const handlerOpen = () => {
    handlerCanvas(navLinkRef, btnCloseRef, "a");
  };

  return (
    <div className="d-md-none position-sticky top-0 z-3">
      <nav className="navbar bg-dark" data-bs-theme="dark">
        <div className="container-fluid">
          <div className="d-inline-flex justify-content-center align-items-center flex-row gap-3">
            <button
              className="btn btn-ghost text-light"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas"
              aria-controls="offcanvas"
              onClick={handlerOpen}
            >
              <i className="bi bi-list fs-4"></i>
            </button>

            <Link
              className="navbar-brand d-inline-flex justify-content-center align-items-center flex-row gap-2"
              to={Constants.INDEX}
            >
              <img
                src={Logo}
                alt="Logo"
                width="30"
                height="24"
                className="d-inline-block align-text-top"
              />
              Technical Test
            </Link>
          </div>
        </div>
      </nav>

      <div
        className="offcanvas offcanvas-start bg-dark text-light"
        tabIndex="-1"
        id="offcanvas"
        aria-labelledby="offcanvasLabel"
        data-bs-backdrop="static"
      >
        <div className="offcanvas-header d-inline-flex justify-content-between align-items-center">
          <h5 className="offcanvas-title" id="offcanvasLabel">
            Technical Test
          </h5>
          <button
            ref={btnCloseRef}
            type="button"
            className="btn btn-ghost text-light"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i className="bi bi-x-lg fs-4"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <nav
            ref={navLinkRef}
            className="nav nav-pills flex-column mb-auto gap-2"
          >
            <NavLink
              to={Constants.ITEM_TYPE}
              className={({ isActive }) => {
                return isActive ? "nav-link active" : "btn btn-dark text-start";
              }}
            >
              Jenis Barang
            </NavLink>

            <NavLink
              to={Constants.ITEM}
              className={({ isActive }) => {
                return isActive ? "nav-link active" : "btn btn-dark text-start";
              }}
            >
              Barang
            </NavLink>

            <NavLink
              to={Constants.TRANSACTION}
              className={({ isActive }) => {
                return isActive ? "nav-link active" : "btn btn-dark text-start";
              }}
            >
              Transaksi
            </NavLink>

            <NavLink
              to={Constants.TRANSACTION_COMPARE}
              className={({ isActive }) => {
                return isActive ? "nav-link active" : "btn btn-dark text-start";
              }}
            >
              Bandingkan Transaksi
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
}
