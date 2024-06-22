import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR, { preload } from "swr";

const baseUrl = import.meta.env.VITE_API_URL;
const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .catch((err) => console.error(err));

preload(`${baseUrl}/transactions`, fetcher);
preload(`${baseUrl}/items`, fetcher);

export default function TransactionPage() {
  const [errors, setErrors] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalMode, setModalMode] = useState("tambah");
  const [selected, setSelected] = useState(null);
  const closeRef = useRef(null);
  const {
    data: resTransactions,
    isLoading,
    mutate,
  } = useSWR(`${baseUrl}/transactions?${searchParams.toString()}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
  });
  const { data: resItems } = useSWR(`${baseUrl}/items`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
  });

  function handleChange(e) {
    setSelected((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function handleBtnTambah() {
    setSelected(null);
    setModalMode("tambah");
  }

  function handleBtnEdit(data) {
    setSelected(data);
    console.log(data);
    setModalMode("ubah");
  }

  function handleCancel() {
    setSelected(null);
    setErrors(null);
    setModalMode("tambah");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let url = `${baseUrl}/transactions`;

    const payload = {
      item_id: selected?.item_id ?? "",
      quantity: selected?.transaction_quantity ?? "",
      date: selected?.transaction_date ?? "",
    };

    const httpConfig = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    if (modalMode === "ubah") {
      url += `/${selected.item_id}`;
      httpConfig.method = "PATCH";
    }

    const res = await fetch(url, httpConfig);
    const newData = await res.json();

    if (!res.ok) {
      setErrors(newData);
    } else {
      setErrors(null);
      mutate({ ...res, newData });
      closeRef.current.click();
    }
  }

  useEffect(() => {}, [searchParams, selected, resItems, isLoading, errors]);

  return (
    <>
      <div className="px-3 py-4">
        <h3>Daftar Transaksi</h3>
        <hr />

        <div className="d-flex flex-row align-items-center justify-content-between">
          <form
            className="d-flex"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="form-control me-2"
              type="search"
              placeholder="Cari nama barang"
              aria-label="Search"
              value={searchParams.search}
              onChange={(e) => setSearchParams({ search: e.target.value })}
            />
          </form>

          <button
            type="button"
            role="button"
            className="fs-6 btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modal"
            onClick={handleBtnTambah}
          >
            Tambah
          </button>
        </div>

        <div className="my-4">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nama Barang</th>
                  <th scope="col">Sisa Stok</th>
                  <th scope="col">Jumlah Terjual</th>
                  <th scope="col">Tanggal Transaksi</th>
                  <th scope="col">Jenis Barang</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {resTransactions?.data?.map((i, idx) => {
                  return (
                    <tr key={idx}>
                      <th scope="row">{idx + 1}</th>
                      <td scope="col">{i.item_name}</td>
                      <td scope="col">{i.transaction_stock}</td>
                      <td scope="col">{i.transaction_quantity}</td>
                      <td scope="col">
                        {new Date(i.transaction_date).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
                      <td scope="col">{i.type_name}</td>
                      <td>
                        <div className="d-flex gap-3">
                          <button
                            data-bs-toggle="modal"
                            data-bs-target="#modal"
                            className="btn btn-outline-primary"
                            onClick={() => handleBtnEdit(i)}
                          >
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {isLoading && (
                  <tr>
                    <td colSpan={7} className="text-center">
                      Loading...
                    </td>
                  </tr>
                )}

                {resTransactions?.data?.length < 1 && (
                  <tr>
                    <td colSpan={7} className="text-center">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="modal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="modalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalLabel">
                  {modalMode === "tambah"
                    ? "Tambah Transaksi"
                    : "Detail Transaksi"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleCancel}
                  ref={closeRef}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="item_id" className="form-label">
                    Nama Barang
                  </label>
                  <select
                    disabled={modalMode === "ubah"}
                    id="item_id"
                    className="form-select"
                    aria-label="Default select example"
                    name="item_id"
                    value={selected?.item_id ?? ""}
                    onChange={handleChange}
                    aria-describedby="typeMessage"
                    required
                  >
                    <option disabled={modalMode === "ubah"} value={0}>
                      Open this select menu
                    </option>
                    {resItems?.data?.map((i, idx) => {
                      return (
                        <option key={idx} value={i.item_id}>
                          {i.item_name}
                        </option>
                      );
                    })}
                  </select>
                  {errors?.item_id?.map((i, idx) => {
                    return (
                      <div key={idx} className="form-text text-danger">
                        {i}
                      </div>
                    );
                  })}
                </div>

                {modalMode === "ubah" && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="type_name" className="form-label">
                        Jenis Barang
                      </label>
                      <input
                        disabled={modalMode === "ubah"}
                        type="text"
                        className="form-control"
                        id="type_name"
                        name="type_name"
                        value={selected?.type_name ?? ""}
                        onChange={handleChange}
                        placeholder="Jenis Barang"
                        aria-describedby="nameMessage"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="transaction_stock" className="form-label">
                        Sisa Stok
                      </label>
                      <input
                        disabled={modalMode === "ubah"}
                        type="number"
                        min={0}
                        max={50}
                        className="form-control"
                        id="transaction_stock"
                        name="transaction_stock"
                        value={selected?.transaction_stock ?? ""}
                        onChange={handleChange}
                        placeholder="Sisa Stok"
                        aria-describedby="nameMessage"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="mb-3">
                  <label htmlFor="transaction_quantity" className="form-label">
                    Jumlah Terjual
                  </label>
                  <input
                    disabled={modalMode === "ubah"}
                    type="number"
                    min={0}
                    max={50}
                    className="form-control"
                    id="transaction_quantity"
                    name="transaction_quantity"
                    value={selected?.transaction_quantity ?? ""}
                    onChange={handleChange}
                    placeholder="Jumlah Terjual"
                    aria-describedby="nameMessage"
                    required
                  />
                  {errors?.quantity?.map((i, idx) => {
                    return (
                      <div key={idx} className="form-text text-danger">
                        {i}
                      </div>
                    );
                  })}
                </div>

                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Tanggal
                  </label>
                  <input
                    disabled={modalMode === "ubah"}
                    type={modalMode === "ubah" ? "text" : "date"}
                    className="form-control"
                    id="date"
                    name="transaction_date"
                    value={selected?.transaction_date ?? ""}
                    onChange={handleChange}
                    placeholder="Tanggal Transaksi"
                    aria-describedby="nameMessage"
                    required
                  />
                  {errors?.date?.map((i, idx) => {
                    return (
                      <div key={idx} className="form-text text-danger">
                        {i}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  data-bs-dismiss="modal"
                  onClick={handleCancel}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-outline-primary"
                  onClick={handleSubmit}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
