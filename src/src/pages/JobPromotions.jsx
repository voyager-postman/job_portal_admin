import React from "react";
import { TableView } from "../components/DataTable";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url.js";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const JobPromotions = () => {
  const [loading, setLoading] = useState(true);
  const [promotion, setPromotion] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [promotionType, setPromotionType] = useState("");
  const [credits, setCredits] = useState("");

  const fetchPromotion = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}getPromotions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("API Response:", response.data.data);
      setPromotion(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotion();
  }, [page, limit]);

  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      accessorKey: "promotionType",
      header: "Promotion Type",
      accessorFn: (row) => row.promotionType,
      cell: ({ row }) => row.original.promotionType || "Not Provided",
    },
    {
      accessorKey: "credits",
      header: "Credits",
      accessorFn: (row) => row.credits,
      cell: ({ row }) => row.original.credits || "Not Provided",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const promotionId = row.original?._id;

        const isActive =
          row.original?.status === true || row.original?.status === "true";

        const handleStatusChange = async () => {
          try {
            const response = await axios.post(
              `${API_BASE_URL}promotionStatus/${promotionId}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );

            if (response.data?.success) {
              toast.success(response.data.message);
              fetchPromotion();
            } else {
              toast.error(response.data?.message || "Update failed");
            }
          } catch (error) {
            toast.error("Something went wrong!");
          }
        };

        return (
          <div className="super-admin-toggle-switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={isActive}
                onChange={handleStatusChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="super-admin-action-icons">
          <i
            className="fa-solid fa-pencil"
            title="Edit"
            onClick={() => handleEditClick(row)}
          />
        </div>
      ),
    },
  ];

  // ✅ Open Edit Modal
  const handleEditClick = (row) => {
    setEditItem(row.original);
    setPromotionType(row.original.promotionType);
    setCredits(row.original.credits);
    setShowModal(true);
  };

  // ✅  Update Promotion Data

  const handleSave = async () => {
    if (!promotionType.trim()) {
      toast.warning("Promotion Type name is required!");
      return;
    }
    if (!credits.trim()) {
      toast.warning("Credits is required!");
      return;
    }

    try {
      if (editItem) {
        await axios.post(
          `${API_BASE_URL}savePromotion?id=${editItem._id}`,
          {
            promotionType: promotionType,
            credits: credits,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        toast.success("Promotion data edit Successfully!");
      }
      setShowModal(false);
      fetchPromotion();
    } catch (error) {
      console.error("Error Saving promotion data", error);
      toast.error("Failed to save tech stack");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Manage Job Promotions</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Job Promotions
          </h5>
        </div>

        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          <div className="table-responsive">
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : (
              <>
                <TableView
                  columns={columns}
                  data={promotion}
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
        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editItem
                      ? "Edit Promotion Details"
                      : "Edit Promotion Details"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      Enter Promotion Type Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={promotionType}
                      onChange={(e) => setPromotionType(e.target.value)}
                      placeholder="Enter Promotion type"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Enter Credits Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      value={credits}
                      onChange={(e) => setCredits(e.target.value)}
                      placeholder="Enter Credits"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    {editItem ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default JobPromotions;
