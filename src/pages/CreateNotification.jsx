import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url.js";
import { ToastContainer, toast } from "react-toastify";

function CreateNotification() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  });

  const fetchNotification = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getAllNotificationTemplates`);

      const notification = res.data.data.find((item) => item._id === id);

      if (notification) {
        setFormData({
          title: notification.title,
          category: notification.category,
          description: notification.description,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNotification();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Notification title is required");
      return;
    }

    if (!formData.category) {
      toast.error("Please select notification category");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (formData.description.length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}updateNotificationTemplate/${id}`,
        formData,
      );

      if (res.data.success) {
        toast.success("Notification updated successfully ");

        setTimeout(() => {
          navigate("/admin/notification-template");
        }, 1500);
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <section className="super-dashboard-content-wrapper">
      <ToastContainer />

      <div className="super-dashboard-breadcrumb-info">
        <h4>Update Notification</h4>
      </div>

      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/notification-template">
            <i className="fa-solid fa-angles-left" />
          </Link>
          Update Notification
        </h5>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Notification Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter Title"
                  />
                </div>
              </div>

              <div className="col-lg-12">
                <div className="form-group">
                  <label>Select Category</label>
                  <select
                    className="form-select form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    <option value="low_credit">Low Credit</option>
                    <option value="zero_credit">Zero Credit</option>
                  </select>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-lg-12">
                <div className="super-dashboard-content-btn-info">
                  <button type="submit" className="super-dashboard-content-btn">
                    Update Notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default CreateNotification;
