import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
function AddOnPackCreatedList() {
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Add On Pack Name",
    },
    {
      header: "Validity",
      cell: ({ row }) =>
        `${row.original.validityValue} ${row.original.validityUnit}`,
    },
    {
      header: "Created Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <div className="super-admin-toggle-switch">
          <label className="switch">
            <input
              type="checkbox"
              checked={row.original.isActive}
              onChange={() =>
                toggleStatus(row.original._id, row.original.isActive)
              }
            />
            <span className="slider round" />
          </label>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="super-admin-action-icons">
          <Link
            to="/admin/super-admin-add-on-pack-create-form"
            state={{ addOnData: row.original }}
          >
            <i className="fa-solid fa-pen" />
          </Link>

          {/* <Link
            to="/admin/super-admin-add-on-pack-details"
            state={{ addOnData: row.original }}
          >
            <i className="fa-solid fa-eye" />
          </Link> */}

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              deleteAddOn(row.original._id);
            }}
          >
            <i className="fa-solid fa-trash" />
          </a>
        </div>
      ),
    },
  ];

  /* ================= FETCH ADD-ONS ================= */
  const fetchAddOns = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/getAllAddOns?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAddOns(res.data.data || []);
      setTotalPages(res.data.totalPages || 1); // safe fallback
    } catch (error) {
      console.error(error);
      toast.error("Failed to load add-on packs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddOns();
  }, [page, limit]);

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.post(
        `${API_BASE_URL}/toggleAddOnStatus/${id}`,
        {}, // no body required unless backend expects one
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(
        `Add-on pack ${currentStatus ? "deactivated" : "activated"}`
      );
      fetchAddOns();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update add-on status");
    }
  };

  /* ================= DELETE ================= */
  const deleteAddOn = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This add-on pack will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            `${API_BASE_URL}/deleteAddOn/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          toast.success("Add-on pack deleted successfully");
          fetchAddOns();
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete add-on pack");
        }
      }
    });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Add On Pack List </h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/super-admin-pack-creations">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Add On Pack Management
          </h5>
          <Link
            to="/admin/super-admin-add-on-pack-create-form"
            className="super-dashboard-common-add-btn"
          >
            Create Add On Pack
          </Link>
        </div>
        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          <div className="table-responsive">
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" />
              </div>
            ) : (
              <>
                <TableView
                  columns={columns}
                  data={addOns}
                  limit={limit}
                  setLimit={(value) => {
                    setLimit(value);
                    setPage(1);
                  }}
                />

                {/* PAGINATION */}
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-sm btn-primary mx-1"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm mx-1 ${
                        page === index + 1
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    className="btn btn-sm btn-primary mx-1"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default AddOnPackCreatedList;
