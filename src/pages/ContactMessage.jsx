import { TableView } from "../components/DataTable";
import { API_BASE_URL } from "../Url/Url.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
function ContactMessage() {
  const [loadingAll, setLoadingAll] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      setLoadingAll(true);

      const response = await axios.get(`${API_BASE_URL}getContactMessages`, {
        params: { page, limit },
      });
      console.log(response);
      setMessages(response.data?.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
    } finally {
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, limit]);

  // const columns = [
  //   {
  //     accessorKey: "id",
  //     header: "S.No",
  //     cell: ({ row }) => (page - 1) * limit + row.index + 1,
  //   },
  //   {
  //     accessorKey: "name",
  //     header: "Name",
  //     accessorFn: (row) => (row.name || "").toLowerCase(),
  //     cell: ({ row }) => row.original?.name || "Not Provided",
  //   },
  //   {
  //     accessorKey: "email",
  //     header: "Email",
  //     accessorFn: (row) => (row.email || "").toLowerCase(),
  //     cell: ({ row }) => row.original?.email || "Not Provided",
  //   },
  //   {
  //     accessorKey: "phone",
  //     header: "Phone",
  //     accessorFn: (row) => (row.phone || "").toLowerCase(),
  //     cell: ({ row }) => row.original?.phone || "Not Provided",
  //   },
  //   {
  //     accessorKey: "subject",
  //     header: "Subject",
  //     accessorFn: (row) => (row.subject || "").toLowerCase(),
  //     cell: ({ row }) => {
  //       const text = row.original?.subject || "Not Provided";
  //       return text.length > 30 ? text.slice(0, 30) + "..." : text;
  //     },
  //   },
  //   {
  //     accessorKey: "message",
  //     header: "Message",
  //     cell: ({ row }) => {
  //       const text = row.original?.message || "Not Provided";

  //       return (
  //         <>
  //           <span>{text.length > 40 ? text.slice(0, 40) + "..." : text}</span>

  //           {text.length > 40 && (
  //             <>
  //               <span
  //                 data-tooltip-id={`msg-${row.index}`}
  //                 style={{
  //                   marginLeft: "6px",
  //                   cursor: "pointer",
  //                   fontWeight: "bold",
  //                 }}
  //               >
  //                 ⋯
  //               </span>

  //               <Tooltip
  //                 id={`msg-${row.index}`}
  //                 place="top"
  //                 content={text}
  //                 style={{ maxWidth: "300px" }}
  //               />
  //             </>
  //           )}
  //         </>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "date",
  //     header: "Date",
  //     cell: ({ row }) =>
  //       row.original?.createdAt
  //         ? new Date(row.original.createdAt).toLocaleDateString()
  //         : "Not Provided",
  //   },
  // ];
  const columns = [
    {
      Header: "S.No",
      id: "serial",
      Cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },

    {
      Header: "Name",
      accessor: "name",
      Cell: ({ row }) => row.original?.name || "Not Provided",
    },

    {
      Header: "Email",
      accessor: "email",
      Cell: ({ row }) => row.original?.email || "Not Provided",
    },

    {
      Header: "Phone",
      accessor: "phone",
      Cell: ({ row }) => row.original?.phone || "Not Provided",
    },

    {
      Header: "Subject",
      accessor: "subject",
      Cell: ({ row }) => {
        const text = row.original?.subject || "Not Provided";
        return text.length > 30 ? text.slice(0, 30) + "..." : text;
      },
    },

    {
      Header: "Message",
      accessor: "message",
      Cell: ({ row }) => {
        const text = row.original?.message || "Not Provided";

        return (
          <>
            <span>{text.length > 40 ? text.slice(0, 40) + "..." : text}</span>

            {text.length > 40 && (
              <>
                <span
                  data-tooltip-id={`msg-${row.index}`}
                  style={{
                    marginLeft: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ⋯
                </span>

                <Tooltip
                  id={`msg-${row.index}`}
                  place="top"
                  content={text}
                  style={{ maxWidth: "300px" }}
                />
              </>
            )}
          </>
        );
      },
    },

    {
      Header: "Date",
      accessor: "createdAt",
      Cell: ({ row }) =>
        row.original?.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "Not Provided",
    },
  ];
  return (
    <section className="super-dashboard-content-wrapper">
      <ToastContainer />

      <div className="super-dashboard-breadcrumb-info">
        <h4>Contact Messages</h4>
      </div>

      <div className="super-dashboard-common-heading">
        <h5>Manage Contact Messages</h5>
      </div>

      <div className="super-admin-manage-candidate-list super-admin-white-bg">
        <div className="table-responsive">
          {loadingAll ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <>
              <TableView
                columns={columns}
                data={messages}
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
      </div>
    </section>
  );
}

export default ContactMessage;
