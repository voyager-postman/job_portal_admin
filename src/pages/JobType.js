import React, { useState, useEffect } from "react";
import axios from "axios";
import { TableView } from "../components/DataTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { API_BASE_URL } from "../Url/Url";
import { Link } from "react-router-dom";

function JobType() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [jobTypeName, setJobTypeName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all Job Types
  const fetchJobTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/getJobTypeList`);
      if (response.data?.success) {
        setData(response.data.jobTypes || []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
      toast.error("Failed to load job types!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobTypes();
  }, []);

  // ✅ Open Add Modal
  const handleAddClick = () => {
    setEditItem(null);
    setJobTypeName("");
    setShowModal(true);
  };

  // ✅ Open Edit Modal
  const handleEditClick = (row) => {
    setEditItem(row.original);
    setJobTypeName(row.original.name);
    setShowModal(true);
  };

  // ✅ Add / Update Job Type
  const handleSave = async () => {
    if (!jobTypeName.trim()) {
      toast.warn("Job Type name is required!");
      return;
    }

    try {
      if (editItem) {
        await axios.put(`${API_BASE_URL}/job-type/${editItem._id}`, {
          name: jobTypeName,
        });
        toast.success("Job Type updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/addJobType`, {
          name: jobTypeName,
        });
        toast.success("Job Type added successfully!");
      }

      setShowModal(false);
      fetchJobTypes();
    } catch (error) {
      console.error("Error saving job type:", error);
      toast.error("Failed to save job type!");
    }
  };

  // ✅ Delete Job Type
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Job Type?")) {
      try {
        await axios.delete(`${API_BASE_URL}/job-type/${id}`);
        toast.success("Job Type deleted successfully!");
        fetchJobTypes();
      } catch (error) {
        console.error("Error deleting job type:", error);
        toast.error("Failed to delete job type!");
      }
    }
  };

  // ✅ Toggle Active/Inactive
  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axios.put(`${API_BASE_URL}/job-type/status/${id}`, {
        is_Active: newStatus,
      });

      // update UI instantly
      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, is_Active: newStatus } : item,
        ),
      );

      toast.success(
        `Job Type marked as ${newStatus ? "Active" : "Inactive"} successfully!`,
      );
    } catch (error) {
      console.error("Error updating job type status:", error);
      toast.error("Failed to update job type status!");
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
      header: "Job Type",
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
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Manage Job Type</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Job Type List
          </h5>
        </div>
      </section>
      <div className="main-dashboard-content d-flex flex-column">
        <ToastContainer position="top-right" autoClose={2000} theme="colored" />
        <div className="responsive-content">
          <div className="my-profile-area">
            <div className="profile-form-content add-recruiters-btn-postion">
              <div className="button-flex">
                <div>
                  <h3>Job Type List</h3>
                </div>
                <div className="button-flex2">
                  <div className="add-recruiters-btn">
                    <button
                      onClick={handleAddClick}
                      className="default-btn btn btn-primary"
                    >
                      + Add Job Type
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
                    {editItem ? "Edit Job Type" : "Add Job Type"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Job Type Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={jobTypeName}
                      onChange={(e) => setJobTypeName(e.target.value)}
                      placeholder="Enter job type name"
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
    </>
  );
}

export default JobType;
