import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";
import { useLocation, useParams } from "react-router-dom";

function ViewAssement() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const assessmentId = state?.assessmentId ?? null;
  const isEditMode = !!assessmentId;
  const [assessmentData, setAssessmentData] = useState(null);

  const [loading, setLoading] = useState(false);

  const fetchQuestionById = async (id) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE_URL}getSkillAssessmentFullDetails/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res?.data?.success) {
        setAssessmentData(res.data);

        console.log("Question Data:", res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load question details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode && assessmentId) {
      fetchQuestionById(assessmentId);
    }
  }, [isEditMode, assessmentId]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-common-heading">
          <h5 className="breadcrumb-heading">
            {/* Back icon */}
            <Link to="/admin" className="back-link" title="Back">
              <i className="fa-solid fa-angles-left" />
            </Link>

            {/* Breadcrumb */}
            <Link to="/admin" className="breadcrumb-link">
              Dashboard
            </Link>

            <span className="separator"> › </span>

            {/* Section label (not a route) */}
            <span className="breadcrumb-section">
              {" "}
              <Link to="/admin/assessment-list">Assessments </Link>
            </span>

            <span className="separator"> › </span>

            {/* Active page */}
            <span className="active">Job Test Details</span>
          </h5>
        </div>

        <div className="skill-assessment-detail-main-area">
          <div className="skill-assessment-detail-main">
            <h5>
              Skill Assessment Name:{" "}
              <span>{assessmentData?.assessmentDetails?.assessmentName}</span>
            </h5>
          </div>
          <div className="skill-assessment-detail-main">
            <h5>
              Skill Assessment Category:{" "}
              <span>
                {assessmentData?.assessmentDetails?.skillAssessmentCategory.join(
                  ", ",
                )}
              </span>
            </h5>
          </div>
          <div className="skill-assessment-detail-main">
            <h5>
              Question Level:{" "}
              <span>{assessmentData?.assessmentDetails?.questionLevel}</span>
            </h5>
          </div>
          {assessmentData?.questions.map((q, index) => (
            <div className="skill-assessment-detail-main">
              <div key={q.questionId}>
                <div className="skill-assessment-manually-add-question">
                  <h5>
                    <span>Q{index + 1}.</span> {q.question}
                  </h5>

                  <ul>
                    {q.options.map((opt) => (
                      <li key={opt._id}>
                        Option {opt.key}: <span>{opt.text}</span>
                      </li>
                    ))}
                  </ul>

                  <h4>
                    <span>Correct Answer: </span>
                    {q.correctAnswers.map((ans, i) => {
                      const opt = q.options.find((o) => o.key === ans);
                      return (
                        <>
                          Option {ans}: {opt?.text}
                        </>
                      );
                    })}
                  </h4>
                </div>
              </div>
            </div>
          ))}
          <div className="skill-assessment-detail-main">
            <div className="category-name-no-questions">
              <div className="category-name-area">
                <h5>Category Name</h5>
                {assessmentData?.categoryQuestionCount.map((item) => (
                  <h4 key={item.categoryName}>{item.categoryName}</h4>
                ))}
              </div>

              <div className="number-questions-per-category">
                <h5>No. of Questions</h5>
                {assessmentData?.categoryQuestionCount.map((item) => (
                  <h5 key={item.categoryName}>{item.numberOfQuestions}</h5>
                ))}
              </div>
            </div>
          </div>

          <div className="skill-assessment-detail-main">
            <div className="total-Duration-Questions-passing-percentage">
              <div className="total-dqpp-main-area">
                <h5>
                  Total Duration:{" "}
                  <span>
                    {assessmentData?.assessmentDetails?.totalDuration} mins
                  </span>
                </h5>
              </div>

              <div className="total-dqpp-main-area">
                <h5>
                  Total Questions:{" "}
                  <span>
                    {assessmentData?.assessmentDetails?.totalQuestions}
                  </span>
                </h5>
              </div>

              <div className="total-dqpp-main-area">
                <h5>
                  Passing Percentage:{" "}
                  <span>
                    {assessmentData?.assessmentDetails?.passingPercentage}%
                  </span>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ViewAssement;
