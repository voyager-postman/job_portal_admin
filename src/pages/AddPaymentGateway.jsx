import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
function AddPaymentGateway() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const gatewayName = location.state?.gatewayName;
  const gatewayData = location.state?.gatewayData;

  const [formData, setFormData] = useState({
    publishableKey: "",
    secretKey: "",
    webhookSecret: "",
    clientId: "",
    clientSecret: "",
    merchantId: "",
    terminalId: "",
    storeKey: "",
    signingKey: "",
    environment: "test",
  });
  const validateForm = () => {
    if (!gatewayName) {
      toast.error("Invalid Gateway");
      return false;
    }

    if (gatewayName === "stripe") {
      if (
        !formData.publishableKey ||
        !formData.secretKey ||
        !formData.webhookSecret
      ) {
        toast.error("All Stripe fields are required");
        return false;
      }
    }

    if (gatewayName === "paypal") {
      if (
        !formData.clientId ||
        !formData.clientSecret ||
        !formData.merchantId
      ) {
        toast.error("All PayPal fields are required");
        return false;
      }
    }

    if (gatewayName === "cmi") {
      if (!formData.terminalId || !formData.storeKey || !formData.signingKey) {
        toast.error("All CMI fields are required");
        return false;
      }
    }

    if (!formData.environment) {
      toast.error("Please select environment");
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (gatewayData) {
      setFormData((prev) => ({
        ...prev,
        ...gatewayData,
      }));
    }
  }, [gatewayData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      await axios.put(
        `${API_BASE_URL}/payment-gateway/${gatewayName}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success("Gateway Updated Successfully!");

      setTimeout(() => {
        navigate("/admin/payment-gateway-management");
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Update Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <ToastContainer />
        <div className="super-dashboard-breadcrumb-info">
          <h4>Payment Gateway Setup Form</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/payment-gateway-management">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Payment Gateway Update Here
          </h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              {gatewayName === "stripe" && (
                <>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>Publishable Key</label>
                      <input
                        type="text"
                        className="form-control"
                        name="publishableKey"
                        value={formData.publishableKey}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>Secret Key</label>
                      <input
                        type="text"
                        className="form-control"
                        name="secretKey"
                        value={formData.secretKey}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>Webhook Secret</label>
                      <input
                        type="text"
                        className="form-control"
                        name="webhookSecret"
                        value={formData.webhookSecret}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {gatewayName === "paypal" && (
                <>
                  <div className="col-md-6">
                    {" "}
                    <div className="form-group">
                      <label>ClientId</label>
                      <input
                        type="text"
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Client ID"
                      />
                    </div>{" "}
                  </div>
                  <div className="col-md-6">
                    {" "}
                    <div className="form-group">
                      <label>ClientSecret</label>
                      <input
                        type="text"
                        name="clientSecret"
                        value={formData.clientSecret}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Client Secret"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    {" "}
                    <div className="form-group">
                      <label>MerchantId</label>
                      <input
                        type="text"
                        name="merchantId"
                        value={formData.merchantId}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Merchant ID"
                      />
                    </div>
                  </div>
                </>
              )}
              {gatewayName === "cmi" && (
                <>
                  <div className="col-md-6">
                    {" "}
                    <div className="form-group">
                      <label>TerminalId</label>
                      <input
                        type="text"
                        name="terminalId"
                        value={formData.terminalId}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Terminal ID"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    {" "}
                    <div className="form-group">
                      <label>StoreKey</label>
                      <input
                        type="text"
                        name="storeKey"
                        value={formData.storeKey}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Store Key"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    {" "}
                    <div className="form-group">
                      <label>SigningKey</label>
                      <input
                        type="text"
                        name="signingKey"
                        value={formData.signingKey}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Signing Key"
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="col-md-6">
                {" "}
                <div className="form-group">
                  <label>Mode</label>
                  <select
                    name="environment"
                    value={formData.environment}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">-- Select Mode --</option>
                    <option value="test">Test</option>
                    <option value="live">Live</option>
                    <option value="production">Production</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="super-dashboard-content-btn"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Gateway"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AddPaymentGateway;
