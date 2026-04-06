import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ContactPageContent = () => {
  const [formData, setFormData] = useState({
    address: "",
    lat: "",
    lng: "",
    emails: [""],
    phones: [""],
    heading: "",
    agreeText: "",
  });
  const validateForm = () => {
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return false;
    }

    if (!formData.heading.trim()) {
      toast.error("Heading is required");
      return false;
    }

    if (!formData.emails[0]) {
      toast.error("At least one email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (let email of formData.emails) {
      if (!emailRegex.test(email)) {
        toast.error("Invalid email format");
        return false;
      }
    }

    if (!formData.phones[0]) {
      toast.error("At least one phone number required");
      return false;
    }

    return true;
  };
  // GET DATA
  useEffect(() => {
    fetchContactUs();
  }, []);

  const fetchContactUs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getContactUs`);

      const data = res.data?.data;

      setFormData({
        address: data?.location?.address || "",
        lat: data?.location?.lat || "",
        lng: data?.location?.lng || "",
        emails: data?.emails?.length ? data.emails : [""],
        phones: data?.phones?.length ? data.phones : [""],
        heading: data?.sendMessageSection?.heading || "",
        agreeText: data?.sendMessageSection?.agreeText || "",
      });
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // UPDATE API
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await axios.post(`${API_BASE_URL}updateContactUs`, formData);

      toast.success("Contact content updated successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEmailChange = (index, value) => {
    const updatedEmails = [...formData.emails];
    updatedEmails[index] = value;

    setFormData({ ...formData, emails: updatedEmails });
  };

  const addEmail = () => {
    setFormData({ ...formData, emails: [...formData.emails, ""] });
  };

  const removeEmail = (index) => {
    const updatedEmails = formData.emails.filter((_, i) => i !== index);
    setFormData({ ...formData, emails: updatedEmails });
  };
  const handlePhoneChange = (index, value) => {
    const updatedPhones = [...formData.phones];
    updatedPhones[index] = value;

    setFormData({ ...formData, phones: updatedPhones });
  };

  const addPhone = () => {
    setFormData({ ...formData, phones: [...formData.phones, ""] });
  };

  const removePhone = (index) => {
    const updatedPhones = formData.phones.filter((_, i) => i !== index);
    setFormData({ ...formData, phones: updatedPhones });
  };
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Contact Page Content Form</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Contact Section Content Update Here
          </h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              {/* EMAIL */}
              <div className="col-lg-6">
                <label>Emails</label>

                {formData.emails.map((email, index) => (
                  <div className="d-flex mb-2" key={index}>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder="Enter email"
                    />

                    {index > 0 && (
                      <button
                        type="button"
                        className="btn btn-danger ms-2"
                        onClick={() => removeEmail(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={addEmail}
                >
                  + Add Email
                </button>
              </div>

              {/* PHONE */}
              <div className="col-lg-6">
                <label>Phones</label>

                {formData.phones.map((phone, index) => (
                  <div className="d-flex mb-2" key={index}>
                    <input
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                      placeholder="Enter phone"
                    />

                    {index > 0 && (
                      <button
                        type="button"
                        className="btn btn-danger ms-2"
                        onClick={() => removePhone(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={addPhone}
                >
                  + Add Phone
                </button>
              </div>

              {/* ADDRESS */}
              <div className="col-lg-12 mt-1">
                <div className="form-group">
                  <label>Our Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                  />
                </div>
              </div>

              {/* LAT */}
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Latitude</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* LNG */}
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Longitude</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lng"
                    value={formData.lng}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* HEADING */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Message Heading</label>
                  <input
                    type="text"
                    className="form-control"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* AGREE TEXT */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Agree Text</label>
                  <input
                    type="text"
                    className="form-control"
                    name="agreeText"
                    value={formData.agreeText}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* BUTTON */}
              <div className="col-lg-12">
                <div className="super-dashboard-content-btn-info">
                  <button
                    className="super-dashboard-content-btn"
                    onClick={handleSubmit}
                  >
                    Update Content
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPageContent;
