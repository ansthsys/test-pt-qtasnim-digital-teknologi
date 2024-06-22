import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR, { preload } from "swr";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";

import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";

const baseUrl = import.meta.env.VITE_API_URL;
const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .catch((err) => console.error(err));

preload(`${baseUrl}/transactions/compare`, fetcher);

export default function TransactionComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [itemType, setItemType] = useState(0);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const { data: resCompare, isLoading } = useSWR(
    `${baseUrl}/transactions/compare?${searchParams.toString()}`,
    fetcher
  );
  const { data: resItemTypes, isLoading: loadingItemTypes } = useSWR(
    `${baseUrl}/item-types`,
    fetcher
  );

  async function handleSearch() {
    const startDate = new Date(dateRange[0]).toISOString().split("T")[0];
    const endDate = new Date(dateRange[1]).toISOString().split("T")[0];

    setSearchParams((prev) => {
      prev.set("item_type", itemType);
      prev.set("start_date", startDate);
      prev.set("end_date", endDate);
      return prev;
    });
  }

  useEffect(() => {}, [searchParams, resCompare, isLoading]);

  return (
    <>
      <div className="px-3 py-4">
        <h3>Bandingkan Transaksi</h3>
        <hr />

        <div className="d-flex flex-row align-items-center justify-content-between">
          <div className="d-flex">
            <select
              disabled={loadingItemTypes}
              className="form-select me-3"
              aria-label="Select Item Type"
              name="item_id"
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              aria-describedby="typeMessage"
              required
            >
              <option value={0}>Pilih Tipe Barang</option>
              {resItemTypes?.data?.map((i, idx) => {
                return (
                  <option key={idx} value={i.id}>
                    {i.name}
                  </option>
                );
              })}
            </select>

            <DateRangePicker
              disabled={loadingItemTypes}
              className={"rounded-xl me-4"}
              format="yyyy-MM-dd"
              onChange={setDateRange}
              value={dateRange}
            />

            <button
              disabled={dateRange?.length === 0}
              type="button"
              role="button"
              className="fs-6 btn btn-primary"
              onClick={handleSearch}
            >
              Cari
            </button>
          </div>
        </div>

        <div className="my-4">
          {resCompare?.data ? (
            <div className="row w-100">
              <div className="col-6">
                <div className="card">
                  <div className="card-header">Terbanyak dijual</div>
                  <div className="card-body">
                    <h5 className="card-title">
                      Nama: {resCompare.data.terbanyak.item_name}
                    </h5>
                    <h5 className="card-title">
                      Jenis: {resCompare.data.terbanyak.type_name}
                    </h5>
                    <p className="card-text">
                      Sebanyak: {resCompare.data.terbanyak.total_penjualan}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="card">
                  <div className="card-header">Terendah dijual</div>
                  <div className="card-body">
                    <h5 className="card-title">
                      Nama: {resCompare.data.terendah.item_name}
                    </h5>
                    <h5 className="card-title">
                      Jenis: {resCompare.data.terendah.type_name}
                    </h5>
                    <p className="card-text">
                      Sebanyak: {resCompare.data.terendah.total_penjualan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">Tidak ada data</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
