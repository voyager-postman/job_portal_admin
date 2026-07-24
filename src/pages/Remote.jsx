import React, { useState, useEffect } from "react";
import axios from "axios";
import { TableView } from "../components/DataTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../Url/Url";
import { Link } from "react-router-dom";

function Remote() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [jobTypeName, setJobTypeName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ GET ALL REMOTE
  const fetchRemote = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/getAllRemote`);
      if (res.data?.success) {
        setData(res.data.data || []);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load remote filters!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemote();
  }, []);

  // ✅ ADD / UPDATE
  const handleSave = async () => {
    if (!jobTypeName.trim()) {
      toast.warn("Remote Type is required!");
      return;
    }

    try {
      if (editItem) {
        // UPDATE
        await axios.post(`${API_BASE_URL}/updateRemote/${editItem._id}`, {
          name: jobTypeName,
        });
        toast.success("Job Type updated!");
      } else {
        // ADD
        await axios.post(`${API_BASE_URL}/addRemote`, {
          name: jobTypeName,
        });
        toast.success("Job Type added!");
      }

      setShowModal(false);
      fetchRemote();
    } catch (err) {
      console.error(err);

      const message = err?.response?.data?.message;

      if (message) {
        toast.error(message);
      } else {
        toast.error("Save failed!");
      }
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Remote Type?")) return;

    try {
      await axios.post(`${API_BASE_URL}/deleteRemote/${id}`);
      toast.success("Deleted successfully!");
      fetchRemote();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed!");
    }
  };

  // ✅ TOGGLE STATUS
  const handleStatusChange = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/toggleRemote/${id}`);

      // instant UI update
      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, is_Active: !item.is_Active } : item,
        ),
      );

      toast.success("Status updated!");
    } catch (err) {
      console.error(err);
      toast.error("Status update failed!");
    }
  };

  // ✅ EDIT
  const handleEditClick = (row) => {
    setEditItem(row.original);
    setJobTypeName(row.original.name);
    setShowModal(true);
  };

  // ✅ ADD
  const handleAddClick = () => {
    setEditItem(null);
    setJobTypeName("");
    setShowModal(true);
  };

  const columns = [
    {
      Header: "S.No",
      id: "serial",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Remote Type",
      accessor: "name",
    },
    {
      Header: "Status",
      accessor: "is_Active",
      Cell: ({ row }) => (
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
      Header: "Action",
      id: "action",
      Cell: ({ row }) => (
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
          <h4>Manage Remote Type</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Remote Type List
          </h5>
        </div>
      </section>
      <div className="main-dashboard-content d-flex flex-column">
        <ToastContainer position="top-right" autoClose={2000} theme="colored" />
        <div className="responsive-content">
          <div className="my-profile-area">
            <div className="profile-form-content add-recruiters-btn-postion">
              <div className="button-flex category-action-toolbar">
                <div className="button-flex2">
                  <div className="add-recruiters-btn">
                    <button
                      onClick={handleAddClick}
                      className="default-btn btn btn-primary"
                    >
                      + Add Remote Type
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
                    {editItem ? "Edit Remote Type" : "Add Remote Type"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Remote Type Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={jobTypeName}
                      onChange={(e) => setJobTypeName(e.target.value)}
                      placeholder="Enter Remote Type name"
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

export default Remote;
