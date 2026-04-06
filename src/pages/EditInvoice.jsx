import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    currency: "",
    paymentMethod: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // fetch invoice details
  const fetchInvoiceDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}getInvoices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const invoice = res.data?.data?.find((item) => item._id === id);

      if (invoice) {
        setFormData({
          amount: invoice.amount,
          currency: invoice.currency,
          paymentMethod: invoice.paymentMethod,
        });
      }
    } catch (error) {
      console.error("Fetch invoice error", error);
    }
  };

  useEffect(() => {
    fetchInvoiceDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}updateInvoice/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Invoice Updated Successfully!");

        setTimeout(() => {
          navigate("/admin/invoice-list");
        }, 1500);
      } else {
        toast.error(response.data.message || "Update Failed");
      }
    } catch (error) {
      console.error("Update Invoice Error:", error);
      toast.error("Error while updating invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Update Invoice</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/invoice-list">
              <i className="fa-solid fa-angles-left"></i>
            </Link>
            Update Invoice Details
          </h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter Amount"
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Currency</label>
                    <input
                      type="text"
                      className="form-control"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      placeholder="Enter Currency"
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Payment Method</label>

                    <select
                      className="form-control"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Payment Method</option>
                      <option value="Paypal">Paypal</option>
                      <option value="Stripe">Stripe</option>
                      <option value="Manual">Manual</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="super-dashboard-content-btn-info">
                    <button
                      type="submit"
                      className="super-dashboard-content-btn"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Invoice"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditInvoice;
