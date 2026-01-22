import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";
import { useLocation } from "react-router-dom";
function CreateAssement() {
  const categoryRef = useRef(null);
  const [questionSource, setQuestionSource] = useState("");

  const categories = ["JAVA", "React.js", "Node.js", "PHP", "QA", "Wordpress"];
  const questionBank = [
    { id: 1, text: "What is JVM?" },
    { id: 2, text: "Explain OOP principles" },
    { id: 3, text: "What is ArrayList?" },
    { id: 4, text: "What is React?" },
    { id: 5, text: "Explain Node.js" },
  ];
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

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
  ]);
  // Add / remove question
  const toggleBankQuestion = (question) => {
    if (selectedBankQuestions.find((q) => q.id === question.id)) {
      setSelectedBankQuestions(
        selectedBankQuestions.filter((q) => q.id !== question.id),
      );
    } else {
      setSelectedBankQuestions([...selectedBankQuestions, question]);
    }
  };

  // Delete from selected list
  const removeBankQuestion = (id) => {
    setSelectedBankQuestions(selectedBankQuestions.filter((q) => q.id !== id));
  };

  // Search filter
  const filteredQuestions = questionBank.filter((q) =>
    q.text.toLowerCase().includes(questionSearchTerm.toLowerCase()),
  );

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
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ]);
  };
  // Add / Remove category
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Remove by cross icon
  const handleRemoveCategory = (category) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category));
  };

  // Filter categories
  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(categorySearchTerm.toLowerCase()),
  );

  // Delete question
  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Update question text
  const handleQuestionChange = (id, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, question: value } : q)),
    );
  };

  // Update option text
  const handleOptionChange = (qId, index, value) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId) {
          const updatedOptions = [...q.options];
          updatedOptions[index] = value;
          return { ...q, options: updatedOptions };
        }
        return q;
      }),
    );
  };

  // Update correct answer
  const handleCorrectAnswer = (qId, value) => {
    setQuestions(
      questions.map((q) => (q.id === qId ? { ...q, correctAnswer: value } : q)),
    );
  };

  console.log("MCQ DATA 👉", questions);

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
                              key={cat}
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
                              {cat}
                              <i
                                className="fa-solid fa-xmark"
                                style={{ cursor: "pointer", marginLeft: "6px" }}
                                onClick={() => handleRemoveCategory(cat)}
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
                            {filteredCategories.map((cat) => (
                              <li
                                key={cat}
                                onClick={() => toggleCategory(cat)}
                                style={{
                                  padding: "6px 10px",
                                  cursor: "pointer",
                                  background: selectedCategories.includes(cat)
                                    ? "#007bff"
                                    : "transparent",
                                  color: selectedCategories.includes(cat)
                                    ? "white"
                                    : "black",
                                }}
                              >
                                {cat}
                                {selectedCategories.includes(cat) && (
                                  <span style={{ float: "right" }}>✔</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-12">
                    <div className="form-group">
                      <label>Question level</label>
                      <select
                        name="cars"
                        className="form-select form-control"
                        aria-label="Default2 select example"
                        id="Industry"
                      >
                        <option value="volvo">Select question level</option>
                        <option value="volvo">Easy</option>
                        <option value="saab">Medium</option>
                        <option value="saab">Hard</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group">
                      <label>Question Source</label>
                      <select
                        className="form-select form-control"
                        value={questionSource}
                        onChange={(e) => setQuestionSource(e.target.value)}
                      >
                        <option value="">Select question Source</option>
                        <option value="bank">Select From Question Bank</option>
                        <option value="manual">Manual Add (Admin only)</option>
                        <option value="both">Bank + Manual Add</option>{" "}
                      </select>
                    </div>
                  </div>
                  {(questionSource === "bank" || questionSource === "both") && (
                    <div className="col-lg-12 col-md-12">
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
                                  {q.text}
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
                                {filteredQuestions.length ? (
                                  filteredQuestions.map((q) => {
                                    const selected = selectedBankQuestions.some(
                                      (sq) => sq.id === q.id,
                                    );
                                    return (
                                      <li
                                        key={q.id}
                                        onClick={() => toggleBankQuestion(q)}
                                        style={{
                                          padding: "8px 10px",
                                          cursor: "pointer",
                                          background: selected
                                            ? "#007bff"
                                            : "transparent",
                                          color: selected ? "#fff" : "#000",
                                        }}
                                      >
                                        {q.text}
                                        {selected && (
                                          <span style={{ float: "right" }}>
                                            ✔
                                          </span>
                                        )}
                                      </li>
                                    );
                                  })
                                ) : (
                                  <li style={{ padding: "8px", color: "#888" }}>
                                    No question found
                                  </li>
                                )}
                              </ul>
                            )}
                          </div>
                        </div>

                        {/* SELECTED QUESTIONS LIST */}
                        <div className="question-bank-question-area mt-3">
                          {selectedBankQuestions.map((q, index) => (
                            <div
                              className="question-bank-question-list"
                              key={q.id}
                            >
                              <div className="question-bank-question">
                                <h5>
                                  <span>Q{index + 1}.</span> {q.text}
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
                    </div>
                  )}
                  {(questionSource === "manual" ||
                    questionSource === "both") && (
                    <div className="col-lg-12">
                      {questions.map((q, qIndex) => (
                        <div
                          className="manually-add-options-for-MCQ mb-4"
                          key={q.id}
                        >
                          <div className="form-group">
                            <h6>Question {qIndex + 1}</h6>
                          </div>

                          {/* Question */}
                          <div className="manually-add-dlt-question-area d-flex gap-2">
                            <input
                              className="form-control"
                              type="text"
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
                          <div className="manually-add-mcq-options mt-3">
                            <h6>Options For MCQ</h6>

                            {q.options.map((opt, i) => (
                              <div className="form-group mb-2" key={i}>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={`Option ${String.fromCharCode(
                                    65 + i,
                                  )}`}
                                  value={opt}
                                  onChange={(e) =>
                                    handleOptionChange(q.id, i, e.target.value)
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
                                {q.options.map((_, i) => (
                                  <option key={i} value={i}>
                                    Option {String.fromCharCode(65 + i)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addQuestion}
                      >
                        + Add Question
                      </button>
                    </div>
                  )}
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
                      <input
                        className="form-control"
                        type="text"
                        placeholder="QA"
                      />
                      <input
                        className="form-control"
                        type="text"
                        placeholder="PHP"
                      />
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Wordpress"
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
                      <input
                        className="form-control"
                        type="text"
                        placeholder={6}
                      />
                      <input
                        className="form-control"
                        type="text"
                        placeholder={7}
                      />
                      <input
                        className="form-control"
                        type="text"
                        placeholder={8}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12">
                    <div className="form-group">
                      <label>Total Duration</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Total Duration"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12">
                    <div className="form-group">
                      <label>Total Questions</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Total Questions"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12">
                    <div className="form-group">
                      <label>Passing Percentage</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Passing Percentage"
                      />
                    </div>
                  </div>
                  <div className="skill-assessment-btn-area">
                    <a href="#" className="default-btn btn">
                      Submit
                    </a>
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
