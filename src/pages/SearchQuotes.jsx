import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { TableView } from "../components/DataTable";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

function SearchQuotes() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH ALL QUOTES =================
  const fetchQuotes = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}/getSearchQuotes`);

      if (response.data?.success) {
        setData(response.data?.data || []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast.error("Failed to load search quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // ================= OPEN ADD MODAL =================
  const handleAddClick = () => {
    setEditItem(null);
    setQuote("");
    setShowModal(true);
  };

  // ================= OPEN EDIT MODAL =================
  const handleEditClick = (row) => {
    setEditItem(row.original);
    setQuote(row.original.quote);
    setShowModal(true);
  };

  // ================= SAVE / UPDATE =================
  const handleSave = async () => {
    if (!quote.trim()) {
      toast.warning("Search Quote is required!");
      return;
    }

    try {
      if (editItem) {
        // UPDATE
        await axios.post(`${API_BASE_URL}/updateSearchQuotes/${editItem._id}`, {
          quote,
        });

        toast.success("Search Quote updated successfully!");
      } else {
        // ADD
        await axios.post(`${API_BASE_URL}/addSearchQuotes`, {
          quote,
        });

        toast.success("Search Quote added successfully!");
      }

      setShowModal(false);
      fetchQuotes();
    } catch (error) {
      console.error("Error saving quote:", error);
      toast.error("Failed to save search quote");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.post(`${API_BASE_URL}/deleteSearchQuotes/${id}`);

        Swal.fire({
          title: "Deleted!",
          text: "Search Quote deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchQuotes();
      } catch (error) {
        console.error("Error deleting quote:", error);

        Swal.fire({
          title: "Error!",
          text: "Failed to delete search quote.",
          icon: "error",
        });
      }
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      Header: "S.No",
      accessor: "_id",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Search Quote",
      accessor: "quote",
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <div className="super-admin-action-icons">
          <i
            className="fa-solid fa-pencil"
            title="Edit"
            onClick={() => handleEditClick(row)}
            style={{ cursor: "pointer", marginRight: "10px" }}
          />

          <i
            className="fa-solid fa-trash"
            title="Delete"
            onClick={() => handleDelete(row.original._id)}
            style={{ cursor: "pointer", color: "red" }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {/* ================= PAGE HEADER ================= */}

      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Manage Search Quotes</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Search Quotes List
          </h5>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}

      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          <div className="my-profile-area">
            <div className="profile-form-content add-recruiters-btn-postion">
              {/* ================= TOP BUTTON ================= */}

              <div className="button-flex">
                <div>
                  <h3>Search Quotes List</h3>
                </div>

                <div className="button-flex2">
                  <div className="add-recruiters-btn">
                    <button
                      onClick={handleAddClick}
                      className="default-btn btn btn-primary"
                    >
                      + Add Search Quote
                    </button>
                  </div>
                </div>
              </div>

              {/* ================= TABLE ================= */}

              <div className="profile-form mt-3">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <TableView columns={columns} data={data} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MODAL ================= */}

        {showModal && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                {/* HEADER */}

                <div className="modal-header">
                  <h5 className="modal-title">
                    {editItem ? "Edit Search Quote" : "Add Search Quote"}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                {/* BODY */}

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Search Quote</label>

                    <textarea
                      className="form-control"
                      rows="4"
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      placeholder="Enter Search Quote"
                    />
                  </div>
                </div>

                {/* FOOTER */}

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    {editItem ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TOAST ================= */}

        <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      </div>
    </>
  );
}

export default SearchQuotes;
