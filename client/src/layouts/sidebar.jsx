import { Link, NavLink } from "react-router-dom";
import Logo from "@/assets/react.svg";
import Constants from "@/routes/constants";

export default function sidebar() {
  return (
    <div className="d-none d-md-block text-bg-dark vh-100 position-sticky top-0">
      <div
        className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark h-100"
        style={{ width: "280px" }}
      >
        <Link
          className="navbar-brand d-inline-flex justify-content-start align-items-center flex-row gap-2"
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
        <hr />
        <nav className="nav nav-pills flex-column mb-auto gap-2">
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
  );
}
