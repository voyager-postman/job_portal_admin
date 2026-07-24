import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url.js";
import { TableView } from "../components/DataTable";
import axios from "axios";
import { useEffect, useState } from "react";

const EmployerSubscription = () => {
  const location = useLocation();
  const companyActiveId = location?.state?.companyActiveId;

  const [publishJob, setPublishJob] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  console.log("Received companyActiveId:", companyActiveId);

  useEffect(() => {
    if (companyActiveId) {
      fetchSubscriptions(companyActiveId);
    }
  }, [companyActiveId, page, limit]);

  // Fetch Company Subscriptions
  const fetchSubscriptions = async (companyId) => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API_BASE_URL}getCompanySubscriptions`,
        {
          params: { companyId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("API Response:", data);

      setPublishJob(data?.data || []);
      setTotalPages(Math.ceil((data?.total || 0) / limit));
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  // const columns = [
  //   {
  //     accessorKey: "id",
  //     header: "S.No",
  //     cell: ({ row }) => (page - 1) * limit + row.index + 1,
  //   },
  //   {
  //     header: "Pack Name",
  //     cell: ({ row }) => row.original?.pack?.name || "N/A",
  //   },
  //   {
  //     header: "Amount",
  //     cell: ({ row }) =>
  //       `${row.original?.pack?.amount || 0} ${row.original?.pack?.currency || ""}`,
  //   },
  //   {
  //     header: "Total Job Credits",
  //     cell: ({ row }) => row.original?.credits?.totalJobPosting ?? 0,
  //   },
  //   {
  //     header: "Remaining Job Credits",
  //     cell: ({ row }) => row.original?.credits?.remainingJobPosting ?? 0,
  //   },
  //   {
  //     header: "Total Profile Credits",
  //     cell: ({ row }) => row.original?.credits?.totalProfileViewing ?? 0,
  //   },
  //   {
  //     header: "Remaining Profile Credits",
  //     cell: ({ row }) => row.original?.credits?.remainingProfileViewing ?? 0,
  //   },
  //   {
  //     header: "Approval Status",
  //     cell: ({ row }) => {
  //       const status = row.original?.approval?.status || "Pending";

  //       let badgeClass = "badge bg-secondary";

  //       if (status === "Active") badgeClass = "badge bg-success";
  //       else if (status === "Pending")
  //         badgeClass = "badge bg-warning text-dark";
  //       else if (status === "Rejected" || status === "Inactive")
  //         badgeClass = "badge bg-danger";

  //       return <span className={badgeClass}>{status}</span>;
  //     },
  //   },
  //   {
  //     header: "Payment Status",
  //     cell: ({ row }) => {
  //       const status = row.original?.payment?.transaction?.status || "N/A";

  //       let badgeClass = "badge bg-secondary";

  //       if (status === "Success") badgeClass = "badge bg-success";
  //       else if (status === "Pending")
  //         badgeClass = "badge bg-warning text-dark";
  //       else if (status === "Failed") badgeClass = "badge bg-danger";

  //       return <span className={badgeClass}>{status}</span>;
  //     },
  //   },
  //   {
  //     header: "Start Date",
  //     cell: ({ row }) =>
  //       row.original?.validity?.startDate
  //         ? new Date(row.original.validity.startDate).toLocaleDateString()
  //         : "N/A",
  //   },
  //   {
  //     header: "End Date",
  //     cell: ({ row }) =>
  //       row.original?.validity?.endDate
  //         ? new Date(row.original.validity.endDate).toLocaleDateString()
  //         : "N/A",
  //   },
  // ];
  const columns = [
    {
      Header: "S.No",
      id: "sno", // required for computed column
      Cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      Header: "Pack Name",
      id: "packName",
      accessor: (row) => row?.pack?.name || "",
      Cell: ({ row }) => row.original?.pack?.name || "N/A",
    },
    {
      Header: "Amount",
      id: "amount",
      accessor: (row) =>
        `${row?.pack?.amount || 0} ${row?.pack?.currency || ""}`,
      Cell: ({ row }) =>
        `${row.original?.pack?.amount || 0} ${row.original?.pack?.currency || ""}`,
    },
    {
      Header: "Total Job Credits",
      id: "totalJobCredits",
      accessor: (row) => row?.credits?.totalJobPosting ?? 0,
      Cell: ({ row }) => row.original?.credits?.totalJobPosting ?? 0,
    },
    {
      Header: "Remaining Job Credits",
      id: "remainingJobCredits",
      accessor: (row) => row?.credits?.remainingJobPosting ?? 0,
      Cell: ({ row }) => row.original?.credits?.remainingJobPosting ?? 0,
    },
    {
      Header: "Total Profile Credits",
      id: "totalProfileCredits",
      accessor: (row) => row?.credits?.totalProfileViewing ?? 0,
      Cell: ({ row }) => row.original?.credits?.totalProfileViewing ?? 0,
    },
    {
      Header: "Remaining Profile Credits",
      id: "remainingProfileCredits",
      accessor: (row) => row?.credits?.remainingProfileViewing ?? 0,
      Cell: ({ row }) => row.original?.credits?.remainingProfileViewing ?? 0,
    },
    {
      Header: "Approval Status",
      id: "approvalStatus",
      accessor: (row) => row?.approval?.status || "Pending",
      Cell: ({ row }) => {
        const status = row.original?.approval?.status || "Pending";
        let badgeClass = "badge bg-secondary";

        if (status === "Active") badgeClass = "badge bg-success";
        else if (status === "Pending")
          badgeClass = "badge bg-warning text-dark";
        else if (status === "Rejected" || status === "Inactive")
          badgeClass = "badge bg-danger";

        return <span className={badgeClass}>{status}</span>;
      },
    },
    {
      Header: "Payment Status",
      id: "paymentStatus",
      accessor: (row) => row?.payment?.transaction?.status || "N/A",
      Cell: ({ row }) => {
        const status = row.original?.payment?.transaction?.status || "N/A";
        let badgeClass = "badge bg-secondary";

        if (status === "Success") badgeClass = "badge bg-success";
        else if (status === "Pending")
          badgeClass = "badge bg-warning text-dark";
        else if (status === "Failed") badgeClass = "badge bg-danger";

        return <span className={badgeClass}>{status}</span>;
      },
    },
    {
      Header: "Start Date",
      id: "startDate",
      accessor: (row) =>
        row?.validity?.startDate
          ? new Date(row.validity.startDate).toLocaleDateString()
          : "N/A",
      Cell: ({ row }) =>
        row.original?.validity?.startDate
          ? new Date(row.original.validity.startDate).toLocaleDateString()
          : "N/A",
    },
    {
      Header: "End Date",
      id: "endDate",
      accessor: (row) =>
        row?.validity?.endDate
          ? new Date(row.validity.endDate).toLocaleDateString()
          : "N/A",
      Cell: ({ row }) =>
        row.original?.validity?.endDate
          ? new Date(row.original.validity.endDate).toLocaleDateString()
          : "N/A",
    },
  ];
  return (
    <div>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Manage Employer Subscription</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link
              to="/admin/complete-company-details"
              state={{
                companyProfileId: companyActiveId,
                companyActiveId: companyActiveId,
                companyDataId: companyActiveId,
              }}
            >
              <i className="fa-solid fa-angles-left"></i>
            </Link>{" "}
            Employer Subscription
          </h5>
        </div>

        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : publishJob.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa-solid fa-database fa-2x text-muted mb-2"></i>
              <p className="text-muted">No Employer Subscription Found</p>
            </div>
          ) : (
            <>
              <TableView
                columns={columns}
                data={publishJob}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={(val) => {
                  setLimit(val);
                  setPage(1);
                }}
                totalPages={totalPages}
              />

              {/* Pagination */}
             
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default EmployerSubscription;
