import { useState } from "react";
<<<<<<< HEAD
=======
import ReactPaginate from "react-paginate";
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

export const TableView = ({
  columns = [],
  data = [],
  customElement = <></>,
<<<<<<< HEAD
  limit,
  setLimit,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");

=======
}) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [usersPerPage, setUserPerPage] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");

  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(data.length / usersPerPage);

>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

<<<<<<< HEAD
=======
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
  return (
    <div className="top-space-search-reslute">
      <div className="tab-content px-2 md:!px-4">
        <div className="parentProduceSearch">
          <div className="entries">
            <small>show</small>{" "}
            <select
<<<<<<< HEAD
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
=======
              value={usersPerPage}
              onChange={(e) => setUserPerPage(Number(e.target.value))}
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>{" "}
            <small>entries</small>
          </div>
<<<<<<< HEAD

=======
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
          <div className="table-search-box-info">
            <input
              onChange={(e) => setGlobalFilter(e.target.value)}
              type="search"
              placeholder="search"
            />
          </div>
        </div>

        {customElement}
<<<<<<< HEAD
        
=======

>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
        <div className="tab-pane active" id="header" role="tabpanel">
          <div
            id="datatable_wrapper"
            className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
          >
<<<<<<< HEAD
            <table
=======
            <table 
              id="example"
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
              className="display table table-bordered borderTerpProduce"
              style={{ width: "100%" }}
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
<<<<<<< HEAD

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="rowCursorPointer">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
=======
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(pagesVisited, pagesVisited + usersPerPage)
                  .map((row) => (
                    <tr key={row.id} className="rowCursorPointer">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
              />
            </div>
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
          </div>
        </div>
      </div>
    </div>
  );
};
