import { Link, useNavigate, useLocation } from "react-router-dom";
import { TableView } from "../components/DataTable";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../Url/Url";

function AllInvoiceList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [allInvoices, setAllInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const companyProfileId = location?.state?.companyActiveId;

  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}getInvoices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data?.data || [];
      setAllInvoices(data);
    } catch (error) {
      console.error("Invoice API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

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

  const columns = [
    {
      Header: "S.No",
      id: "index",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Invoice Number",
      accessor: "invoiceNumber",
    },
    {
      Header: "Company",
      accessor: (row) => row.companyId?.brandName || "-",
    },
    {
      Header: "Item",
      accessor: (row) => row.itemName || "-",
    },
    {
      Header: "Amount",
      accessor: (row) => `${row.currency} ${row.amount}`,
    },
    {
      Header: "Payment Method",
      accessor: "paymentMethod",
    },
    {
      Header: "Date",
      accessor: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => (
        <span
          className={`badge ${
            value === "Validated" ? "bg-success" : "bg-warning"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      Header: "Action",
      id: "action",
      disableFilters: true,
      Cell: ({ row }) => {
        const id = row.original._id;

        return (
          <div className="super-admin-action-icons">
            <Link to={`/admin/view-invoice/${id}`}>
              <i className="fa-solid fa-eye"></i>
            </Link>

            <Link to={`/admin/edit-invoice/${id}`}>
              <i className="fa-solid fa-pen text-warning ms-2"></i>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <section className="super-dashboard-content-wrapper">
      <ToastContainer />

      <div className="super-dashboard-breadcrumb-info">
        <h4>Company Invoices</h4>
      </div>

      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/complete-company-details">
            <i className="fa-solid fa-angles-left" />
          </Link>
          Manage Invoices
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
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : allInvoices.length === 0 ? (
            <div className="simple-list-empty-state">
              <i className="fa-solid fa-file-invoice" />
              <h6>No invoice data found</h6>
            </div>
          ) : (
            <TableView columns={columns} data={allInvoices} />
          )}
        </div>
      </div>
    </section>
  );
}

export default AllInvoiceList;
