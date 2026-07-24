import { Link, useNavigate, useLocation } from "react-router-dom";
import { TableView } from "../components/DataTable";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../Url/Url";

function InvoiceManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const stateCompanyId = location?.state?.companyActiveId;
  const companyProfileId =
    stateCompanyId || localStorage.getItem("companyProfileId");
  const [invoices, setInvoices] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]); // store full data

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // show 10 records
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = {};
      if (companyProfileId) params.companyId = companyProfileId;

      const res = await axios.get(`${API_BASE_URL}getInvoices`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const data = res.data?.data || [];
      setAllInvoices(data); // store all invoices

      const start = (page - 1) * limit;
      const end = start + limit;
      setInvoices(data.slice(start, end)); // only current page
      setTotalPages(Math.ceil(data.length / limit));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (companyProfileId) {
      fetchInvoices();
    }
  }, [companyProfileId, page, limit]);

  // Export Excel
  const exportInvoices = () => {
    const exportData = allInvoices.map((item, index) => ({
      S_No: index + 1,
      Invoice_Number: item.invoiceNumber,
      Company: item.companyId?.brandName,
      Item: item.itemName,
      Amount: `${item.currency} ${item.amount}`,
      Payment_Method: item.paymentMethod,
      Status: item.status,
      Date: new Date(item.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    XLSX.writeFile(workbook, "invoice_list.xlsx");
  };
  useEffect(() => {
    if (stateCompanyId) {
      localStorage.setItem("companyProfileId", stateCompanyId);
    }
  }, [stateCompanyId]);
  // const columns = [
  //   {
  //     accessorKey: "id",
  //     header: "S.No",
  //     cell: ({ row }) => (page - 1) * limit + row.index + 1,
  //   },

  //   {
  //     accessorKey: "invoiceNumber",
  //     header: "Invoice Number",
  //     cell: ({ row }) => row.original.invoiceNumber,
  //   },

  //   {
  //     accessorKey: "company",
  //     header: "Company",
  //     cell: ({ row }) => row.original.companyId?.brandName,
  //   },

  //   {
  //     accessorKey: "item",
  //     header: "Item",
  //     cell: ({ row }) => row.original.itemName || "-",
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
  //     accessorKey: "date",
  //     header: "Date",
  //     cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  //   },

  //   {
  //     accessorKey: "status",
  //     header: "Status",
  //     cell: ({ row }) => {
  //       const status = row.original.status;

  //       return (
  //         <span
  //           className={`badge ${
  //             status === "Validated" ? "bg-success" : "bg-warning"
  //           }`}
  //         >
  //           {status}
  //         </span>
  //       );
  //     },
  //   },

  //   {
  //     accessorKey: "action",
  //     header: "Action",
  //     cell: ({ row }) => {
  //       const id = row.original._id;

  //       return (
  //         <div className="super-admin-action-icons">
  //           <Link
  //             to={`/admin/view-invoice/${id}`}
  //             state={{ from: "/admin/all-invoice-list" }}
  //           >
  //             <i className="fa-solid fa-eye"></i>
  //           </Link>
  //           {/* <Link to={`/admin/edit-invoice/${id}`}>
  //             <i className="fa-solid fa-pen text-warning ms-2"></i>
  //           </Link> */}
  //         </div>
  //       );
  //     },
  //   },
  // ];
  const columns = [
    {
      Header: "S.No",
      id: "sno", // computed column requires an id
      Cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      Header: "Invoice Number",
      id: "invoiceNumber",
      accessor: (row) => row.invoiceNumber || "",
      Cell: ({ row }) => row.original.invoiceNumber || "-",
    },
    {
      Header: "Company",
      id: "company",
      accessor: (row) => row.companyId?.brandName || "",
      Cell: ({ row }) => row.original.companyId?.brandName || "-",
    },
    {
      Header: "Item",
      id: "item",
      accessor: (row) => row.itemName || "",
      Cell: ({ row }) => row.original.itemName || "-",
    },
    {
      Header: "Amount",
      id: "amount",
      accessor: (row) =>
        row.amount != null ? `${row.currency || ""} ${row.amount}` : "",
      Cell: ({ row }) =>
        row.original.amount != null
          ? `${row.original.currency || ""} ${row.original.amount}`
          : "-",
    },
    {
      Header: "Payment Method",
      id: "paymentMethod",
      accessor: (row) => row.paymentMethod || "",
      Cell: ({ row }) => row.original.paymentMethod || "-",
    },
    {
      Header: "Date",
      id: "date",
      accessor: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "",
      Cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "-",
    },
    {
      Header: "Status",
      id: "status",
      accessor: (row) => row.status || "",
      Cell: ({ row }) => {
        const status = row.original.status || "-";
        return (
          <span
            className={`badge ${
              status === "Validated" ? "bg-success" : "bg-warning"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      Header: "Action",
      id: "action", // computed column needs id
      Cell: ({ row }) => {
        const id = row.original._id;
        return (
          <div className="super-admin-action-icons">
            <Link
              to={`/admin/view-invoice/${id}`}
              state={{ from: "/admin/all-invoice-list" }}
            >
              <i className="fa-solid fa-eye"></i>
            </Link>
            {/* Uncomment if you need edit */}
            {/* <Link to={`/admin/edit-invoice/${id}`}>
              <i className="fa-solid fa-pen text-warning ms-2"></i>
            </Link> */}
          </div>
        );
      },
    },
  ];
  return (
    <section className="super-dashboard-content-wrapper">
      <ToastContainer />

      <div className="super-dashboard-breadcrumb-info">
        <h4>Invoice List</h4>
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
          Invoice Management
        </h5>
      </div>

      <div className="super-admin-manage-candidate-list super-admin-white-bg">
        <div className="d-flex justify-content-end mb-3">
          <button
            className="super-dashboard-common-add-btn"
            onClick={exportInvoices}
          >
            Export Data
          </button>
        </div>

        <div className="table-responsive">
          <div className="table-responsive">
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : invoices.length === 0 ? (
              <div className="simple-list-empty-state">
                <i className="fa-solid fa-file-invoice" />
                <h6>No invoice data found</h6>
              </div>
            ) : (
              <>
                <TableView
                  columns={columns}
                  data={invoices}
                  page={page}
                  totalPages={totalPages}
                  setPage={setPage}
                  limit={limit}
                  setLimit={(val) => {
                    setLimit(val);
                    setPage(1);
                  }}
                />

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
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InvoiceManagement;
