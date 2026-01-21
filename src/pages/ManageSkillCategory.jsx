import React, { useState, useEffect } from "react";
import axios from "axios";
import { TableView } from "../components/DataTable";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
const ManageSkillCategory = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [techName, setTechName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all Tech Stacks
  const fetchTechStacks = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}/skill-categories`);

      if (response.data?.success) {
        setData(response.data.data || []); // ✅ FIXED
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching Categories Name:", error);
      // toast.error("Failed to load Skills Name");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechStacks();
  }, []);

  // ✅ Open Add Modal
  const handleAddClick = () => {
    setEditItem(null);
    setTechName("");
    setShowModal(true);
  };

  // ✅ Open Edit Modal
  const handleEditClick = (row) => {
    setEditItem(row.original);
    setTechName(row.original.name);
    setShowModal(true);
  };

  // ✅ Add or Update Tech Stack
  const handleSave = async () => {
    if (!techName.trim()) {
      toast.warning("Categories name is required!");
      return;
    }

    try {
      if (editItem) {
        // UPDATE
        await axios.post(`${API_BASE_URL}/skill-category/${editItem._id}`, {
          name: techName,
        });
        toast.success("Categories updated successfully!");
      } else {
        // ADD
        await axios.post(`${API_BASE_URL}/skill-category`, { name: techName });
        toast.success("Categories added successfully!");
      }

      setShowModal(false);
      fetchTechStacks();
    } catch (error) {
      console.error("Error saving Categories Name:", error);

      // ✅ Show backend message if exists
      const message =
        error.response?.data?.message || "Failed to save Categories Name";

      toast.error(message);
    }
  };

  // ✅ Delete Tech Stack
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/skill-category/${id}`);
      Swal.fire("Deleted!", "Category deleted successfully.", "success");
      fetchTechStacks();
    } catch (error) {
      console.error("Error deleting category:", error);
      Swal.fire("Error!", "Failed to delete category.", "error");
    }
  };

  // ✅ Toggle Active/Inactive (Dynamic)
  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      await axios.post(`${API_BASE_URL}/skill-category/${id}/status`, {
        isActive: newStatus,
      });

      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isActive: newStatus } : item,
        ),
      );

      toast.info(`Category marked as ${newStatus ? "Active" : "Inactive"}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const columns = [
    {
      accessorKey: "_id",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Categories",
    },
    {
      accessorKey: "isActive", // ✅ fixed
      header: "Status",
      cell: ({ row }) => (
        <div className="super-admin-toggle-switch">
          <label className="switch">
            <input
              type="checkbox"
              checked={row.original.isActive} // ✅ fixed
              onChange={() =>
                handleStatusChange(
                  row.original._id,
                  row.original.isActive, // ✅ fixed
                )
              }
            />
            <span className="slider round"></span>
          </label>
        </div>
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <div className="super-admin-action-icons">
          <i
            className="fa-solid fa-pencil"
            title="Edit"
            onClick={() => handleEditClick(row)}
          />
          <i
            className="fa-solid fa-trash"
            title="Delete"
            onClick={() => handleDelete(row.original._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      {" "}
      <div className="main-dashboard-content d-flex flex-column">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Categories List </h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Categories Management
          </h5>
        </div>
        <div className="responsive-content">
          <div className="my-profile-area">
            <div className="profile-form-content add-recruiters-btn-postion">
              <h3>Categories List</h3>
              <div className="add-recruiters-btn">
                <button
                  onClick={handleAddClick}
                  className="default-btn btn btn-primary"
                >
                  Add Categories
                </button>
              </div>

              <div className="profile-form mt-3">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <TableView columns={columns} data={data} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Modal for Add/Edit */}
        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editItem ? "Edit Categories Name" : "Add Categories Name"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Categories Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={techName}
                      onChange={(e) => setTechName(e.target.value)}
                      placeholder="Enter Categories name"
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

        {/* ✅ Toast Container */}
        <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      </div>
    </div>
  );
};

export default ManageSkillCategory;
