import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { TableView } from "../components/DataTable";
import { useDebounce } from "../hooks/useDebounce";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Tooltip } from "antd";

const ACTIVATION_STATUSES = ["Pending", "Active", "Rejected", "Expired"];
const REQUEST_STATUSES = [
  "Pending",
  "Contacted",
  "Invoice Sent",
  "Payment Received",
  "Completed",
  "Rejected",
];

const PlanSubscriberList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [subscribers, setSubscribers] = useState([]);
  const [creditAmount, setCreditAmount] = useState("");
  const [activeTab, setActiveTab] = useState("subscribers");
  const [expiryDate, setExpiryDate] = useState("");
  const [pendingPacks, setPendingPacks] = useState([]);
  const [showManualModal, setShowManualModal] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const [pendingLoading, setPendingLoading] = useState(true);
  const [jobsPerDay, setJobsPerDay] = useState("");
  const [packInquiries, setPackInquiries] = useState([]);
  const [inquiryLoading, setInquiryLoading] = useState(true);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [profilesPerDay, setProfilesPerDay] = useState("");
  const [loading, setLoading] = useState(true);
  const [manualInvoiceData, setManualInvoiceData] = useState({
    amount: "",
    jobCredits: "",
    profileCredits: "",
    currency: "",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingLimit, setPendingLimit] = useState(10);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [inquiryPage, setInquiryPage] = useState(1);
  const [inquiryLimit, setInquiryLimit] = useState(10);
  const [inquiryTotalPages, setInquiryTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [statusFilter, setStatusFilter] = useState("");
  const getImageUrl = (url) => {
    if (!url || url === "undefined") {
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
    if (url.startsWith("http")) return url;
    return `${API_IMAGE_URL}${url}`;
  };

  const getActivationStatusBadge = (status, isActive) => {
    const displayStatus =
      status || (isActive === false ? "Expired" : isActive ? "Active" : "-");
    switch (displayStatus) {
      case "Pending":
        return <span className="badge bg-warning text-dark">Pending</span>;
      case "Active":
        return <span className="badge bg-success">Active</span>;
      case "Rejected":
        return <span className="badge bg-danger">Rejected</span>;
      case "Expired":
        return <span className="badge bg-secondary">Expired</span>;
      default:
        return <span className="badge bg-secondary">{displayStatus}</span>;
    }
  };

  /* ================= TABLE COLUMNS ================= */

  const columns = [
    {
      Header: "S.No",
      id: "serial",
      Cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      Header: "Recruiter Name",
      accessor: "recruiterName",
    },
    {
      Header: "Email ID",
      accessor: "email",
    },
    {
      Header: "Contact Number",
      accessor: "phone",
      Cell: ({ row }) =>
        `${row.original.phone?.countryCode || ""} ${row.original.phone?.number || ""}`,
    },
    {
      Header: "Plan Name",
      accessor: "planName",
    },
    {
      Header: "Purchase Date",
      accessor: "purchaseDate",
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      Header: "Price",
      accessor: "price",
      Cell: ({ row }) => `${row.original.currency} ${row.original.price}`,
    },
    {
      Header: "Validity",
      accessor: "validity",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) =>
        getActivationStatusBadge(
          row.original.status,
          row.original.isActive,
        ),
    },
  ];
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

        if (activeTab === "inquiry") {
          fetchPackInquiries();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update status");
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

        navigate(`/admin/view-invoice/${invoiceId}`, {
          state: {
            from: "/admin/super-admin-plan-subscriber-list",
            activeTab,
          },
        });
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to create manual invoice",
      );
    }
  };
  const fetchPendingPacks = useCallback(async () => {
    try {
      const params = {
        page: pendingPage,
        limit: pendingLimit,
      };
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      const status = statusFilter || "Pending";
      if (status !== "all") params.status = status;

      const res = await axios.get(`${API_BASE_URL}getPendingPacks`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setPendingPacks(res.data.data || []);
        setPendingTotalPages(res.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pending packs");
    } finally {
      setPendingLoading(false);
    }
  }, [pendingPage, pendingLimit, debouncedSearch, statusFilter]);

  const fetchSubscribers = useCallback(async () => {
    try {
      const params = { page, limit };
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;

      const res = await axios.get(`${API_BASE_URL}getPlanSubscribers`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSubscribers(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load plan subscribers");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter]);

  const fetchPackInquiries = useCallback(async () => {
    try {
      const params = {
        page: inquiryPage,
        limit: inquiryLimit,
      };
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;

      const res = await axios.get(`${API_BASE_URL}Pack/requests`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setPackInquiries(res.data.packRequests || []);
        setInquiryTotalPages(
          res.data.totalPages || res.data.pagination?.totalPages || 1,
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pack inquiries");
    } finally {
      setInquiryLoading(false);
    }
  }, [inquiryPage, inquiryLimit, debouncedSearch, statusFilter]);

  const updateCredits = async (type) => {
    if (!creditAmount || creditAmount <= 0) {
      toast.error("Please enter valid credit amount");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/admin/updateCredits/${selectedSubscriber._id}`,
        {
          type, // "add" or "remove"
          amount: Number(creditAmount),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success(
        `Credits ${type === "add" ? "added" : "removed"} successfully`,
      );

      setCreditAmount("");
      closeModal();
      fetchSubscribers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update credits");
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    setPage(1);
    setPendingPage(1);
    setInquiryPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.key]);

  useEffect(() => {
    if (activeTab === "subscribers") {
      fetchSubscribers();
    } else if (activeTab === "pending") {
      fetchPendingPacks();
    } else if (activeTab === "inquiry") {
      fetchPackInquiries();
    }
  }, [
    activeTab,
    fetchSubscribers,
    fetchPendingPacks,
    fetchPackInquiries,
  ]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStatusFilter("");
    setSearchQuery("");
    setPage(1);
    setPendingPage(1);
    setInquiryPage(1);
  };

  const statusOptions =
    activeTab === "inquiry"
      ? REQUEST_STATUSES
      : ACTIVATION_STATUSES;

  const updatePackStatus = async (companyPackId, status) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}approveCompanyPack`,
        {
          companyPackId,
          status, // "Approved" | "Rejected"
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message || `Pack ${status} successfully`);

        fetchPendingPacks();
        fetchSubscribers();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update pack");
    }
  };

  const inquiryColumns = [
    {
      Header: "#",
      id: "serial",
      Cell: ({ row }) => (inquiryPage - 1) * inquiryLimit + row.index + 1,
    },

    // ✅ Company (Merged)
    {
      Header: "Company",
      id: "company",
      Cell: ({ row }) => {
        const c = row.original.company;
        return (
          <div>
            <strong>{c?.brandName || "-"}</strong>
            <br />
            <small>{c?.userId?.email || "-"}</small>
          </div>
        );
      },
    },

    // ✅ Contact (ONLY ONCE)
    {
      Header: "Contact",
      id: "contact",
      Cell: ({ row }) => {
        const name = row.original.contactPersonName;
        const email = row.original.contactEmail;

        const validName =
          name &&
          name !== "null undefined" &&
          name !== "null" &&
          name !== "undefined";

        return (
          <div>
            {validName && <strong>{name}</strong>}
            {validName && email && <br />}
            {email && <small>{email}</small>}
          </div>
        );
      },
    },

    // ✅ Pack
    {
      Header: "Pack",
      id: "pack",
      Cell: ({ row }) => row.original.pack?.packName || "-",
    },

    // ✅ Credits (Short)
    {
      Header: "Credits",
      id: "credits",
      Cell: ({ row }) => {
        const jobCredits = row.original.jobCreditsRequested ?? 0;
        const profileCredits = row.original.profileCreditsRequested ?? 0;

        const jobDisplay = jobCredits === -1 ? "∞" : jobCredits;
        const profileDisplay = profileCredits === -1 ? "∞" : profileCredits;

        return (
          <Tooltip
            title={`Job Credits: ${jobCredits === -1 ? "Unlimited" : jobCredits} | Profile Credits: ${profileCredits === -1 ? "Unlimited" : profileCredits}`}
          >
            <span style={{ cursor: "pointer" }}>
              {jobDisplay}J / {profileDisplay}P
            </span>
          </Tooltip>
        );
      },
    },
    // ✅ Message (Short + Tooltip)
    {
      Header: "Message",
      id: "message",
      Cell: ({ row }) => {
        const msg = row.original.message || "-";
        return (
          <span title={msg}>
            {msg.length > 25 ? msg.slice(0, 25) + "..." : msg}
          </span>
        );
      },
    },

    // ✅ Status
    {
      Header: "Status",
      id: "status",
      Cell: ({ row }) => getStatusBadge(row.original.status),
    },

    // ✅ Date
    {
      Header: "Date",
      id: "date",
      Cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },

    // ✅ Actions
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
                        state: {
                          from: "/admin/super-admin-plan-subscriber-list",
                          activeTab,
                        },
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
  // const inquiryColumns = [
  //   { header: "#", cell: ({ row }) => row.index + 1 },

  //   // ✅ Company (Merged)
  //   {
  //     header: "Company",
  //     cell: ({ row }) => {
  //       const c = row.original.company;
  //       return (
  //         <div>
  //           <strong>{c?.brandName || "-"}</strong>
  //           <br />
  //           <small>{c?.userId?.email || "-"}</small>
  //         </div>
  //       );
  //     },
  //   },

  //   // ✅ Contact (ONLY ONCE)
  //   {
  //     header: "Contact",
  //     cell: ({ row }) => (
  //       <div>
  //         <strong>{row.original.contactPersonName || "-"}</strong>
  //         <br />
  //         <small>{row.original.contactEmail || "-"}</small>
  //       </div>
  //     ),
  //   },

  //   // ✅ Pack
  //   {
  //     header: "Pack",
  //     cell: ({ row }) => row.original.pack?.packName || "-",
  //   },

  //   // ✅ Credits (Short)
  //   {
  //     header: "Credits",
  //     cell: ({ row }) => {
  //       const jobCredits = row.original.jobCreditsRequested ?? 0;
  //       const profileCredits = row.original.profileCreditsRequested ?? 0;

  //       return (
  //         <Tooltip
  //           title={`Job Credits: ${jobCredits} | Profile Credits: ${profileCredits}`}
  //         >
  //           <span style={{ cursor: "pointer" }}>
  //             {jobCredits}J / {profileCredits}P
  //           </span>
  //         </Tooltip>
  //       );
  //     },
  //   },

  //   // ✅ Message (Short + Tooltip)
  //   {
  //     header: "Message",
  //     cell: ({ row }) => {
  //       const msg = row.original.message || "-";
  //       return (
  //         <span title={msg}>
  //           {msg.length > 25 ? msg.slice(0, 25) + "..." : msg}
  //         </span>
  //       );
  //     },
  //   },

  //   // ✅ Status
  //   {
  //     header: "Status",
  //     cell: ({ row }) => getStatusBadge(row.original.status),
  //   },

  //   // ✅ Date
  //   {
  //     header: "Date",
  //     cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
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
  //                       state: {
  //                         from: "/admin/super-admin-plan-subscriber-list",
  //                       },
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
  const openManualInvoiceModal = (req) => {
    console.log(req);
    setSelectedRequest(req);
    setShowManualModal(true);
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
          state: {
            from: "/admin/super-admin-plan-subscriber-list",
            activeTab,
          },
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
  const pendingColumns = [
    {
      Header: "S.No",
      id: "serial",
      Cell: ({ row }) => (pendingPage - 1) * pendingLimit + row.index + 1,
    },

    {
      Header: "Company Name",
      accessor: "companyName",
      Cell: ({ row }) => row.original.companyId?.brandName || "-",
    },

    {
      Header: "Email",
      accessor: "email",
      Cell: ({ row }) => row.original.companyId?.userId?.email || "-",
    },

    {
      Header: "Pack Name",
      accessor: "packName",
      Cell: ({ row }) => row.original.packId?.packName || "-",
    },

    {
      Header: "Credits",
      id: "credits",
      Cell: ({ row }) => {
        const jobCredits = row.original.packId?.jobPostingCredits ?? 0;
        const profileCredits = row.original.packId?.profileViewingCredits ?? 0;

        const jobValue = jobCredits === -1 ? "Unlimited" : jobCredits;
        const profileValue =
          profileCredits === -1 ? "Unlimited" : profileCredits;

        return (
          <Tooltip
            title={
              <>
                Job Credits: {jobValue}
                <br />
                Profile Credits: {profileValue}
              </>
            }
          >
            <span style={{ cursor: "pointer" }}>
              {jobValue} / {profileValue}
            </span>
          </Tooltip>
        );
      },
    },

    {
      Header: "Amount",
      accessor: "amount",
      Cell: ({ row }) =>
        `${row.original.packId?.currency || ""} ${row.original.packId?.amount || 0}`,
    },

    {
      Header: "Requested Date",
      accessor: "createdAt",
      Cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },

    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) =>
        getActivationStatusBadge(
          row.original.activationStatus || row.original.status,
          row.original.isActive,
        ),
    },

    {
      Header: "Actions",
      id: "actions",
      Cell: ({ row }) => {
        const navigate = useNavigate();
        const req = row.original;

        return (
          <div className="dropdown">
            <button className="btn btn-sm btn-light" data-bs-toggle="dropdown">
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>

            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item text-success"
                  onClick={() => updatePackStatus(req._id, "Approved")}
                >
                  Approve Pack
                </button>
              </li>

              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => updatePackStatus(req._id, "Rejected")}
                >
                  Reject Pack
                </button>
              </li>

              {req.purchaseHistory?.[0]?.paymentTransactionId?._id && (
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() =>
                      navigate(
                        `/admin/view-payment/${req.purchaseHistory[0].paymentTransactionId._id}`,
                      )
                    }
                  >
                    View Payment
                  </button>
                </li>
              )}
            </ul>
          </div>
        );
      },
    },
  ];
  // const pendingColumns = [
  //   { header: "S.No", cell: ({ row }) => row.index + 1 },

  //   {
  //     header: "Company Name",
  //     cell: ({ row }) => row.original.companyId?.brandName || "-",
  //   },

  //   {
  //     header: "Email",
  //     cell: ({ row }) => row.original.companyId?.userId?.email || "-",
  //   },

  //   {
  //     header: "Pack Name",
  //     cell: ({ row }) => row.original.packId?.packName || "-",
  //   },

  //   {
  //     header: "Credits",
  //     cell: ({ row }) => {
  //       const jobCredits = row.original.packId?.jobPostingCredits ?? 0;
  //       const profileCredits = row.original.packId?.profileViewingCredits ?? 0;

  //       const jobValue = jobCredits === -1 ? "Unlimited" : jobCredits;
  //       const profileValue =
  //         profileCredits === -1 ? "Unlimited" : profileCredits;

  //       return (
  //         <Tooltip
  //           title={
  //             <>
  //               Job Credits: {jobValue}
  //               <br />
  //               Profile Credits: {profileValue}
  //             </>
  //           }
  //         >
  //           <span style={{ cursor: "pointer" }}>
  //             {jobValue} / {profileValue}
  //           </span>
  //         </Tooltip>
  //       );
  //     },
  //   },

  //   {
  //     header: "Amount",
  //     cell: ({ row }) =>
  //       `${row.original.packId?.currency || ""} ${row.original.packId?.amount || 0}`,
  //   },

  //   {
  //     header: "Requested Date",
  //     cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  //   },

  //   {
  //     header: "Status",
  //     cell: ({ row }) =>
  //       getStatusBadge(row.original.activationStatus || "Pending"),
  //   },

  //   {
  //     header: "Actions",
  //     cell: ({ row }) => (
  //       <div className="dropdown">
  //         <button className="btn btn-sm btn-light" data-bs-toggle="dropdown">
  //           <i className="fa-solid fa-ellipsis-vertical"></i>
  //         </button>

  //         <ul className="dropdown-menu">
  //           <li>
  //             <button
  //               className="dropdown-item text-success"
  //               onClick={() => updatePackStatus(row.original._id, "Approved")}
  //             >
  //               Approve Pack
  //             </button>
  //           </li>

  //           <li>
  //             <button
  //               className="dropdown-item text-danger"
  //               onClick={() => updatePackStatus(row.original._id, "Rejected")}
  //             >
  //               Reject Pack
  //             </button>
  //           </li>

  //           {row.original.purchaseHistory?.[0]?.paymentTransactionId?._id && (
  //             <li>
  //               <button
  //                 className="dropdown-item"
  //                 onClick={() =>
  //                   navigate(
  //                     `/admin/view-payment/${row.original.purchaseHistory[0].paymentTransactionId._id}`,
  //                   )
  //                 }
  //               >
  //                 View Payment
  //               </button>
  //             </li>
  //           )}
  //         </ul>
  //       </div>
  //     ),
  //   },
  // ];
  const openManageModal = (subscriber) => {
    setSelectedSubscriber(subscriber);

    // If expiryDate not returned from API → use null
    setExpiryDate(
      subscriber.expiryDate
        ? new Date(subscriber.expiryDate).toISOString().split("T")[0]
        : "",
    );

    // If dailyQuota not returned → use default values
    setJobsPerDay(
      subscriber.dailyQuota?.jobsPerDay !== undefined
        ? subscriber.dailyQuota.jobsPerDay
        : 2,
    );

    setProfilesPerDay(
      subscriber.dailyQuota?.profilesPerDay !== undefined
        ? subscriber.dailyQuota.profilesPerDay
        : 20,
    );
  };

  const closeModal = () => {
    setSelectedSubscriber(null);
    setCreditAmount("");
  };
  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.post(
        `${API_BASE_URL}/toggleSubscriberStatus/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success(
        `Subscriber ${currentStatus ? "deactivated" : "activated"} successfully`,
      );
      fetchSubscribers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update subscriber status");
    }
  };

  /* ================= DELETE ================= */
  const deleteSubscriber = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This subscriber will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            `${API_BASE_URL}/deleteSubscriber/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );

          toast.success("Subscriber deleted successfully");
          fetchSubscribers();
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete subscriber");
        }
      }
    });
  };
  const updateSubscription = async () => {
    if (!selectedSubscriber) return;

    try {
      await axios.post(
        `${API_BASE_URL}/admin/updateSubscription/${selectedSubscriber._id}`,
        {
          expiryDate: expiryDate || null,
          dailyQuota: {
            jobsPerDay: Number(jobsPerDay) || 2,
            profilesPerDay: Number(profilesPerDay) || 20,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success("Subscription updated successfully");
      closeModal();
      fetchSubscribers();
    } catch (error) {
      toast.error("Failed to update subscription");
    }
  };

  const filterToolbar = (
    <div className="d-flex gap-2 align-items-center flex-wrap w-100 justify-content-end">
      <input
        type="search"
        placeholder={
          activeTab === "inquiry"
            ? "Search by company, email, pack..."
            : "Search by name, email, company..."
        }
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
          setPendingPage(1);
          setInquiryPage(1);
        }}
      >
        <option value="">
          {activeTab === "pending" ? "Pending (default)" : "All Status"}
        </option>
        <option value="all">All</option>
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <ToastContainer />

        <div className="super-dashboard-breadcrumb-info">
          <h4>Subscriptions</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Manage Subscriptions
          </h5>
        </div>
        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          <div className="mb-3">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "subscribers" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("subscribers")}
                >
                  All Subscriptions
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "pending" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("pending")}
                >
                  Approval Requests
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "inquiry" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("inquiry")}
                >
                  Pack Inquiries
                </button>
              </li>
            </ul>
          </div>

          {activeTab === "subscribers" && (
            <div className="table-responsive">
              <TableView
                columns={columns}
                data={subscribers}
                hideSearch
                hidePagination
                toolbarExtra={filterToolbar}
                limit={limit}
                setLimit={(value) => {
                  setLimit(value);
                  setPage(1);
                }}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />

              {loading && subscribers.length === 0 && (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary" />
                </div>
              )}

              {!loading && subscribers.length === 0 && (
                <div className="text-center py-4">
                  <h6>No plan subscribers found</h6>
                </div>
              )}

              {subscribers.length > 0 && (
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-sm btn-primary mx-1"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm mx-1 ${
                        page === index + 1
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setPage(index + 1)}
                    >
                      {index + 1}
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
              )}
            </div>
          )}
          {activeTab === "pending" && (
            <div className="table-responsive">
              <TableView
                columns={pendingColumns}
                data={pendingPacks}
                hideSearch
                toolbarExtra={filterToolbar}
                limit={pendingLimit}
                setLimit={(value) => {
                  setPendingLimit(value);
                  setPendingPage(1);
                }}
                page={pendingPage}
                setPage={setPendingPage}
                totalPages={pendingTotalPages}
              />

              {pendingLoading && pendingPacks.length === 0 && (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary" />
                </div>
              )}

              {!pendingLoading && pendingPacks.length === 0 && (
                <div className="text-center py-4">
                  <h6>No pending pack requests found</h6>
                </div>
              )}
            </div>
          )}
          {activeTab === "inquiry" && (
            <div className="table-responsive">
              <TableView
                columns={inquiryColumns}
                data={packInquiries}
                hideSearch
                toolbarExtra={filterToolbar}
                limit={inquiryLimit}
                setLimit={(value) => {
                  setInquiryLimit(value);
                  setInquiryPage(1);
                }}
                page={inquiryPage}
                setPage={setInquiryPage}
                totalPages={inquiryTotalPages}
              />

              {inquiryLoading && packInquiries.length === 0 && (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary" />
                </div>
              )}

              {!inquiryLoading && packInquiries.length === 0 && (
                <div className="text-center py-4">
                  <h6>No pack inquiries found</h6>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      {selectedSubscriber && (
        <>
          {/* Overlay */}
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content shadow-lg border-0">
                {/* Header */}
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    Manage Subscription – {selectedSubscriber.recruiterName}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={closeModal}
                  />
                </div>

                <div className="modal-body">
                  {/* ================= COMPANY INFO ================= */}
                  <div className="mb-4 p-3 bg-light rounded">
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Email:</strong> {selectedSubscriber.email}
                        </p>
                        <p>
                          <strong>Plan:</strong> {selectedSubscriber.planName}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Current Credits:</strong>{" "}
                          {selectedSubscriber?.credits ?? 0}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {selectedSubscriber.status ||
                            (selectedSubscriber.isActive
                              ? "Active"
                              : "Inactive")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ================= CREDIT SECTION ================= */}
                  <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="mb-3 text-primary">Manage Credits</h6>
                      <div className="row align-items-end">
                        <div className="col-md-6">
                          <label className="form-label">
                            Job Posting Credits
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={creditAmount}
                            onChange={(e) => setCreditAmount(e.target.value)}
                            placeholder="Enter Job Posting Credits"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Profile Viewing Credits
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={creditAmount}
                            onChange={(e) => setCreditAmount(e.target.value)}
                            placeholder="Enter Profile Viewing Credits"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ================= EXPIRY SECTION ================= */}
                  <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="mb-3 text-primary">Manage Expiry</h6>
                      <div className="row align-items-end">
                        <div className="col-md-8">
                          <label className="form-label">Expiry Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                          />
                        </div>
                        <div className="col-md-4 mt-3 mt-md-0">
                          <button
                            className="btn btn-outline-danger w-100"
                            onClick={() => setExpiryDate("")}
                          >
                            Cancel Expiry
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ================= DAILY QUOTA ================= */}
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="mb-3 text-primary">
                        Daily Quota Settings
                      </h6>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">Jobs Per Day</label>
                          <input
                            type="number"
                            className="form-control"
                            value={jobsPerDay || 2}
                            onChange={(e) => setJobsPerDay(e.target.value)}
                          />
                          <small className="text-muted">
                            Default: 2 jobs per day
                          </small>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Profiles Per Day</label>
                          <input
                            type="number"
                            className="form-control"
                            value={profilesPerDay || 20}
                            onChange={(e) => setProfilesPerDay(e.target.value)}
                          />
                          <small className="text-muted">
                            Default: 20 profiles per day
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={updateSubscription}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
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
};

export default PlanSubscriberList;
