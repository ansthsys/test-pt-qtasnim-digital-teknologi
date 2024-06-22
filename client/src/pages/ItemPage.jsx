import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR, { preload } from "swr";

const baseUrl = import.meta.env.VITE_API_URL;
const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .catch((err) => console.error(err));

preload(`${baseUrl}/items`, fetcher);
preload(`${baseUrl}/item-types`, fetcher);

export default function ItemPage() {
  const [errors, setErrors] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalMode, setModalMode] = useState("tambah");
  const [selected, setSelected] = useState(null);
  const closeRef = useRef(null);
  const {
    data: resItems,
    isLoading,
    mutate,
  } = useSWR(`${baseUrl}/items?${searchParams.toString()}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
  });
  const { data: resType } = useSWR(`${baseUrl}/item-types`, fetcher, {
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
    setModalMode("ubah");
  }

  function handleCancel() {
    setSelected(null);
    setErrors(null);
    setModalMode("tambah");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let url = `${baseUrl}/items`;

    const payload = {
      item_type_id: selected?.type_id ?? null,
      name: selected?.item_name ?? "",
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

  async function handleDelete(e) {
    try {
      const url = `${baseUrl}/items/${e.item_id}`;
      const httpConfig = { method: "DELETE" };
      const res = await fetch(url, httpConfig);
      const newData = await res.json();

      mutate({ ...res, newData });
    } catch (err) {
      alert(`Can't delete data`);
    }
  }

  useEffect(() => {}, [searchParams, selected, resItems, isLoading, errors]);

  return (
    <>
      <div className="px-3 py-4">
        <h3>Daftar Barang</h3>
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
                  <th scope="col">Stok Barang</th>
                  <th scope="col">Tipe</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {resItems?.data?.map((i, idx) => {
                  return (
                    <tr key={idx}>
                      <th scope="row">{idx + 1}</th>
                      <td>{i.item_name}</td>
                      <td>{i.item_stock}</td>
                      <td>{i.type_name}</td>
                      <td>
                        <div className="d-flex gap-3">
                          <button
                            data-bs-toggle="modal"
                            data-bs-target="#modal"
                            className="btn btn-outline-primary"
                            onClick={() => handleBtnEdit(i)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(i)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {isLoading && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      Loading...
                    </td>
                  </tr>
                )}

                {resItems?.data?.length < 1 && (
                  <tr>
                    <td colSpan={5} className="text-center">
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
                    ? "Tambah Jenis Barang"
                    : "Ubah Jenis Barang"}
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
                  <label htmlFor="name" className="form-label">
                    Nama barang
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="item_name"
                    value={selected?.item_name ?? ""}
                    onChange={handleChange}
                    placeholder="Nama jenis barang"
                    aria-describedby="nameMessage"
                    required
                  />
                  {errors?.name?.map((i, idx) => {
                    return (
                      <div key={idx} className="form-text text-danger">
                        {i}
                      </div>
                    );
                  })}
                </div>

                <div className="mb-3">
                  <label htmlFor="type_id" className="form-label">
                    Jenis
                  </label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="type_id"
                    value={selected?.type_id ?? ""}
                    onChange={handleChange}
                    aria-describedby="typeMessage"
                    required
                  >
                    <option disabled={modalMode === "ubah"} value={0}>
                      Open this select menu
                    </option>
                    {resType?.data?.map((i, idx) => {
                      return (
                        <option key={idx} value={i.id}>
                          {i.name}
                        </option>
                      );
                    })}
                  </select>
                  {errors?.item_type_id?.map((i, idx) => {
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
