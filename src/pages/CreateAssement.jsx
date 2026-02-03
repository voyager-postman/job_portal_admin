import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";
function CreateAssement() {
  const categoryRef = useRef(null);
  const [showManualQuestions, setShowManualQuestions] = useState(false);
  const [categories, setCategories] = useState([]);
  const [questionLevel, setQuestionLevel] = useState("");
  const [bankQuestions, setBankQuestions] = useState([]);
  const [assessmentName, setAssessmentName] = useState("");
  const [questionSource, setQuestionSource] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [formData, setFormData] = useState({
    totalDuration: "",
    totalQuestions: "",
    passingPercentage: "",
  });

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
  }, []);

  const [selectedBankQuestions, setSelectedBankQuestions] = useState([]);
  const [showQuestionOptions, setShowQuestionOptions] = useState(false);
  const [questionSearchTerm, setQuestionSearchTerm] = useState("");

  const questionRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (questionRef.current && !questionRef.current.contains(e.target)) {
        setShowQuestionOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Add / remove question
  const toggleBankQuestion = (question) => {
    setSelectedBankQuestions((prev) =>
      prev.some((q) => q._id === question._id)
        ? prev.filter((q) => q._id !== question._id)
        : [...prev, question],
    );
  };

  // Delete from selected list
  const removeBankQuestion = (id) => {
    setSelectedBankQuestions(selectedBankQuestions.filter((q) => q.id !== id));
  };

  // Search filter
  const filteredQuestions = bankQuestions
    .map((group) => ({
      ...group,
      questions: group.questions.filter((q) =>
        q.question?.toLowerCase().includes(questionSearchTerm.toLowerCase()),
      ),
    }))
    .filter((group) => group.questions.length > 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add new question
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        skillCategory: "",
        question: "",
        options: { A: "", B: "", C: "", D: "" },
        correctAnswer: "",
      },
    ]);
  };

  const handleCategoryChange = (id, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, skillCategory: value } : q)),
    );
  };

  // Add / Remove category
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.some((c) => c._id === category._id)
        ? prev.filter((c) => c._id !== category._id)
        : [...prev, category],
    );
  };

  // Remove by cross icon
  const handleRemoveCategory = (id) => {
    setSelectedCategories((prev) => prev.filter((c) => c._id !== id));
  };

  // Filter categories
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase()),
  );

  // Delete question
  const deleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Update question text
  const handleQuestionChange = (id, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, question: value } : q)),
    );
  };

  // Update option text
  const handleOptionChange = (id, optionKey, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              options: { ...q.options, [optionKey]: value },
            }
          : q,
      ),
    );
  };

  // Update correct answer
  const handleCorrectAnswer = (id, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, correctAnswer: value } : q)),
    );
  };

  console.log("MCQ DATA 👉", questions);
  const fetchQuestionsFromBank = async () => {
    if (!selectedCategories.length || !questionLevel) {
      setBankQuestions([]);
      return;
    }

    try {
      setLoadingQuestions(true);

      const categoryIds = selectedCategories.map((c) => c._id).join(",");

      const res = await axios.get(`${API_BASE_URL}/getQuestionsByCategories`, {
        params: {
          categoryIds,
          level: questionLevel,
        },
      });

      if (res.data?.success) {
        setBankQuestions(res.data.data || []);
      } else {
        setBankQuestions([]);
      }
    } catch (err) {
      toast.error("Failed to load questions");
      setBankQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };
  useEffect(() => {
    fetchQuestionsFromBank();
    setSelectedBankQuestions([]); // reset selection
  }, [selectedCategories, questionLevel]);
  const mapManualQuestionsForApi = () =>
    questions.map((q) => ({
      category: q.skillCategory,
      questionText: q.question,
      optionA: q.options.A,
      optionB: q.options.B,
      optionC: q.options.C,
      optionD: q.options.D,
      correctAnswer: q.correctAnswer,
    }));
  const mapBankQuestionsForApi = () => selectedBankQuestions.map((q) => q._id);
  const buildPayload = () => ({
    assessmentName,
    categories: selectedCategories.map((c) => c._id),
    questionLevel,
    questionSource,
    bankQuestions: questionSource !== "MANUAL" ? mapBankQuestionsForApi() : [],
    manualQuestions:
      questionSource !== "BANK" ? mapManualQuestionsForApi() : [],
    totalDuration: Number(formData.totalDuration),
    passingPercentage: Number(formData.passingPercentage),
  });
  const validateForm = () => {
    if (!assessmentName.trim()) {
      toast.error("Assessment name is required");
      return false;
    }

    if (!selectedCategories.length) {
      toast.error("Please select at least one category");
      return false;
    }

    if (!questionLevel) {
      toast.error("Please select question level");
      return false;
    }

    if (!questionSource) {
      toast.error("Please select question source");
      return false;
    }

    if (!formData.totalDuration || Number(formData.totalDuration) <= 0) {
      toast.error("Total duration must be greater than 0");
      return false;
    }

    if (
      !formData.passingPercentage ||
      Number(formData.passingPercentage) <= 0 ||
      Number(formData.passingPercentage) > 100
    ) {
      toast.error("Passing percentage must be between 1 and 100");
      return false;
    }

    // BANK validation
    if (questionSource === "BANK") {
      if (!selectedBankQuestions.length) {
        toast.error("Please select at least one question from question bank");
        return false;
      }
    }

    // MANUAL validation
    if (questionSource === "MANUAL") {
      if (!questions.length) {
        toast.error("Please add at least one manual question");
        return false;
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];

        if (!q.skillCategory) {
          toast.error(`Select category for question ${i + 1}`);
          return false;
        }

        if (!q.question.trim()) {
          toast.error(`Question text is required for question ${i + 1}`);
          return false;
        }

        if (!q.options.A || !q.options.B || !q.options.C || !q.options.D) {
          toast.error(`All options are required for question ${i + 1}`);
          return false;
        }

        if (!q.correctAnswer) {
          toast.error(`Select correct answer for question ${i + 1}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmitAssessment = async () => {
    if (!validateForm()) return;

    try {
      const payload = buildPayload();

      await axios.post(`${API_BASE_URL}/createSkillAssessment`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Skill Assessment created successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create assessment");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Skill Assessment Question</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/manage-question-bank">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Create Skill Assessment Here
          </h5>
        </div>
        <div className="my-profile-area">
          <div className="profile-form-content">
            <h3>Skill Assessment Form</h3>
            <div className="profile-form">
              <form className="skill-assessments-from-main-area">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Skill assessment name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Skill assessment name"
                        value={assessmentName}
                        onChange={(e) => setAssessmentName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group questions-category-main">
                      <label>Select Category</label>

                      <div
                        className="multi-select-container"
                        ref={categoryRef}
                        style={{ position: "relative" }}
                      >
                        {/* Selected chips */}
                        <div
                          className="selected-items"
                          onClick={() => setShowCategoryOptions(true)}
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            padding: "6px",
                            cursor: "text",
                          }}
                        >
                          {selectedCategories.map((cat) => (
                            <span
                              key={cat._id}
                              style={{
                                background: "#007bff",
                                color: "white",
                                borderRadius: "4px",
                                padding: "3px 6px",
                                margin: "2px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {cat.name}
                              <i
                                className="fa-solid fa-xmark"
                                style={{ cursor: "pointer", marginLeft: "6px" }}
                                onClick={() => handleRemoveCategory(cat._id)}
                              />
                            </span>
                          ))}

                          <input
                            type="text"
                            placeholder="Search category..."
                            value={categorySearchTerm}
                            onChange={(e) =>
                              setCategorySearchTerm(e.target.value)
                            }
                            onFocus={() => setShowCategoryOptions(true)}
                            style={{
                              flex: 1,
                              border: "none",
                              outline: "none",
                              minWidth: "120px",
                            }}
                          />
                        </div>

                        {/* Dropdown */}
                        {showCategoryOptions && (
                          <ul
                            style={{
                              border: "1px solid #ccc",
                              borderRadius: "6px",
                              maxHeight: "200px",
                              overflowY: "auto",
                              background: "#fff",
                              position: "absolute",
                              width: "100%",
                              zIndex: 1000,
                              marginTop: "4px",
                              padding: 0,
                              listStyle: "none",
                            }}
                          >
                            {filteredCategories.map((cat) => {
                              const isSelected = selectedCategories.some(
                                (c) => c._id === cat._id,
                              );

                              return (
                                <li
                                  key={cat._id}
                                  onClick={() => toggleCategory(cat)}
                                  style={{
                                    padding: "6px 10px",
                                    cursor: "pointer",
                                    background: isSelected
                                      ? "#007bff"
                                      : "transparent",
                                    color: isSelected ? "white" : "black",
                                  }}
                                >
                                  {cat.name}
                                  {isSelected && (
                                    <span style={{ float: "right" }}>✔</span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-12">
                    <div className="form-group">
                      <label>Question level</label>
                      <select
                        className="form-select form-control"
                        value={questionLevel}
                        onChange={(e) => setQuestionLevel(e.target.value)}
                      >
                        <option value="">-- Select Level --</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group">
                      <label>Question Source</label>
                      <select
                        className="form-select form-control"
                        value={questionSource}
                        onChange={(e) => {
                          const value = e.target.value;
                          setQuestionSource(value);

                          // reset opposite data
                          if (value === "BANK") {
                            setQuestions([]);
                            setShowManualQuestions(false);
                          } else {
                            setSelectedBankQuestions([]);
                          }
                        }}
                      >
                        <option value="">-- Select Question Source --</option>
                        <option value="BANK">Select From Question Bank</option>
                        <option value="MANUAL">Manual Add (Admin only)</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    {questionSource === "BANK" && (
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group questions-category-main">
                          <label>Question from bank</label>

                          <div
                            className="multi-select-container"
                            ref={questionRef}
                            style={{ position: "relative" }}
                          >
                            {/* Selected + Search */}
                            <div
                              className="selected-items"
                              onClick={() => setShowQuestionOptions(true)}
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                padding: "6px",
                                cursor: "text",
                              }}
                            >
                              {selectedBankQuestions.map((q) => (
                                <span
                                  key={q.id}
                                  style={{
                                    background: "#007bff",
                                    color: "#fff",
                                    borderRadius: "4px",
                                    padding: "3px 6px",
                                    margin: "2px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {q.question}
                                  <i
                                    className="fa-solid fa-xmark"
                                    style={{
                                      marginLeft: "6px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => removeBankQuestion(q.id)}
                                  />
                                </span>
                              ))}

                              <input
                                type="text"
                                placeholder="Search question..."
                                value={questionSearchTerm}
                                onChange={(e) =>
                                  setQuestionSearchTerm(e.target.value)
                                }
                                onFocus={() => setShowQuestionOptions(true)}
                                style={{
                                  flex: 1,
                                  border: "none",
                                  outline: "none",
                                  minWidth: "200px",
                                }}
                              />
                            </div>

                            {/* Dropdown */}
                            {showQuestionOptions && (
                              <ul
                                style={{
                                  border: "1px solid #ccc",
                                  borderRadius: "6px",
                                  maxHeight: "220px",
                                  overflowY: "auto",
                                  background: "#fff",
                                  position: "absolute",
                                  width: "100%",
                                  zIndex: 1000,
                                  marginTop: "4px",
                                  padding: 0,
                                  listStyle: "none",
                                }}
                              >
                                {filteredQuestions.length === 0 && (
                                  <li
                                    style={{ padding: "10px", color: "#999" }}
                                  >
                                    No questions found
                                  </li>
                                )}

                                {filteredQuestions.map((group) => (
                                  <li key={group.categoryId}>
                                    {/* CATEGORY NAME */}
                                    <div
                                      style={{
                                        padding: "8px 10px",
                                        fontWeight: "bold",
                                        background: "#f5f5f5",
                                        borderBottom: "1px solid #ddd",
                                      }}
                                    >
                                      {group.categoryName}
                                    </div>

                                    {/* QUESTIONS */}
                                    {group.questions.map((q) => {
                                      const selected =
                                        selectedBankQuestions.some(
                                          (sq) => sq._id === q._id,
                                        );

                                      return (
                                        <div
                                          key={q._id}
                                          onClick={() => toggleBankQuestion(q)}
                                          style={{
                                            padding: "8px 16px",
                                            cursor: "pointer",
                                            background: selected
                                              ? "#007bff"
                                              : "transparent",
                                            color: selected ? "#fff" : "#000",
                                          }}
                                        >
                                          {q.question}
                                          {selected && (
                                            <span style={{ float: "right" }}>
                                              ✔
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                        <div className="question-bank-question-area mt-3">
                          {selectedBankQuestions.map((q, index) => (
                            <div
                              className="question-bank-question-list"
                              key={q.id}
                            >
                              <div className="question-bank-question">
                                <h5>
                                  <span>Q{index + 1}.</span> {q.question}
                                </h5>
                              </div>
                              <div className="question-bank-question-dltIcon">
                                <i
                                  className="fa-solid fa-trash"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => removeBankQuestion(q.id)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-lg-12">
                    {questionSource === "MANUAL" &&
                      questions.map((q, qIndex) => (
                        <div
                          key={q.id}
                          className="manually-add-options-for-MCQ mb-4"
                        >
                          {/* Category */}
                          <div className="form-group mt-2">
                            <label>Select Category</label>
                            <select
                              className="form-control"
                              value={q.skillCategory}
                              onChange={(e) =>
                                handleCategoryChange(q.id, e.target.value)
                              }
                            >
                              <option value="">Select Category</option>
                              {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <h6>Manually add your Question {qIndex + 1}</h6>

                          {/* Question */}
                          <div className="d-flex gap-2 mb-2">
                            <input
                              className="form-control"
                              placeholder="Write your question"
                              value={q.question}
                              onChange={(e) =>
                                handleQuestionChange(q.id, e.target.value)
                              }
                            />
                            <i
                              className="fa-solid fa-trash text-danger"
                              style={{ cursor: "pointer", marginTop: "10px" }}
                              onClick={() => deleteQuestion(q.id)}
                            />
                          </div>

                          {/* Options */}
                          {["A", "B", "C", "D"].map((opt) => (
                            <div className="form-group mb-2" key={opt}>
                              <input
                                className="form-control"
                                placeholder={`Option ${opt}`}
                                value={q.options[opt]}
                                onChange={(e) =>
                                  handleOptionChange(q.id, opt, e.target.value)
                                }
                              />
                            </div>
                          ))}

                          {/* Correct Answer */}
                          <div className="form-group mt-2">
                            <label>Correct Answer</label>
                            <select
                              className="form-select"
                              value={q.correctAnswer}
                              onChange={(e) =>
                                handleCorrectAnswer(q.id, e.target.value)
                              }
                            >
                              <option value="">Select Correct Answer</option>
                              {["A", "B", "C", "D"].map((opt) => (
                                <option key={opt} value={opt}>
                                  Option {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    {questionSource === "MANUAL" && (
                      <button
                        type="button"
                        className="default-btn btn"
                        onClick={() => {
                          setShowManualQuestions(true);
                          addQuestion();
                        }}
                      >
                        + Add Question Manual
                      </button>
                    )}
                  </div>

                  <div className="col-lg-6 col-md-12">
                    <div className="form-group number-questions-category">
                      <label>Category Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="JAVA"
                      />
                      <input
                        className="form-control"
                        type="text"
                        placeholder="React.js"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group number-questions-category">
                      <label>No. of Questions</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={5}
                      />
                      <input
                        className="form-control"
                        type="text"
                        placeholder={4}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12">
                    <div className="form-group">
                      <label>Total Duration</label>
                      <input
                        className="form-control"
                        type="text"
                        name="totalDuration"
                        placeholder="Total Duration"
                        value={formData.totalDuration}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12">
                    <div className="form-group">
                      <label>Total Questions</label>
                      <input
                        className="form-control"
                        type="text"
                        name="totalQuestions"
                        placeholder="Total Questions"
                        value={formData.totalQuestions}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12">
                    <div className="form-group">
                      <label>Passing Percentage</label>
                      <input
                        className="form-control"
                        type="text"
                        name="passingPercentage"
                        placeholder="Passing Percentage"
                        value={formData.passingPercentage}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="skill-assessment-btn-area">
                    <button
                      type="button"
                      className="default-btn btn"
                      onClick={handleSubmitAssessment}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CreateAssement;
