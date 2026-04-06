import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const JobSeekerFAQ = () => {
  const [formData, setFormData] = useState({
    type: "jobseeker",
    heading: "",
    subHeading: "",
    description: "",
    faqs: [
      {
        question: "",
        answer: "",
      },
    ],
  });

  // ===============================
  // GET FAQ DATA
  // ===============================

  const getFaq = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}faq?type=jobseeker`);

      if (res.data && res.data.data) {
        const faq = res.data.data;

        setFormData({
          type: faq.type || "jobseeker",
          heading: faq.heading || "",
          subHeading: faq.subHeading || "",
          description: faq.description || "",
          faqs:
            faq.faqs && faq.faqs.length > 0
              ? faq.faqs
              : [{ question: "", answer: "" }],
        });
      }
    } catch (error) {
      console.error("Error fetching FAQ:", error);
    }
  };

  useEffect(() => {
    getFaq();
  }, []);

  // ===============================
  // NORMAL INPUT CHANGE
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ===============================
  // FAQ CHANGE
  // ===============================

  const handleFaqChange = (index, e) => {
    const { name, value } = e.target;

    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index][name] = value;

    setFormData({
      ...formData,
      faqs: updatedFaqs,
    });
  };

  // ===============================
  // ADD FAQ
  // ===============================

  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: "", answer: "" }],
    });
  };

  // ===============================
  // DELETE FAQ
  // ===============================

  const deleteFaq = (index) => {
    const updatedFaqs = [...formData.faqs];

    updatedFaqs.splice(index, 1);

    setFormData({
      ...formData,
      faqs:
        updatedFaqs.length > 0 ? updatedFaqs : [{ question: "", answer: "" }],
    });
  };

  // ===============================
  // SUBMIT FORM
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}faq`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("FAQ Updated Successfully");
      getFaq();
    } catch (error) {
      console.error("Error saving FAQ:", error);
    }
  };

  return (
    <section className="super-dashboard-content-wrapper">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="super-dashboard-breadcrumb-info">
        <h4>Job Seeker FAQ CMS</h4>
      </div>

      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/manage-faq">
            <i className="fa-solid fa-angles-left"></i>
          </Link>
          Manage Job Seeker FAQ
        </h5>
      </div>

      <div className="super-dashboard-cms-content-form">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Heading */}

              <div className="col-lg-12">
                 <div className="form-group">
                <label>Heading</label>
                <input
                  type="text"
                  name="heading"
                  className="form-control"
                  value={formData.heading}
                  onChange={handleChange}
                  required
                />
                </div>
              </div>

              {/* Sub Heading */}

              <div className="col-lg-12 mt-3">
                  <div className="form-group">
                <label>Sub Heading</label>
                <input
                  type="text"
                  name="subHeading"
                  className="form-control"
                  value={formData.subHeading}
                  onChange={handleChange}
                />
                </div>
              </div>

              {/* Description */}

              <div className="col-lg-12 mt-3">
                  <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                />
                </div>
              </div>

              {/* FAQ QUESTIONS */}

              {formData.faqs.map((faq, index) => (
                <React.Fragment key={index}>
                  <div className="col-lg-12 mt-4">
                      <div className="form-group">
                    <label>Question {index + 1}</label>
                    <input
                      type="text"
                      name="question"
                      className="form-control"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(index, e)}
                      required
                    />
                    </div>
                  </div>

                  <div className="col-lg-12 mt-2">
                      <div className="form-group">
                    <label>Answer</label>
                    <textarea
                      name="answer"
                      className="form-control"
                      rows="3"
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(index, e)}
                      required
                    />
                    </div>
                  </div>

                  {/* DELETE BUTTON */}

                  <div className="col-lg-12 mt-2">
                    {formData.faqs.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteFaq(index)}
                      >
                        Delete 
                      </button>
                    )}
                  </div>

                  <hr className="mt-2" />
                </React.Fragment>
              ))}

              {/* ADD FAQ BUTTON */}

              <div className="col-lg-12 mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addFaq}
                >
                  + Add More 
                </button>
              </div>

              {/* SUBMIT */}

              <div className="col-lg-12 mt-4">
                <button type="submit" className="super-dashboard-content-btn">
                  Update FAQ
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default JobSeekerFAQ;
