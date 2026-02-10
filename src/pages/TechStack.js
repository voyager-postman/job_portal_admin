import React, { useState, useEffect } from "react";
import axios from "axios";
import { TableView } from "../components/DataTable";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TechStack() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [techName, setTechName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all Tech Stacks
  const fetchTechStacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/getAllJobCategories`);
      if (response.data?.success) {
        setData(response.data.jobCategories || []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching tech stacks:", error);
      toast.error("Failed to load tech stacks");
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
      toast.warning("Tech Stack name is required!");
      return;
    }

    try {
      if (editItem) {
        await axios.put(`${API_BASE_URL}/job-category/${editItem._id}`, {
          name: techName,
        });
        toast.success("Tech Stack updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/addJobCategory`, {
          name: techName,
        });
        toast.success("Tech Stack added successfully!");
      }

      setShowModal(false);
      fetchTechStacks();
    } catch (error) {
      console.error("Error saving tech stack:", error);
      toast.error("Failed to save tech stack");
    }
  };

  // ✅ Delete Tech Stack
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Tech Stack?")) {
      try {
        await axios.delete(`${API_BASE_URL}/job-category/${id}`);
        toast.success("Tech Stack deleted successfully!");
        fetchTechStacks();
      } catch (error) {
        console.error("Error deleting tech stack:", error);
        toast.error("Failed to delete tech stack");
      }
    }
  };

  // ✅ Toggle Active/Inactive (Dynamic)
  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axios.put(`${API_BASE_URL}/job-category/status/${id}`, {
        is_Active: newStatus,
      });

      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, is_Active: newStatus } : item,
        ),
      );

      toast.info(
        `Tech Stack marked as ${newStatus ? "Active" : "Inactive"} successfully!`,
      );
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
      header: "Tech Stack Name",
    },
    {
      accessorKey: "is_Active",
      header: "Status",
      cell: ({ row }) => (
        <div className="super-admin-toggle-switch">
          <label className="switch">
            <input
              type="checkbox"
              checked={row.original.is_Active}
              onChange={() =>
                handleStatusChange(row.original._id, row.original.is_Active)
              }
            />
            <span className="slider round"></span>
          </label>
        </div>
      ),
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
    <div className="main-dashboard-content d-flex flex-column">
      <div className="responsive-content">
        <div className="my-profile-area">
          <div className="profile-form-content add-recruiters-btn-postion">
            <div className="button-flex">
              <div>
                <h3>Tech Stack List</h3>
              </div>
              <div className="button-flex2">
                <div className="add-recruiters-btn">
                  <button
                    onClick={handleAddClick}
                    className="default-btn btn btn-primary"
                  >
                    + Add Tech Stack
                  </button>
                </div>
              </div>
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
                  {editItem ? "Edit Tech Stack" : "Add Tech Stack"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tech Stack Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={techName}
                    onChange={(e) => setTechName(e.target.value)}
                    placeholder="Enter Tech Stack name"
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
  );
}

export default TechStack;
