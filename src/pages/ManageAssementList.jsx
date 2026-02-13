import React, { useState, useEffect } from "react";
import axios from "axios";
import { TableView } from "../components/DataTable";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const ManageAssementList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [techName, setTechName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errors, setErrors] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");

  const mapAssessments = (assessments = []) => {
    return assessments.map((assessment) => ({
      _id: assessment._id,
      assessmentName: assessment.assessmentName,
      totalQuestions: assessment.totalQuestions,
      totalDuration: assessment.totalDuration,
      createdByType: assessment.createdByType,
      createdBy: assessment.createdBy,
      passingPercentage: assessment.passingPercentage,
      questionLevel: assessment.questionLevel,
      questionSource: assessment.questionSource,
      isActive: assessment.isActive,
      createdAt: assessment.createdAt,
    }));
  };

  const fetchTechStacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/getSkillAssessments?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.success) {
        const formattedData = mapAssessments(response.data.data);
        setData(formattedData);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching Skill Assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechStacks();
  }, [page, limit]);

  const columns = [
    {
      header: "Assessment Name",
      accessorKey: "assessmentName",
    },
    {
      header: "Total Questions",
      accessorKey: "totalQuestions",
    },
    {
      header: "Total Duration (mins)",
      accessorKey: "totalDuration",
    },
    {
      header: "Created By",
      accessorKey: "createdBy",
      cell: ({ row }) => `${row.original.createdBy}`,
    },
    {
      header: "Passing %",
      accessorKey: "passingPercentage",
      cell: ({ row }) => `${row.original.passingPercentage}%`,
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="super-admin-action-icons">
          <i
            className="fa-solid fa-pencil"
            title="Edit"
            onClick={() =>
              navigate("/admin/create-assessment", {
                state: { assessmentId: row.original._id },
              })
            }
          />
          <Link
            to="/admin/view-assessment"
            state={{
              assessmentId: row.original._id,
            }}
          >
            <i className="fa-solid fa-eye"></i>
          </Link>
          <i
            className="fa-solid fa-trash"
            title="Delete"
            onClick={() => handleDelete(row.original._id)}
          />
        </div>
      ),
    },
  ];
  // ✅ Open Add Modal

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
      text: "This assessment will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/deleteSkillAssessment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire("Deleted!", "Assessment deleted successfully.", "success");

      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Failed to delete assessment.",
        "error",
      );
    }
  };

  // ✅ Handle Import
  const handleImport = async (file) => {
    if (!file) {
      toast.warning("Please select a file to import!");
      return;
    }

    // Validate file format
    if (
      !file.name.toLowerCase().endsWith(".json") &&
      file.type !== "application/json"
    ) {
      toast.error("Please select a valid JSON file!");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/bulkImportQuestions`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Always show the message
      toast.success(response.data.message);

      // If there are errors, set them and show modal
      if (response.data.errors && response.data.errors.length > 0) {
        setErrors(response.data.errors);
        setShowErrorModal(true);
      }

      // Refresh the list only if some questions were imported
      if (response.data.successCount > 0) {
        fetchTechStacks();
      }

      // Close the import modal
      setShowImportModal(false);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error.response?.data?.message || "Import failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {" "}
      <div className="main-dashboard-content d-flex flex-column">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Assessments</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5 className="breadcrumb-heading">
            {/* Back icon */}
            <Link to="/admin" className="back-link">
              <i className="fa-solid fa-angles-left" />
            </Link>
            {/* Active page */}
            <span className="active">Assessments</span>
          </h5>
        </div>

        <div className="responsive-content">
          <div className="my-profile-area">
            <div className="profile-form-content add-recruiters-btn-postion">
              <div className="button-flex">
                <div>
                  <h3>Assessments</h3>
                </div>
                <div className="button-flex2">
                  <div className="add-recruiters-btn">
                    <Link
                      to="/admin/create-assessment"
                      className="default-btn btn btn-primary"
                    >
                      + Add Assessment
                    </Link>
                  </div>
                  <div className="add-recruiters-btn">
                    <Link
                      className="default-btn btn btn-primary"
                      onClick={() => setShowImportModal(true)}
                    >
                      Import
                    </Link>
                  </div>
                </div>
              </div>

              <div className="profile-form mt-3">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <>
                        <TableView
                          columns={columns}
                          data={data}
                          limit={limit}
                          setLimit={(val) => {
                            setLimit(val);
                            setPage(1);
                          }}
                        />
                        {/* Pagination */}
                        <div className="d-flex justify-content-center mt-3">
                          <button
                            className="btn btn-sm btn-primary mx-1"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                          >
                            Prev
                          </button>
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i}
                              className={`btn btn-sm mx-1 ${
                                page === i + 1
                                  ? "btn-primary"
                                  : "btn-outline-primary"
                              }`}
                              onClick={() => setPage(i + 1)}
                            >
                              {i + 1}
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

        {/* ✅ Import Modal */}
        {showImportModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Import Assessments</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowImportModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Select File</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleImport(file);
                        }
                      }}
                    />
                    <small className="form-text text-muted">
                      Supported formats: JSON (.json)
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowImportModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Error Modal */}
        {showErrorModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Import Errors</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowErrorModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>The following questions were rejected during import:</p>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Index</th>
                        <th>Question</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errors.map((error, idx) => (
                        <tr key={idx}>
                          <td>{error.index}</td>
                          <td>{error.question}</td>
                          <td>{error.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowErrorModal(false)}
                  >
                    Close
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

export default ManageAssementList;
