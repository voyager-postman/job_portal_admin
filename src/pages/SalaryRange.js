import React, { useState, useEffect } from "react";
import axios from "axios";
import { TableView } from "../components/DataTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../Url/Url";

function SalaryRange() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [salaryRange, setSalaryRange] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all salary ranges
  const fetchSalaryRanges = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/getSalaryRangeList`);
      if (response.data?.data) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching salary ranges:", error);
      toast.error("Failed to load salary ranges!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaryRanges();
  }, []);

  // ✅ Open Add Modal
  const handleAddClick = () => {
    setEditItem(null);
    setSalaryRange("");
    setShowModal(true);
  };

  // ✅ Open Edit Modal
  const handleEditClick = (row) => {
    setEditItem(row.original);
    setSalaryRange(row.original.range);
    setShowModal(true);
  };

  // ✅ Add / Update Salary Range
  const handleSave = async () => {
    if (!salaryRange.trim()) {
      toast.warn("Salary range is required!");
      return;
    }

    try {
      if (editItem) {
        // Update existing
        await axios.put(`${API_BASE_URL}/salaryRange/${editItem._id}`, {
          range: salaryRange,
        });
        toast.success("Salary Range updated successfully!");
      } else {
        // Add new
        await axios.post(`${API_BASE_URL}/addSalaryRange`, {
          range: salaryRange,
        });
        toast.success("Salary Range added successfully!");
      }

      setShowModal(false);
      fetchSalaryRanges();
    } catch (error) {
      console.error("Error saving salary range:", error);
      toast.error("Failed to save salary range!");
    }
  };

  // ✅ Delete Salary Range
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Salary Range?")) {
      try {
        await axios.delete(`${API_BASE_URL}/salaryRange/${id}`);
        toast.success("Salary Range deleted successfully!");
        fetchSalaryRanges();
      } catch (error) {
        console.error("Error deleting salary range:", error);
        toast.error("Failed to delete salary range!");
      }
    }
  };

  // ✅ Toggle Active/Inactive
  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axios.put(`${API_BASE_URL}/SalaryRange/status/${id}`, {
        is_Active: newStatus,
      });

      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, is_Active: newStatus } : item,
        ),
      );

      toast.success(
        `Salary Range marked as ${newStatus ? "Active" : "Inactive"} successfully!`,
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
      accessorKey: "range",
      header: "Salary Range",
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
            <div className="button-flex">
              <div>
                <h3>Salary Range List</h3>
              </div>
              <div className="button-flex2">
                <div className="add-recruiters-btn">
                  <button
                    onClick={handleAddClick}
                    className="default-btn btn btn-primary"
                  >
                    + Add Salary Range
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
                  {editItem ? "Edit Salary Range" : "Add Salary Range"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Salary Range</label>
                  <input
                    type="text"
                    className="form-control"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    placeholder="Enter salary range (e.g. $0 - $100)"
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

export default SalaryRange;
