import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
const PaymentGatewayManagement = () => {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchPaymentGateways = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}/payment-gateways`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data?.success) {
        setGateways(response.data.data || []);
      } else {
        setGateways([]);
      }
    } catch (error) {
      console.error("Error fetching gateways:", error);
      toast.error("Failed to load payment gateways!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPaymentGateways();
  }, []);
  const toggleGatewayStatus = async (id, currentStatus) => {
    try {
      await axios.post(
        `${API_BASE_URL}/gateway/${id}/status`,
        {
          isActive: !currentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success("Gateway status updated!");

      // Refresh list after update
      fetchPaymentGateways();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update gateway status!");
    }
  };
  const gatewayImages = {
    paypal: "https://www.paypalobjects.com/webstatic/icon/pp258.png",
    stripe: "https://stripe.com/img/v3/home/twitter.png",
    cmi: `${process.env.PUBLIC_URL}/assets/images/icon/cmi.png`,
  };

  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <ToastContainer position="top-right" autoClose={2000} theme="colored" />

        <div className="super-dashboard-breadcrumb-info">
          <h4>Payment Gateway Management</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Payment Gateway Management List
          </h5>
        </div>
        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="table-column-status-sno">S.No.</th>
                <th>Img</th>
                <th>Payment Gateway Name</th>
                {/* <th>Charge</th> */}
                <th className="table-column-status-size">Status</th>
                <th className="table-column-status-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : gateways.length > 0 ? (
                gateways.map((gateway, index) => (
                  <tr key={gateway._id}>
                    <td>{index + 1}</td>

                    <td>
                      <img
                        src={gatewayImages[gateway.gatewayName]}
                        alt={gateway.gatewayName}
                        width={25}
                      />
                    </td>

                    <td style={{ textTransform: "capitalize" }}>
                      {gateway.gatewayName}
                    </td>

                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={gateway.isActive}
                            onChange={() =>
                              toggleGatewayStatus(gateway._id, gateway.isActive)
                            }
                          />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>

                    <td>
                      <div className="super-admin-action-icons">
                        <Link
                          to="/admin/add-gateway-setup"
                          state={{
                            gatewayName: gateway.gatewayName,
                            gatewayData: gateway,
                          }}
                        >
                          <i className="fa-solid fa-pen" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No Payment Gateways Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default PaymentGatewayManagement;
