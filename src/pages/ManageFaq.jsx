import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";

function ManageFaq() {

  const [faqs, setFaqs] = useState([]);

  // Fetch FAQs
  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}faq`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setFaqs(res.data.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Delete FAQ
  const deleteFaq = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      await axios.delete(`${API_BASE_URL}faq/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchFaqs();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <section className="super-dashboard-content-wrapper">

      <div className="super-dashboard-breadcrumb-info">
        <h4>FAQs</h4>
      </div>

      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/">
            <i className="fa-solid fa-angles-left" />
          </Link>
          Manage FAQs
        </h5>

        <Link to="/admin/add-faq" className="super-dashboard-common-add-btn">
          Add New FAQ
        </Link>
      </div>

      <div className="super-admin-manage-candidate-list super-admin-white-bg">

        <div className="table-responsive">
          <table className="table table-bordered">

            <thead>
              <tr>
                <th>S.No</th>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {faqs.length > 0 ? (
                faqs.map((faq, index) => (
                  <tr key={faq._id}>
                    <td>{index + 1}</td>

                    <td>{faq.heading}</td>

                    <td>{faq.description}</td>

                    <td>{faq.type}</td>

                    <td>
                      {new Date(faq.createdAt).toLocaleDateString()}
                    </td>

                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={faq.status}
                            readOnly
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </td>

                    <td>
                      <div className="super-admin-action-icons">

                        <Link to={`/admin/edit-faq/${faq._id}`}>
                          <i className="fa-solid fa-pen" title="Edit"></i>
                        </Link>

                        <i
                          className="fa-solid fa-trash"
                          title="Delete"
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                          onClick={() => deleteFaq(faq._id)}
                        ></i>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No FAQs found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>

    </section>
  );
}

export default ManageFaq;