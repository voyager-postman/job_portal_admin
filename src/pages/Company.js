import React, { useState } from "react";
import { TableView } from "../components/DataTable";

function Company() {
  const [data, setData] = useState([
    { id: 1, name: "TechNova Solutions", status: true },
    { id: 2, name: "MediLife Healthcare", status: true },
    { id: 3, name: "FinTrust Bank", status: false },
    { id: 4, name: "BuildRight Engineering", status: true },
    { id: 5, name: "EduSmart Learning", status: true },
    { id: 6, name: "ShopEase E-Commerce", status: false },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [companyName, setCompanyName] = useState("");

  // ✅ Open Add Modal
  const handleAddClick = () => {
    setEditItem(null);
    setCompanyName("");
    setShowModal(true);
  };

  // ✅ Open Edit Modal
  const handleEditClick = (row) => {
    setEditItem(row.original);
    setCompanyName(row.original.name);
    setShowModal(true);
  };

  // ✅ Handle Save (Add / Edit)
  const handleSave = () => {
    if (!companyName.trim()) {
      alert("Company name is required!");
      return;
    }

    if (editItem) {
      // Edit existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, name: companyName } : item
        )
      );
    } else {
      // Add new
      const newItem = {
        id: data.length + 1,
        name: companyName,
        status: true,
      };
      setData((prev) => [...prev, newItem]);
    }

    setShowModal(false);
  };

  // ✅ Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // ✅ Handle Status Toggle
  const handleStatusChange = (id) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  // ✅ Table Columns
  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Company Name",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="super-admin-toggle-switch">
          <label className="switch">
            <input
              type="checkbox"
              checked={row.original.status}
              onChange={() => handleStatusChange(row.original.id)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="super-admin-action-icons">
          <i
            className="fa-solid fa-pencil"
            title="Edit"
            onClick={() => handleEditClick(row)}
          />
          <i
            className="fa-solid fa-trash"
            title="Delete"
            onClick={() => handleDelete(row.original.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="main-dashboard-content d-flex flex-column">
      <div className="responsive-content">
        <div className="my-profile-area">
          <div className="profile-form-content add-recruiters-btn-postion">
            <h3>Company List</h3>
            <div className="add-recruiters-btn">
              <button
                onClick={handleAddClick}
                className="default-btn btn btn-primary"
              >
                Add Company
              </button>
            </div>

            <div className="profile-form mt-3">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <TableView columns={columns} data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Popup Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editItem ? "Edit Company" : "Add Company"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
              </div>

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
    </div>
  );
}

export default Company;
