import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";
import { useNavigate } from "react-router-dom";
import { TableView } from "../components/DataTable";
import { Tooltip } from "antd";
function AdminCreditManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pack");
  const [packRequests, setPackRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [manualCreditRequests, setManualCreditRequests] = useState([]);

  const [manualInvoiceData, setManualInvoiceData] = useState({
    amount: "",
    jobCredits: "",
    profileCredits: "",
    currency: "",
  });
  const openManualInvoiceModal = (req) => {
    console.log(req);
    setSelectedRequest(req);
    setShowManualModal(true);
  };
  const fetchPackRequests = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}addOn/requests`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPackRequests(response.data.addOnRequests || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load pack requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchManualRequests = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}getManualRequestsForAdmin`,
        {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setManualCreditRequests(response.data.manualRequests || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load manual requests");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (activeTab === "pack") {
      fetchPackRequests();
    } else if (activeTab === "manual") {
      fetchManualRequests();
    }
  }, [page, limit, activeTab]);
  const columns = [
    {
      Header: "S.No",
      id: "sno",
      Cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },

    {
      Header: "Contact Person",
      id: "contactPerson",
      Cell: ({ row }) =>
        row.original.requestType === "MANUAL_CREDITS"
          ? row.original.company?.brandName || "-"
          : row.original.contactPersonName || "-",
    },

    {
      Header: "Email",
      id: "email",
      Cell: ({ row }) =>
        row.original.requestType === "MANUAL_CREDITS"
          ? row.original.company?.userId?.email || "-"
          : row.original.contactEmail || "-",
    },

    {
      Header: "Phone",
      id: "phone",
      Cell: ({ row }) =>
        row.original.company?.phone
          ? `+${row.original.company.phone.countryCode} ${row.original.company.phone.number}`
          : "-",
    },

    {
      Header: "Type",
      id: "packName",
      Cell: ({ row }) =>
        row.original.addOn ? `${row.original.addOn.name}` : "-",
    },

    {
      Header: "Credits",
      id: "credits",
      Cell: ({ row }) => {
        const jobCredits =
          row.original.pack?.jobPostingCredits ??
          row.original.jobCreditsRequested ??
          0;
        const profileCredits =
          row.original.pack?.profileViewingCredits ??
          row.original.profileCreditsRequested ??
          0;

        const jobValue = jobCredits === -1 ? "Unlimited" : jobCredits;
        const profileValue =
          profileCredits === -1 ? "Unlimited" : profileCredits;

        return (
          <Tooltip title="J = Job Credits | P = Profile Credits">
            <span style={{ cursor: "pointer" }}>
              {jobValue}J / {profileValue}P
            </span>
          </Tooltip>
        );
      },
    },

    {
      Header: "Amount",
      id: "amount",
      Cell: ({ row }) =>
        row.original.addOn
          ? `${row.original.addOn.currency} ${row.original.addOn.price}`
          : "-",
    },

    {
      Header: "Message",
      id: "message",
      Cell: ({ row }) => {
        const message = row.original.message;
        return (
          <span title={message}>
            {message
              ? message.length > 25
                ? message.substring(0, 25) + "..."
                : message
              : "-"}
          </span>
        );
      },
    },

    {
      Header: "Status",
      id: "status",
      Cell: ({ row }) => getStatusBadge(row.original.status),
    },

    {
      Header: "Actions",
      id: "actions",
      Cell: ({ row }) => {
        const req = row.original;
        const status = req.status;

        return (
          <div className="dropdown">
            <button className="btn btn-sm btn-light" data-bs-toggle="dropdown">
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>

            <ul className="dropdown-menu">
              {req.invoiceId && (
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() =>
                      navigate(`/admin/view-invoice/${req.invoiceId}`, {
                        state: { from: "/admin/credit-management" },
                      })
                    }
                  >
                    View Invoice
                  </button>
                </li>
              )}

              {status === "Pending" && (
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() =>
                      updateCompanyRequestStatus(req.id, "Contacted")
                    }
                  >
                    Contacted
                  </button>
                </li>
              )}

              {status === "Contacted" && !req.invoiceId && (
                <li>
                  {req.invoiceAction === "MANUAL" ? (
                    <button
                      className="dropdown-item"
                      onClick={() => openManualInvoiceModal(req)}
                    >
                      Create Invoice
                    </button>
                  ) : (
                    <button
                      className="dropdown-item"
                      onClick={() => generateInvoice(req.id)}
                    >
                      Generate Invoice
                    </button>
                  )}
                </li>
              )}

              {status === "Contacted" && (
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() =>
                      updateCompanyRequestStatus(req.id, "Invoice Sent")
                    }
                  >
                    Invoice Sent
                  </button>
                </li>
              )}

              {status === "Invoice Sent" && (
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() =>
                      updateCompanyRequestStatus(req.id, "Payment Received")
                    }
                  >
                    Payment Received
                  </button>
                </li>
              )}

              {status === "Payment Received" && (
                <li>
                  <button
                    className="dropdown-item text-success"
                    onClick={() =>
                      updateCompanyRequestStatus(req.id, "Completed")
                    }
                  >
                    Completed
                  </button>
                </li>
              )}

              {status !== "Completed" && status !== "Rejected" && (
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() =>
                      updateCompanyRequestStatus(req.id, "Rejected")
                    }
                  >
                    Rejected
                  </button>
                </li>
              )}
            </ul>
          </div>
        );
      },
    },
  ];
  // const columns = [
  //   {
  //     accessorKey: "id",
  //     header: "S.No",
  //     cell: ({ row }) => (page - 1) * limit + row.index + 1,
  //   },

  //   {
  //     accessorKey: "contactPerson",
  //     header: "Contact Person",
  //     cell: ({ row }) =>
  //       row.original.requestType === "MANUAL_CREDITS"
  //         ? row.original.company?.brandName || "-"
  //         : row.original.contactPersonName || "-",
  //   },

  //   {
  //     accessorKey: "email",
  //     header: "Email",
  //     cell: ({ row }) =>
  //       row.original.requestType === "MANUAL_CREDITS"
  //         ? row.original.company?.userId?.email || "-"
  //         : row.original.contactEmail || "-",
  //   },

  //   {
  //     accessorKey: "phone",
  //     header: "Phone",
  //     cell: ({ row }) =>
  //       row.original.company?.phone
  //         ? `+${row.original.company.phone.countryCode} ${row.original.company.phone.number}`
  //         : "-",
  //   },

  //   {
  //     accessorKey: "packName",
  //     header: "Type",
  //     cell: ({ row }) =>
  //       row.original.addOn ? `${row.original.addOn.name}` : "-",
  //   },
  //   {
  //     header: "Credits",
  //     cell: ({ row }) => {
  //       const jobCredits =
  //         row.original.pack?.jobPostingCredits ??
  //         row.original.jobCreditsRequested ??
  //         0;

  //       const profileCredits =
  //         row.original.pack?.profileViewingCredits ??
  //         row.original.profileCreditsRequested ??
  //         0;

  //       const jobValue = jobCredits === -1 ? "Unlimited" : jobCredits;
  //       const profileValue =
  //         profileCredits === -1 ? "Unlimited" : profileCredits;

  //       return (
  //         <Tooltip title="J = Job Credits | P = Profile Credits">
  //           <span style={{ cursor: "pointer" }}>
  //             {jobValue}J / {profileValue}P
  //           </span>
  //         </Tooltip>
  //       );
  //     },
  //   },

  //   {
  //     accessorKey: "amount",
  //     header: "Amount",
  //     cell: ({ row }) =>
  //       row.original.addOn
  //         ? `${row.original.addOn.currency} ${row.original.addOn.price}`
  //         : "-",
  //   },
  //   {
  //     accessorKey: "message",
  //     header: "Message",
  //     cell: ({ row }) => {
  //       const message = row.original.message;
  //       return (
  //         <span title={message}>
  //           {message
  //             ? message.length > 25
  //               ? message.substring(0, 25) + "..."
  //               : message
  //             : "-"}
  //         </span>
  //       );
  //     },
  //   },

  //   {
  //     accessorKey: "status",
  //     header: "Status",
  //     cell: ({ row }) => getStatusBadge(row.original.status),
  //   },

  //   {
  //     accessorKey: "actions",
  //     header: "Actions",
  //     cell: ({ row }) => {
  //       const req = row.original;
  //       const status = req.status;

  //       return (
  //         <div className="dropdown">
  //           <button className="btn btn-sm btn-light" data-bs-toggle="dropdown">
  //             <i className="fa-solid fa-ellipsis-vertical"></i>
  //           </button>

  //           <ul className="dropdown-menu">
  //             {/* ⭐ Always show View Invoice if invoice exists */}
  //             {req.invoiceId && (
  //               <li>
  //                 <button
  //                   className="dropdown-item"
  //                   onClick={() =>
  //                     navigate(`/admin/view-invoice/${req.invoiceId}`, {
  //                       state: { from: "/admin/credit-management" },
  //                     })
  //                   }
  //                 >
  //                   View Invoice
  //                 </button>
  //               </li>
  //             )}

  //             {/* Pending → Contacted */}
  //             {status === "Pending" && (
  //               <li>
  //                 <button
  //                   className="dropdown-item"
  //                   onClick={() =>
  //                     updateCompanyRequestStatus(req.id, "Contacted")
  //                   }
  //                 >
  //                   Contacted
  //                 </button>
  //               </li>
  //             )}

  //             {/* Contacted → Create or Generate Invoice */}
  //             {status === "Contacted" && !req.invoiceId && (
  //               <li>
  //                 {req.invoiceAction === "MANUAL" ? (
  //                   <button
  //                     className="dropdown-item"
  //                     onClick={() => openManualInvoiceModal(req)}
  //                   >
  //                     Create Invoice
  //                   </button>
  //                 ) : (
  //                   <button
  //                     className="dropdown-item"
  //                     onClick={() => generateInvoice(req.id)}
  //                   >
  //                     Generate Invoice
  //                   </button>
  //                 )}
  //               </li>
  //             )}

  //             {/* Contacted → Invoice Sent */}
  //             {status === "Contacted" && (
  //               <li>
  //                 <button
  //                   className="dropdown-item"
  //                   onClick={() =>
  //                     updateCompanyRequestStatus(req.id, "Invoice Sent")
  //                   }
  //                 >
  //                   Invoice Sent
  //                 </button>
  //               </li>
  //             )}

  //             {/* Invoice Sent → Payment Received */}
  //             {status === "Invoice Sent" && (
  //               <li>
  //                 <button
  //                   className="dropdown-item"
  //                   onClick={() =>
  //                     updateCompanyRequestStatus(req.id, "Payment Received")
  //                   }
  //                 >
  //                   Payment Received
  //                 </button>
  //               </li>
  //             )}

  //             {/* Payment Received → Completed */}
  //             {status === "Payment Received" && (
  //               <li>
  //                 <button
  //                   className="dropdown-item text-success"
  //                   onClick={() =>
  //                     updateCompanyRequestStatus(req.id, "Completed")
  //                   }
  //                 >
  //                   Completed
  //                 </button>
  //               </li>
  //             )}

  //             {/* Reject */}
  //             {status !== "Completed" && status !== "Rejected" && (
  //               <li>
  //                 <button
  //                   className="dropdown-item text-danger"
  //                   onClick={() =>
  //                     updateCompanyRequestStatus(req.id, "Rejected")
  //                   }
  //                 >
  //                   Rejected
  //                 </button>
  //               </li>
  //             )}
  //           </ul>
  //         </div>
  //       );
  //     },
  //   },
  // ];
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );

    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      if (!window.bootstrap.Tooltip.getInstance(tooltipTriggerEl)) {
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      }
    });
  }, [packRequests]);
  const updateCompanyRequestStatus = async (requestId, status) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}updateCompanyRequest/${requestId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        if (activeTab === "pack") {
          fetchPackRequests();
        } else if (activeTab === "manual") {
          fetchManualRequests();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  const generateInvoice = async (requestId) => {
    if (invoiceLoading) return;

    setInvoiceLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}generateInvoiceForRequest/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Invoice Generated");

        navigate(`/admin/view-invoice/${res.data.data._id}`, {
          state: { from: "/admin/credit-management" },
        });
      }
    } catch (err) {
      toast.error("Invoice generation failed");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="badge bg-warning text-dark">Pending</span>;

      case "Contacted":
        return <span className="badge bg-info">Contacted</span>;

      case "Invoice Sent":
        return <span className="badge bg-primary">Invoice Sent</span>;

      case "Payment Received":
        return <span className="badge bg-success">Payment Received</span>;

      case "Completed":
        return <span className="badge bg-success">Completed</span>;

      case "Rejected":
        return <span className="badge bg-danger">Rejected</span>;

      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };
  const handleManualInputChange = (e) => {
    const { name, value } = e.target;

    setManualInvoiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const submitManualInvoice = async () => {
    if (!manualInvoiceData.amount || manualInvoiceData.amount <= 0) {
      toast.error("Valid Amount is required");
      return;
    }

    try {
      const payload = {
        requestId: selectedRequest.id,
        amount: Number(manualInvoiceData.amount),
        jobCredits: Number(manualInvoiceData.jobCredits) || 0,
        profileCredits: Number(manualInvoiceData.profileCredits) || 0,
        currency: manualInvoiceData.currency || "INR",
      };

      const res = await axios.post(
        `${API_BASE_URL}createManualInvoice`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Manual Invoice Created ✅");

        const invoiceId = res?.data?.data?._id;

        setShowManualModal(false);

        navigate(`/admin/view-invoice/${invoiceId}`);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to create manual invoice",
      );
    }
  };
  const packAddonData = packRequests.filter(
    (item) => item.requestType === "PACK" || item.requestType === "ADDON",
  );

  const manualData = manualCreditRequests;
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <ToastContainer />

        <div className="super-dashboard-breadcrumb-info">
          <h4>Company Credit Requests</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Manage Company Credit Requests
          </h5>
        </div>

        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          <div className="card-body">
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "pack" ? "active" : ""}`}
                  onClick={() => setActiveTab("pack")}
                >
                  Add-on Inquiries
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "manual" ? "active" : ""}`}
                  onClick={() => setActiveTab("manual")}
                >
                  Custom Credit Requests
                </button>
              </li>
            </ul>

            {activeTab === "pack" &&
              (loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : packAddonData.length === 0 ? (
                <div className="text-center py-4">
                  <h6>No Addon Requests Found</h6>
                </div>
              ) : (
                <div className="credit-management-table">
                  <TableView
                    columns={columns}
                    data={packAddonData}
                    loading={loading}
                  />
                </div>
              ))}

            {activeTab === "manual" &&
              (loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : manualData.length === 0 ? (
                <div className="text-center py-4">
                  <h6>No Manual Credit Requests Found</h6>
                </div>
              ) : (
                <TableView
                  columns={columns}
                  data={manualData}
                  loading={loading}
                />
              ))}
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-sm btn-primary mx-1"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm mx-1 ${
                  page === i + 1 ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="btn btn-sm btn-primary mx-1"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>
      {showManualModal && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Manual Invoice</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowManualModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-2">
                    <label>Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      value={manualInvoiceData.amount}
                      onChange={handleManualInputChange}
                    />
                  </div>

                  <div className="mb-2">
                    <label>Job Credits</label>
                    <input
                      type="number"
                      className="form-control"
                      name="jobCredits"
                      value={manualInvoiceData.jobCredits}
                      onChange={handleManualInputChange}
                    />
                  </div>

                  <div className="mb-2">
                    <label>Profile Credits</label>
                    <input
                      type="number"
                      className="form-control"
                      name="profileCredits"
                      value={manualInvoiceData.profileCredits}
                      onChange={handleManualInputChange}
                    />
                  </div>

                  <div className="mb-2">
                    <label>Currency</label>
                    <input
                      type="text"
                      className="form-control"
                      name="currency"
                      value={manualInvoiceData.currency}
                      onChange={handleManualInputChange}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowManualModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={submitManualInvoice}
                  >
                    Create Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
}

export default AdminCreditManagement;
