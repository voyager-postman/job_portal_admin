import React, { useState, useEffect } from "react";
import axios from "axios";
import { TableView } from "../components/DataTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { API_BASE_URL } from "../Url/Url";

function SeniorityLevel() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [levelName, setLevelName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all seniority levels
  const fetchSeniorityLevels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/getSeniorityLevelList`);
      if (response.data?.success) {
        setData(response.data.levels || []); // ✅ Updated to match your API
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching seniority levels:", error);
      toast.error("Failed to load seniority levels!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeniorityLevels();
  }, []);

  // ✅ Open Add Modal
  const handleAddClick = () => {
    setEditItem(null);
    setLevelName("");
    setShowModal(true);
  };

  // ✅ Open Edit Modal
  const handleEditClick = (row) => {
    setEditItem(row.original);
    setLevelName(row.original.name);
    setShowModal(true);
  };

  // ✅ Add / Update Seniority Level
  const handleSave = async () => {
    if (!levelName.trim()) {
      toast.warn("Seniority Level name is required!");
      return;
    }

    try {
      if (editItem) {
        await axios.put(`${API_BASE_URL}/seniority-level/${editItem._id}`, {
          name: levelName,
        });
        toast.success("Seniority Level updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/addSeniorityLevel`, {
          name: levelName,
        });
        toast.success("Seniority Level added successfully!");
      }

      setShowModal(false);
      fetchSeniorityLevels();
    } catch (error) {
      console.error("Error saving seniority level:", error);
      toast.error("Failed to save seniority level!");
    }
  };

  // ✅ Delete Seniority Level
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Seniority Level?")) {
      try {
        await axios.delete(`${API_BASE_URL}/seniority-level/${id}`);
        toast.success("Seniority Level deleted successfully!");
        fetchSeniorityLevels();
      } catch (error) {
        console.error("Error deleting seniority level:", error);
        toast.error("Failed to delete seniority level!");
      }
    }
  };

  // ✅ Toggle Active/Inactive
  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axios.put(`${API_BASE_URL}/seniority-level/status/${id}`, {
        is_Active: newStatus,
      });

      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, is_Active: newStatus } : item
        )
      );

      toast.success(
        `Seniority Level marked as ${newStatus ? "Active" : "Inactive"} successfully!`
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status!");
    }
  };

  // ✅ Table Columns
  const columns = [
    {
      accessorKey: "_id",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Seniority Level Name",
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
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <div className="responsive-content">
        <div className="my-profile-area">
          <div className="profile-form-content add-recruiters-btn-postion">
            <h3>Seniority Level List</h3>
            <div className="add-recruiters-btn">
              <button
                onClick={handleAddClick}
                className="default-btn btn btn-primary"
              >
                Add Seniority Level
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
                  {editItem ? "Edit Seniority Level" : "Add Seniority Level"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Seniority Level Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={levelName}
                    onChange={(e) => setLevelName(e.target.value)}
                    placeholder="Enter seniority level name"
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
    </div>
  );
}

export default SeniorityLevel;
