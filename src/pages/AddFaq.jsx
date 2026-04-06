import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";

const AddFaq = () => {
  const [formData, setFormData] = useState({
    type: "",
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

  // handle normal inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // handle FAQ question & answer
  const handleFaqChange = (index, e) => {
    const { name, value } = e.target;

    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index][name] = value;

    setFormData({
      ...formData,
      faqs: updatedFaqs,
    });
  };

  // add new FAQ
  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: "", answer: "" }],
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}faq`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("FAQ Created:", response.data);
      alert("FAQ Added Successfully");
    } catch (error) {
      console.error("Error creating FAQ:", error);
    }
  };

  return (
    <section className="super-dashboard-content-wrapper">
      <div className="super-dashboard-breadcrumb-info">
        <h4>New FAQ Details</h4>
      </div>

      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/manage-faq">
            <i className="fa-solid fa-angles-left"></i>
          </Link>
          Add New FAQ
        </h5>
      </div>

      <div className="super-dashboard-cms-content-form">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* TYPE */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Select Category</label>
                  <select
                    className="form-control"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="jobSeeker">Job Seeker</option>
                    <option value="employer">Employer</option>
                  </select>
                </div>
              </div>

              {/* HEADING */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Heading</label>
                  <input
                    type="text"
                    name="heading"
                    className="form-control"
                    value={formData.heading}
                    onChange={handleChange}
                    placeholder="Enter Heading"
                    required
                  />
                </div>
              </div>

              {/* SUB HEADING */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Sub Heading</label>
                  <input
                    type="text"
                    name="subHeading"
                    className="form-control"
                    value={formData.subHeading}
                    onChange={handleChange}
                    placeholder="Enter Sub Heading"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter Description"
                  ></textarea>
                </div>
              </div>

              {/* FAQ QUESTION + ANSWER */}
              {formData.faqs.map((faq, index) => (
                <React.Fragment key={index}>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Question</label>
                      <input
                        type="text"
                        name="question"
                        className="form-control"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, e)}
                        placeholder="Enter Question"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Answer</label>
                      <textarea
                        name="answer"
                        className="form-control"
                        rows="4"
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, e)}
                        placeholder="Enter Answer"
                        required
                      ></textarea>
                    </div>
                  </div>
                </React.Fragment>
              ))}

              {/* ADD MORE FAQ */}
              <div className="col-lg-12 mb-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addFaq}
                >
                  + Add More FAQ
                </button>
              </div>

              {/* SUBMIT */}
              <div className="col-lg-12">
                <button type="submit" className="super-dashboard-content-btn">
                  Submit FAQ
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddFaq;
