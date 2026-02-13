import React, { useState, useEffect } from "react";
import axios from "axios";
import { TableView } from "../components/DataTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../Url/Url";
import { Link } from "react-router-dom";

function IndustrySector() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [sectorName, setSectorName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all Industry Sectors
  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/getIndustryList`);
      if (response.data?.success) {
        setData(response.data.data || []); // ✅ Matches your API
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching industries:", error);
      toast.error("Failed to load industry sectors!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  // ✅ Open Add Modal
  const handleAddClick = () => {
    setEditItem(null);
    setSectorName("");
    setShowModal(true);
  };

  // ✅ Open Edit Modal
  const handleEditClick = (row) => {
    setEditItem(row.original);
    setSectorName(row.original.name);
    setShowModal(true);
  };

  // ✅ Add / Update Industry
  const handleSave = async () => {
    if (!sectorName.trim()) {
      toast.warn("Industry sector name is required!");
      return;
    }

    try {
      if (editItem) {
        await axios.put(`${API_BASE_URL}/industry/${editItem._id}`, {
          name: sectorName,
        });
        toast.success("Industry sector updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/addIndustry`, {
          name: sectorName,
        });
        toast.success("Industry sector added successfully!");
      }

      setShowModal(false);
      fetchIndustries();
    } catch (error) {
      console.error("Error saving industry:", error);
      toast.error("Failed to save industry sector!");
    }
  };

  // ✅ Delete Industry
  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this Industry Sector?")
    ) {
      try {
        await axios.delete(`${API_BASE_URL}/industry/${id}`);
        toast.success("Industry sector deleted successfully!");
        fetchIndustries();
      } catch (error) {
        console.error("Error deleting industry:", error);
        toast.error("Failed to delete industry sector!");
      }
    }
  };

  // ✅ Toggle Active/Inactive Status
  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      await axios.put(`${API_BASE_URL}/industry/status/${id}`, {
        is_Active: Boolean(newStatus), // ✅ Ensure boolean
      });

      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, is_Active: newStatus } : item,
        ),
      );

      toast.success(
        `Industry marked as ${newStatus ? "Active" : "Inactive"} successfully!`,
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
      header: "Industry Sector",
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
          <h4>Manage Industry Sector</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Industry Sector List
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
                  <h3>Industry Sector List</h3>
                </div>
                <div className="button-flex2">
                  <div className="add-recruiters-btn">
                    <button
                      onClick={handleAddClick}
                      className="default-btn btn btn-primary"
                    >
                      + Add Industry Sector
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

        {/* ✅ Add/Edit Modal */}
        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editItem ? "Edit Industry Sector" : "Add Industry Sector"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Industry Sector Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={sectorName}
                      onChange={(e) => setSectorName(e.target.value)}
                      placeholder="Enter industry sector name"
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

export default IndustrySector;
