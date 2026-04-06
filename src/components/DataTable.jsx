import { useState } from "react";
import ReactPaginate from "react-paginate";
import { useGlobalFilter, useTable } from "react-table";

export const TableView = ({
  columns = [],
  data = [],
  customElement = <></>,
}) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [usersPerPage, setUserPerPage] = useState(10);
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(data.length / usersPerPage);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
  );

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="top-space-search-reslute">
      <div className="tab-content px-2 md:!px-4">
        <div className="parentProduceSearch">
          <div className="entries">
            <small>Show</small>{" "}
            <select
              value={usersPerPage}
              onChange={(e) => setUserPerPage(e.target.value)}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>{" "}
            <small>entries</small>
          </div>
          <div className="table-search-box-info">
            <input
              onChange={(e) => setGlobalFilter(e.target.value)}
              type="search"
              placeholder="search"
            />
          </div>
        </div>
        {customElement}
        <div className="tab-pane active" id="header" role="tabpanel">
          <div
            id="datatable_wrapper"
            className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
          >
            <table
              {...getTableProps()}
              id="example"
              className="display table table-hover table-bordered borderTerpProduce"
              style={{ width: "100%" }}
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map((row) => {
                    prepareRow(row);

                    return (
                      <tr className="rowCursorPointer" {...row.getRowProps()}>
                        {row?.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName={"nextBttn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />
        </div>
      </div>
    </div>
  );
};
