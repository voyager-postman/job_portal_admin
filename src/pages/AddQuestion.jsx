import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";
import { useLocation } from "react-router-dom";
function AddQuestion() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const editData = state?.addOnData;
  const isEditMode = Boolean(editData?._id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    skillCategory: "",
    level: "",
    question: "",
    options: {
      A: "",
      B: "",
      C: "",
      D: "",
    },
    correctAnswer: "",
  });

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/skill-categories`);
      if (res.data?.success) {
        setCategories(res.data.data);
      }
    } catch {
      toast.error("Failed to load skill categories");
    }
  };

  /* ================= EDIT MODE PREFILL ================= */
  useEffect(() => {
    fetchCategories();

    if (editData) {
      setFormData({
        skillCategory: editData.skillCategory || "",
        level: editData.level || "",
        question: editData.question || "",
        options: editData.options || { A: "", B: "", C: "", D: "" },
        correctAnswer: editData.correctAnswer || "",
      });
    }
  }, [editData]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["A", "B", "C", "D"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        options: { ...prev.options, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ================= VALIDATION ================= */
  useEffect(() => {
    fetchCategories();

    if (editData) {
      setFormData({
        skillCategory:
          editData.skillCategory?._id || editData.skillCategory || "",
        level: editData.level || "",
        question: editData.question || "",
        options: editData.options || { A: "", B: "", C: "", D: "" },
        correctAnswer: editData.correctAnswer || "",
      });
    }
  }, [editData]);

  const validate = () => {
    if (!formData.skillCategory)
      return toast.error("Skill Category is required");
    if (!formData.level) return toast.error("Question Level is required");
    if (!formData.question.trim()) return toast.error("Question is required");

    for (let key of ["A", "B", "C", "D"]) {
      if (!formData.options[key])
        return toast.error(`Option ${key} is required`);
    }

    if (!formData.correctAnswer)
      return toast.error("Correct Answer is required");

    return true;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const url = isEditMode
        ? `${API_BASE_URL}/update-question/${editData._id}`
        : `${API_BASE_URL}/add-question`;

      await axios.post(url, formData);

      toast.success(
        isEditMode
          ? "Question updated successfully!"
          : "Question added successfully!",
      );

      navigate("/admin/manage-question-bank");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>{isEditMode ? "Update" : "Create"} Skill Assessment Question</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/manage-question-bank">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Create Skill Assessment Here
          </h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Skill Category</label>
                  <select
                    className="form-control"
                    name="skillCategory"
                    value={formData.skillCategory}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Skill Category --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Question Level</label>
                  <select
                    className="form-control"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Level --</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Question</label>
                  <input
                    className="form-control"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                {["A", "B", "C", "D"].map((opt) => (
                  <div className="form-group" key={opt}>
                    <label>Option {opt}</label>
                    <input
                      className="form-control"
                      name={opt}
                      value={formData.options[opt]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Select Correct Answer</label>
                  <select
                    className="form-control"
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Correct Answer --</option>
                    {["A", "B", "C", "D"].map((opt) => (
                      <option key={opt} value={opt}>
                        Option {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : isEditMode
                        ? "Update Question"
                        : "Save Question"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AddQuestion;
