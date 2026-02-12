import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";
import { useLocation } from "react-router-dom";
function AddQuestion() {
  const answerDropdownRef = useRef(null);

  const navigate = useNavigate();
  const { state } = useLocation();
  const editData = state?.addOnData;
  const isEditMode = Boolean(editData?._id);
  const [showAnswerDropdown, setShowAnswerDropdown] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    skillCategory: "",
    level: "", // Easy / Medium / Hard
    questionType: "", // Single / Multiple
    question: "",
    options: {
      A: "",
      B: "",
      C: "",
      D: "",
    },
    correctAnswers: [],
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
  /* ================= VALIDATION ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        answerDropdownRef.current &&
        !answerDropdownRef.current.contains(event.target)
      ) {
        setShowAnswerDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchCategories();

    if (editData) {
      const optionMap = { A: "", B: "", C: "", D: "" };

      editData.options?.forEach((opt) => {
        optionMap[opt.key] = opt.text;
      });

      setFormData({
        skillCategory:
          editData.skillCategory?._id || editData.skillCategory || "",
        level: editData.level || "",
        questionType: editData.questionType || "",
        question: editData.question || "",
        options: optionMap,
        correctAnswers: editData.correctAnswers || [], // ✅ FIXED
      });
    }
  }, [editData]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle Question Type change
    if (name === "questionType") {
      if (value === "boolean") {
        setFormData((prev) => ({
          ...prev,
          questionType: value,
          options: { A: "True", B: "False", C: "", D: "" },
          correctAnswers: [],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          questionType: value,
          options: { A: "", B: "", C: "", D: "" },
          correctAnswers: [],
        }));
      }
      return;
    }

    // Handle options
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

  const handleCorrectAnswerChange = (option) => {
    setFormData((prev) => {
      if (prev.questionType === "single" || prev.questionType === "boolean") {
        return { ...prev, correctAnswers: [option] };
      }

      const exists = prev.correctAnswers.includes(option);
      return {
        ...prev,
        correctAnswers: exists
          ? prev.correctAnswers.filter((ans) => ans !== option)
          : [...prev.correctAnswers, option],
      };
    });
  };
  const validate = () => {
    if (!formData.skillCategory) {
      toast.error("Skill Category is required");
      return false;
    }

    if (!formData.questionType) {
      toast.error("Question Type is required");
      return false;
    }

    if (!formData.level) {
      toast.error("Question Level is required");
      return false;
    }

    if (!formData.question.trim()) {
      toast.error("Question is required");
      return false;
    }

    // 🔥 Boolean: only A & B
    const optionKeys =
      formData.questionType === "boolean" ? ["A", "B"] : ["A", "B", "C", "D"];

    for (let key of optionKeys) {
      if (!formData.options[key]?.trim()) {
        toast.error(`Option ${key} is required`);
        return false;
      }
    }

    if (formData.correctAnswers.length === 0) {
      toast.error("Please select at least one correct answer");
      return false;
    }

    if (
      formData.questionType === "boolean" &&
      !["A", "B"].some((k) => formData.correctAnswers.includes(k))
    ) {
      toast.error("Please select True or False");
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const formattedOptions = Object.entries(formData.options)
        .filter(([key, text]) => text && text.trim() !== "") // ✅ REMOVE EMPTY
        .map(([key, text]) => ({ key, text }));

      const payload = {
        skillCategory: formData.skillCategory,
        level: formData.level,
        questionType: formData.questionType,
        question: formData.question,
        options: formattedOptions,
        correctAnswers: formData.correctAnswers,
      };

      const url = isEditMode
        ? `${API_BASE_URL}/update-question/${editData._id}`
        : `${API_BASE_URL}/add-question`;

      await axios.post(url, payload);

      toast.success(
        isEditMode
          ? "Question updated successfully!"
          : "Question added successfully!",
      );

      setTimeout(() => {
        navigate("/admin/manage-question-bank");
      }, 1200);
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
          <h5 className="breadcrumb-heading">
            {/* Back icon */}
            <Link to="/admin/manage-question-bank" className="back-link">
              <i className="fa-solid fa-angles-left" />
            </Link>

            {/* Breadcrumb links */}
            <Link to="/admin" className="breadcrumb-link">
              Dashboard
            </Link>

           

          

            <span className="separator"> › </span>

            <Link to="/admin/manage-question-bank" className="breadcrumb-link">
              Questions
            </Link>

            <span className="separator"> › </span>

            {/* Active page */}
            <span className="active">Add Question</span>
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
                  <label>Question Type</label>
                  <select
                    className="form-control"
                    name="questionType"
                    value={formData.questionType}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Question Type --</option>
                    <option value="single">Single Choice</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="boolean">True / False</option>
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
                  <textarea
                    className="form-control"
                    name="question"
                    rows={2} // 👈 height (adjust if needed)
                    placeholder="Enter question here..."
                    value={formData.question}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-lg-12 col-md-12">
                {["A", "B"].map((opt) => (
                  <div className="form-group" key={opt}>
                    <label>
                      Option {opt}
                      {formData.questionType === "boolean" &&
                        ` (${opt === "A" ? "True" : "False"})`}
                    </label>
                    <input
                      className="form-control"
                      placeholder={`Option (${opt})`}
                      name={opt}
                      value={formData.options[opt]}
                      onChange={handleChange}
                      disabled={formData.questionType === "boolean"}
                    />
                  </div>
                ))}

                {/* Show C & D only if NOT boolean */}
                {formData.questionType !== "boolean" &&
                  ["C", "D"].map((opt) => (
                    <div className="form-group" key={opt}>
                      <label>Option {opt}</label>
                      <input
                        placeholder={`Option (${opt})`}
                        className="form-control"
                        name={opt}
                        value={formData.options[opt]}
                        onChange={handleChange}
                      />
                    </div>
                  ))}
              </div>

              <div
                ref={answerDropdownRef}
                className="form-group position-relative"
              >
                <label>Correct Answer</label>

                <div
                  className="form-control d-flex justify-content-between align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowAnswerDropdown((prev) => !prev)}
                >
                  <span>
                    {formData.correctAnswers.length > 0
                      ? `Selected: ${formData.correctAnswers.join(", ")}`
                      : "Select Correct Answer"}
                  </span>
                  <i className="fa fa-caret-down" />
                </div>

                {showAnswerDropdown && (
                  <div
                    className="border mt-1 p-2 bg-white position-absolute w-100"
                    style={{ zIndex: 1000 }}
                  >
                    {(formData.questionType === "boolean"
                      ? ["A", "B"]
                      : ["A", "B", "C", "D"]
                    ).map((opt) => (
                      <div className="form-check" key={opt}>
                        <input
                          type={
                            formData.questionType === "multiple"
                              ? "checkbox"
                              : "radio"
                          }
                          className="form-check-input"
                          checked={formData.correctAnswers.includes(opt)}
                          onChange={() => handleCorrectAnswerChange(opt)}
                        />
                        <label className="form-check-label">
                          {formData.questionType === "boolean"
                            ? opt === "A"
                              ? "True"
                              : "False"
                            : `Option ${opt}`}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <button
                    class="super-dashboard-content-btn"
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
