import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const TermandCondition = () => {
  const [formData, setFormData] = useState({
    title: "",
    publishDate: "",
    content: "",
  });

  useEffect(() => {
    getTerms();
  }, []);

  const getTerms = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getTerms`);

      if (res.data?.data) {
        setFormData({
          title: res.data.data.title || "",
          publishDate: res.data.data.publishDate
            ? res.data.data.publishDate.split("T")[0]
            : "",
          content: res.data.data.content || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}upsertTerms`, formData);
      toast.success(res.data.message || "Terms updated successfully");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Terms & Conditions Page Content Form</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Terms & Conditions Section Content Update Here
          </h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Terms & Conditions Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      placeholder="Terms & Conditions"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Publish Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Terms & Conditions Content</label>

                    <CKEditor
                      key={formData.content}
                      editor={ClassicEditor}
                      data={formData.content}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setFormData((prev) => ({
                          ...prev,
                          content: data,
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="super-dashboard-content-btn-info">
                    <button
                      type="submit"
                      className="super-dashboard-content-btn"
                    >
                      Update Content
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </section>
    </>
  );
};

export default TermandCondition;
