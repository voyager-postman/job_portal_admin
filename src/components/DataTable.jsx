import { useState } from "react";

import ReactPaginate from "react-paginate";

import { useGlobalFilter, useTable } from "react-table";



export const TableView = ({

  columns = [],

  data = [],

  customElement = <></>,

  hideSearch = false,

  hideControls = false,

  hidePagination = false,

  toolbarExtra = null,

  globalFilter: controlledGlobalFilter,

  setGlobalFilter: setControlledGlobalFilter,

  page,

  setPage,

  limit,

  setLimit,

  totalPages = 1,

}) => {

  const serverSide = typeof setLimit === "function";



  const [pageNumber, setPageNumber] = useState(0);

  const [usersPerPage, setUserPerPage] = useState(10);



  const currentLimit = serverSide ? Number(limit) || 10 : Number(usersPerPage) || 10;

  const pagesVisited = pageNumber * currentLimit;

  const clientPageCount = Math.ceil(data.length / currentLimit) || 1;

  const pageCount = serverSide ? Number(totalPages) || 1 : clientPageCount;

  const forcePage = serverSide ? Math.max(0, (Number(page) || 1) - 1) : pageNumber;



  const {

    getTableProps,

    getTableBodyProps,

    headerGroups,

    rows,

    prepareRow,

    setGlobalFilter: setInternalGlobalFilter,

    state: { globalFilter: internalGlobalFilter },

  } = useTable(

    {

      columns,

      data,

      globalFilter: controlledGlobalFilter,

    },

    useGlobalFilter,

  );



  const setGlobalFilter =

    setControlledGlobalFilter || setInternalGlobalFilter;

  const showDefaultSearch = !hideSearch && !hideControls && !toolbarExtra;

  const showToolbarSlot = !hideControls && (toolbarExtra || showDefaultSearch);

  const showControls = !hideControls;

  const showPagination = showControls && !hidePagination && pageCount > 0;



  const handleLimitChange = (e) => {

    const newLimit = Number(e.target.value);

    if (serverSide) {

      setLimit(newLimit);

    } else {

      setUserPerPage(newLimit);

      setPageNumber(0);

    }

  };



  const handlePageChange = ({ selected }) => {

    if (serverSide && setPage) {

      setPage(selected + 1);

    } else {

      setPageNumber(selected);

    }

  };



  const visibleRows = serverSide

    ? rows

    : rows.slice(pagesVisited, pagesVisited + currentLimit);



  return (

    <div className="top-space-search-reslute">

      <div className="tab-content px-2 md:!px-4">

        <div className="parentProduceSearch">

          {showControls && (

            <div className="entries">

              <small>Show</small>{" "}

              <select value={currentLimit} onChange={handleLimitChange}>

                <option value="10">10</option>

                <option value="25">25</option>

                <option value="50">50</option>

                <option value="100">100</option>

              </select>{" "}

              <small>entries</small>

            </div>

          )}

          {showToolbarSlot && (

            <div

              className={`table-search-box-info${toolbarExtra ? " table-search-box-info--filters" : ""}`}

            >

              {toolbarExtra || (

                <input

                  value={controlledGlobalFilter ?? internalGlobalFilter ?? ""}

                  onChange={(e) => setGlobalFilter(e.target.value)}

                  type="search"

                  placeholder="search"

                />

              )}

            </div>

          )}

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

                {visibleRows.map((row) => {

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

        {showPagination && (

          <div className="flex justify-end">

            <ReactPaginate

              previousLabel={"Previous"}

              nextLabel={"Next"}

              pageCount={pageCount}

              onPageChange={handlePageChange}

              forcePage={forcePage}

              containerClassName={"paginationBttns"}

              previousLinkClassName={"previousBttn"}

              nextLinkClassName={"nextBttn"}

              disabledClassName={"paginationDisabled"}

              activeClassName={"paginationActive"}

            />

          </div>

        )}

      </div>

    </div>

  );

};


