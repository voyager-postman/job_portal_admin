import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import { TableView } from "../components/DataTable";

function PurchaseHistory() {
  const navigate = useNavigate();
  const location = useLocation();

  const stateCompanyId = location?.state?.companyActiveId;
  const companyProfileId =
    stateCompanyId || localStorage.getItem("companyProfileId");
  const [loading, setLoading] = useState(false);
  const [paymentsHistory, setPaymentsHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPurchaseHistory = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}getCompanyPurchaseHistory/${companyProfileId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const allPayments = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.section?.rows)
          ? res.data.section.rows
          : res.data?.data?.payments || [];

      // client side pagination
      const start = (page - 1) * limit;
      const end = start + limit;

      const paginatedPayments = allPayments.slice(start, end);

      setPaymentsHistory(paginatedPayments);
      setTotalPages(Math.ceil(allPayments.length / limit));
    } catch (error) {
      console.error("Purchase History Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyProfileId) {
      fetchPurchaseHistory();
    }
  }, [companyProfileId, page, limit]);
  useEffect(() => {
    if (stateCompanyId) {
      localStorage.setItem("companyProfileId", stateCompanyId);
    }
  }, [stateCompanyId]);
  // const columns = [
  //   {
  //     accessorKey: "id",
  //     header: "#",
  //     cell: ({ row }) => (page - 1) * limit + row.index + 1,
  //   },
  //   {
  //     accessorKey: "planName",
  //     header: "Plan",
  //     cell: ({ row }) => row.original.planName,
  //   },
  //   {
  //     accessorKey: "amount",
  //     header: "Amount",
  //     cell: ({ row }) => `${row.original.currency} ${row.original.amount}`,
  //   },
  //   {
  //     accessorKey: "paymentMethod",
  //     header: "Payment Method",
  //     cell: ({ row }) => row.original.paymentMethod,
  //   },
  //   {
  //     accessorKey: "status",
  //     header: "Status",
  //     cell: ({ row }) => row.original.status,
  //   },
  //   {
  //     accessorKey: "date",
  //     header: "Date",
  //     cell: ({ row }) =>
  //       new Date(row.original.paymentDate).toLocaleDateString("en-GB"),
  //   },
  //   {
  //     accessorKey: "invoice",
  //     header: "Invoice",
  //     cell: ({ row }) => {
  //       const invoiceId = row.original.invoice?._id;

  //       return invoiceId ? (
  //         <span
  //           style={{ cursor: "pointer", color: "#0d6efd" }}
  //           onClick={() =>
  //             navigate(`/admin/view-invoice/${invoiceId}`, {
  //               state: { from: "/admin/company-purchase-history" },
  //             })
  //           }
  //         >
  //           <i className="fa-solid fa-eye"></i>
  //         </span>
  //       ) : (
  //         <span className="text-muted">N/A</span>
  //       );
  //     },
  //   },
  // ];
  const columns = [
    {
      Header: "#",
      id: "sno", // computed column needs an ID
      Cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      Header: "Plan",
      id: "planName",
      accessor: (row) => row.planName || "",
      Cell: ({ row }) => row.original.planName || "N/A",
    },
    {
      Header: "Type",
      id: "type",
      accessor: (row) => row.type || "",
      Cell: ({ row }) => row.original.type || "N/A",
    },
    {
      Header: "Jobs",
      id: "jobs",
      accessor: (row) => row.jobs ?? "",
      Cell: ({ row }) => row.original.jobs ?? "N/A",
    },
    {
      Header: "CV Views",
      id: "cvViews",
      accessor: (row) => row.cvViews ?? "",
      Cell: ({ row }) => row.original.cvViews ?? "N/A",
    },
    {
      Header: "Daily Jobs",
      id: "dailyJobs",
      accessor: (row) => row.dailyJobs ?? "",
      Cell: ({ row }) => row.original.dailyJobs ?? "N/A",
    },
    {
      Header: "Daily CV",
      id: "dailyCv",
      accessor: (row) => row.dailyCv ?? "",
      Cell: ({ row }) => row.original.dailyCv ?? "N/A",
    },
    {
      Header: "Date",
      id: "date",
      accessor: (row) => row.date || "",
      Cell: ({ row }) => row.original.date || "N/A",
    },
    {
      Header: "Invoice",
      id: "invoice",
      accessor: (row) =>
        [
          row.invoice?.invoiceNumber,
          row.invoice?.itemName,
          row.invoice?.status,
          row.invoice?.paymentMethod,
          row.invoice?.currency,
          row.packStatus,
          row.paymentTransactionId,
        ]
          .filter(Boolean)
          .join(" "),
      Cell: ({ row }) => {
        const invoiceId = row.original.invoice?._id;

        return invoiceId ? (
          <span
            style={{ cursor: "pointer", color: "#0d6efd" }}
            onClick={() =>
              navigate(`/admin/view-invoice/${invoiceId}`, {
                state: { from: "/admin/company-purchase-history" },
              })
            }
          >
            <i className="fa-solid fa-eye"></i>
          </span>
        ) : (
          <span className="text-muted">N/A</span>
        );
      },
    },
  ];
  return (
    <section className="super-dashboard-content-wrapper">
      <div className="super-dashboard-breadcrumb-info">
        <h4>Purchase History</h4>
      </div>

      <div className="super-dashboard-common-heading">
        <h5>
          <Link
            to="/admin/complete-company-details"
            state={{
              companyProfileId: companyProfileId,
              companyActiveId: companyProfileId,
              companyDataId: companyProfileId,
            }}
          >
            <i className="fa-solid fa-angles-left" />
          </Link>
          Company Purchase History
        </h5>
      </div>

      <div className="super-admin-manage-candidate-list super-admin-white-bg">
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : paymentsHistory.length === 0 ? (
          <div className="simple-list-empty-state">
            <i className="fa-solid fa-receipt" />
            <h6>No purchase history found</h6>
          </div>
        ) : (
          <>
            <TableView
              columns={columns}
              data={paymentsHistory}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              limit={limit}
              setLimit={(val) => {
                setLimit(val);
                setPage(1);
              }}
            />

            {/* Pagination */}
         
          </>
        )}
      </div>
    </section>
  );
}

export default PurchaseHistory;
