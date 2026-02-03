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
  const token = localStorage.getItem("token");
  const mapAssessments = (assessments = []) => {
    return assessments.map((assessment) => ({
      _id: assessment._id,
      assessmentName: assessment.assessmentName,
      totalQuestions: assessment.totalQuestions,
      totalDuration: assessment.totalDuration,
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

      const response = await axios.get(`${API_BASE_URL}/getSkillAssessments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        const formattedData = mapAssessments(response.data.data);
        setData(formattedData);
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
  }, []);
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
      header: "Passing %",
      accessorKey: "passingPercentage",
      cell: ({ row }) => `${row.original.passingPercentage}%`,
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
      text: "This question will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/delete-question/${id}`);

      Swal.fire("Deleted!", "Question deleted successfully.", "success");

      // Remove from UI
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error!", "Failed to delete question.", "error");
    }
  };

  // ✅ Toggle Active/Inactive (Dynamic)
  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      await axios.post(`${API_BASE_URL}/question-status/${id}`, {
        isActive: newStatus,
      });

      // Update UI instantly
      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isActive: newStatus } : item,
        ),
      );

      toast.success(`Question marked as ${newStatus ? "Active" : "Inactive"}`);
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update question status");
    }
  };

  return (
    <div>
      {" "}
      <div className="main-dashboard-content d-flex flex-column">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Question List </h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Question Management
          </h5>
        </div>
        <div className="responsive-content">
          <div className="my-profile-area">
            <div className="profile-form-content add-recruiters-btn-postion">
              <h3>Assessments Question List</h3>
              <div className="add-recruiters-btn">
                <Link
                  to="/admin/create-assessment"
                  className="super-dashboard-common-add-btn"
                >
                  Add Assessment
                </Link>
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

export default ManageAssementList;
