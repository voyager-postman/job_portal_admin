import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url.js";
import { TableView } from "../components/DataTable";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

const RecruiterList = () => {
  const location = useLocation();
  const companyDataId = location?.state?.companyDataId;
  const [recruiterList, setRecruiterList] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("Recieved Recruiter Id:", companyDataId);
  useEffect(() => {
    console.log("useEffect Triggered:", companyDataId);

    if (companyDataId) {
      fetchCandidates(companyDataId);
    }
  }, [companyDataId]);

  // Fetch Recruiter Data
  const fetchCandidates = async (companyId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}admin/recruiterList?companyId=${companyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("API Response:", response.data.recruiters);
      setRecruiterList(response.data.recruiters || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url || url === "undefined") {
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
    if (url.startsWith("http")) return url;
    return `${API_IMAGE_URL}${url}`;
  };

  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "profileImage",
      header: "Img",
      cell: ({ row }) => (
        <img
          crossorigin="anonymous"
          src={getImageUrl(row.original.logo)}
          alt="candidate"
          width={45}
          height={45}
          style={{ borderRadius: "50%" }}
          onError={(e) => {
            e.currentTarget.src =
              "https://cdn-icons-png.flaticon.com/512/149/149071.png";
          }}
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Recruiter Name",
      accessorFn: (row) =>
        `${row.first_name || ""} ${row.last_name || ""}`.toLowerCase(),
      cell: ({ row }) => (
        <>
          {row.original.first_name || "Not Provided"}{" "}
          {row.original.last_name || ""}
        </>
      ),
    },
    {
      accessorKey: "email",
      header: "Email ID",
      accessorFn: (row) => (row.email || "").toLowerCase(),
      cell: ({ row }) => row.original.email || "Not Provided",
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        // ❌ Don't render anything for other statuses
        if (status !== "Active" && status !== "Inactive") {
          return null;
        }

        const isActive = status === "Active";

        return (
          <span
            style={{
              color: isActive ? "#16a34a" : "#dc2626",
              backgroundColor: isActive ? "#dcfce7" : "#fee2e2",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              display: "inline-block",
            }}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Manage Recruiters</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/complete-company-details" state={{ companyProfileId: companyDataId }}>
              <i className="fa-solid fa-angles-left" />
            </Link>
            Recruiters List
          </h5>
        </div>

        <div className="table-responsive">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <>
              <TableView columns={columns} data={recruiterList} />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default RecruiterList;
