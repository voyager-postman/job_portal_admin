import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { API_BASE_URL } from "../Url/Url";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
const ViewInvoice = () => {
  const { invoiceId } = useParams();
  const location = useLocation();
  const backPath = location.state?.from || "/admin/invoice-list";
  const invoiceRef = useRef();

  const [invoiceData, setInvoiceData] = useState(null);

  const fetchInvoice = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}getInvoiceById/${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setInvoiceData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);
  const downloadPDF = async () => {
    const element = invoiceRef.current;

    const canvas = await html2canvas(element, {
      scale: 3, // increase resolution
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
  };

  return (
    <section className="super-dashboard-content-wrapper">
      <div className="super-dashboard-breadcrumb-info">
        <h4>Invoice Details</h4>
      </div>
      <div className="super-dashboard-common-heading">
        <h5>
          <Link
            to={backPath}
            state={{
              companyActiveId: localStorage.getItem("companyProfileId"),
            }}
          >
            <i className="fa-solid fa-angles-left" />
          </Link>
          Invoice Details
        </h5>
      </div>
      <div className="invoice-page">
        <div className="text-end mb-3">
          <button className="btn btn-primary" onClick={downloadPDF}>
            Download Invoice
          </button>
        </div>

        {invoiceData && (
          <div className="invoice-container" ref={invoiceRef}>
            {/* Header */}
            <div className="invoice-header d-flex justify-content-between">
              <div>
                <h2 className="invoice-title mb-2">INVOICE</h2>
                <span className="status-badge">{invoiceData.status}</span>
              </div>

              <div className="text-end invoice-meta">
                <p>
                  <strong>Invoice No:</strong> {invoiceData.invoiceNumber}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(invoiceData.createdAt).toLocaleDateString()}
                </p>

                <p>
                  <strong>Payment:</strong>{" "}
                  {invoiceData.paymentMethod || "Manual"}
                </p>
              </div>
            </div>

            {/* Company Info */}
            <div className="row mt-4">
              <div className="col-md-6">
                <h6 className="text-muted">Billed To</h6>
                <p className="mb-1 fw-bold">
                  {invoiceData.companyId?.brandName}
                </p>

                <p className="mb-0">{invoiceData.requestId?.contactEmail}</p>

                <p className="mb-0">
                  {" "}
                  {invoiceData.companyId?.companyAddress},{" "}
                  {invoiceData.companyId?.city}
                </p>

                <p className="mb-0">
                  +{invoiceData.companyId?.phone?.countryCode}{" "}
                  {invoiceData.companyId?.phone?.number}
                </p>
              </div>

              <div className="col-md-6 text-md-end">
                <h6 className="text-muted">From</h6>
                <p className="mb-1 fw-bold">Your Platform Name</p>
                <p className="mb-0">support@yourplatform.com</p>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive mt-4">
              <table className="table invoice-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Unit Price</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>
                      <strong>
                        {invoiceData.itemName ||
                          invoiceData.requestId?.packId?.packName ||
                          "Credits Purchase"}
                      </strong>

                      <div className="text-muted small">
                        {invoiceData.jobCredits > 0 && (
                          <>
                            Job Posting Credits: {invoiceData.jobCredits}
                            <br />
                          </>
                        )}

                        {invoiceData.profileCredits > 0 && (
                          <>
                            Profile Viewing Credits:{" "}
                            {invoiceData.profileCredits}
                            <br />
                          </>
                        )}

                        {invoiceData.requestId?.message && (
                          <>
                            Message: {invoiceData.requestId?.message}
                            <br />
                          </>
                        )}

                        {invoiceData.requestId?.packId?.validity && (
                          <>Valid for {invoiceData.requestId.packId.validity}</>
                        )}
                      </div>
                    </td>

                    <td className="text-center">1</td>

                    <td className="text-end">
                      {invoiceData.currency} {invoiceData.amount}
                    </td>

                    <td className="text-end">
                      {invoiceData.currency} {invoiceData.amount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="row justify-content-end mt-4">
              <div className="col-md-5">
                <div className="total-box">
                  <div className="d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span>
                      {invoiceData.currency} {invoiceData.amount}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>Tax (0%)</span>
                    <span>{invoiceData.currency} 0</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Total</span>
                    <span>
                      {invoiceData.currency} {invoiceData.amount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="invoice-footer text-center">
              This invoice was automatically generated after admin validation.
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ViewInvoice;
