import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url.js";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

function PackCreationList() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const columns = [
    {
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "packName",
      header: "Pack Name",
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
            <span className="slider round"></span>
          </label>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="super-admin-action-icons">
          <Link
            to="/admin/super-admin-pack-creations-form"
            state={{ packData: row.original }}
          >
            <i className="fa-solid fa-pen" />
          </Link>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              deletePack(row.original._id);
            }}
          >
            <i className="fa-solid fa-trash" />
          </a>
        </div>
      ),
    },
  ];
  const fetchPacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/packs?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPacks(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pack list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, [page, limit]);
  // ✅ Dummy Candidates Data
  // 🔁 TOGGLE ACTIVE / INACTIVE
  const toggleStatus = async (packId, currentStatus) => {
    try {
      await axios.post(
        `${API_BASE_URL}/pack/${packId}/status`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Pack status updated");
      fetchPacks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  // 🗑 DELETE PACK WITH SWEET ALERT
  const deletePack = (packId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This pack will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/pack/${packId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          toast.success("Pack deleted successfully");
          fetchPacks();
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete pack");
        }
      }
    });
  };

  return (
    <>
    
    <ToastContainer position="top-right" autoClose={3000} />
    <section className="super-dashboard-content-wrapper">
      <div className="super-dashboard-breadcrumb-info">
        <h4>Pack List </h4>
      </div>
      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin">
            <i className="fa-solid fa-angles-left" />
          </Link>
          Pack Management
        </h5>

        <Link
          to="/admin/super-admin-pack-creations-form"
          className="super-dashboard-common-add-btn"
        >
          Add Pack
        </Link>
      </div>
      <div className="super-admin-manage-candidate-list super-admin-white-bg">
        <div className="common-fillter-select-area">
          <div className="fillter-data-box-info">
            <div className="fillter-data-box">
              <div className="form-group">
                <label>Short By</label>
                <select
                  className="form-select form-control"
                  id="category"
                  name="category"
                  required
                >
                  <option value>Select</option>
                  <option value="general">New</option>
                  <option value="billing">Old</option>
                  <option value="billing">Publish</option>
                  <option value="billing">Draft</option>
                  <option value="billing">Pending</option>
                </select>
              </div>
            </div>
          </div>
          <div className="data-export-btn-info">
            <a href="#" className="data-export-btn">
              Export Data
            </a>
          </div>
        </div>
        <div className="table-responsive">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <>
              <TableView
                columns={columns}
                data={packs}
                limit={limit}
                setLimit={(value) => {
                  setLimit(value);
                  setPage(1);
                }}
              />
              {/* PAGINATION BUTTONS */}
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
                      page === index + 1 ? "btn-primary" : "btn-outline-primary"
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

export default PackCreationList;
