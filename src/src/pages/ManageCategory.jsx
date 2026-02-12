import { useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function ManageCantegory() {
  const [pageNumber, setPageNumber] = useState(0);
  const [usersPerPage, setUserPerPage] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const pagesVisited = pageNumber * usersPerPage;
  // const pageCount = Math.ceil(data.length / usersPerPage);
  const pageCount = 0;
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  return (
    <>
      <div className="my-profile-area">
        <div className="profile-form-content add-recruiters-btn-postion">
          <h3>Recruiters List</h3>
          <div className="add-recruiters-btn">
            <Link to="/admin/manage-users" className="default-btn btn">
              Add Recruiters
            </Link>
          </div>
          <div className="profile-form">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="top-space-search-reslute">
                  <div className="tab-content px-2 md:!px-4">
                    <div className="parentProduceSearch">
                      <div className="entries">
                        <small>show</small>{" "}
                        <select
                          value={usersPerPage}
                          onChange={(e) =>
                            setUserPerPage(Number(e.target.value))
                          }
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

                    <div
                      className="tab-pane active"
                      id="header"
                      role="tabpanel"
                    >
                      <div
                        id="datatable_wrapper"
                        className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
                      >
                        <table
                          id="example"
                          className="display table table-bordered borderTerpProduce"
                          style={{ width: "100%" }}
                        >
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Img</th>
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th>Email</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="rowCursorPointer">
                              <td>1</td>
                              <td>
                                <div className="recruiterImg-info">
                                  <img
                                    width={40}
                                    height={40}
                                    style={{
                                      borderRadius: "50%",
                                    }}
                                    alt="userImg"
                                    src="/assets/images/team/team-1.jpg"
                                  />
                                </div>
                              </td>
                              <td>vishal</td>
                              <td>patel</td>
                              <td>mobappssolutions135@gmail.com</td>
                              <td>
                                <div className="recruiter-status-info">
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      role="switch"
                                      type="checkbox"
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="action-icon-info">
                                  <i>
                                    <RemoveRedEyeOutlinedIcon />
                                  </i>
                                  <i>
                                    <EditIcon />
                                  </i>
                                  <i>
                                    <DeleteIcon />
                                  </i>
                                </div>
                              </td>
                            </tr>
                            <tr className="rowCursorPointer">
                              <td>2</td>
                              <td>
                                <div className="recruiterImg-info">
                                  <img
                                    width={40}
                                    height={40}
                                    style={{
                                      borderRadius: "50%",
                                    }}
                                    alt="userImg"
                                    src="/assets/images/team/team-2.jpg"
                                  />
                                </div>
                              </td>
                              <td>Neetu</td>
                              <td>Gupta</td>
                              <td>mobappssolutions165@gmail.com</td>
                              <td>
                                <div className="recruiter-status-info">
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      role="switch"
                                      type="checkbox"
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="action-icon-info">
                                  <i>
                                    <RemoveRedEyeOutlinedIcon />
                                  </i>
                                  <i>
                                    <EditIcon />
                                  </i>
                                  <i>
                                    <DeleteIcon />
                                  </i>
                                </div>
                              </td>
                            </tr>
                            <tr className="rowCursorPointer">
                              <td>3</td>
                              <td>
                                <div className="recruiterImg-info">
                                  <img
                                    width={40}
                                    height={40}
                                    style={{
                                      borderRadius: "50%",
                                    }}
                                    alt="userImg"
                                    src="/assets/images/team/team-3.jpg"
                                  />
                                </div>
                              </td>
                              <td>Tushar</td>
                              <td>Gupta</td>
                              <td>mobappssolutions185@gmail.com</td>
                              <td>
                                <div className="recruiter-status-info">
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      role="switch"
                                      type="checkbox"
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="action-icon-info">
                                  <i>
                                    <RemoveRedEyeOutlinedIcon />
                                  </i>
                                  <i>
                                    <EditIcon />
                                  </i>
                                  <i>
                                    <DeleteIcon />
                                  </i>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* <div className="flex justify-end">
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
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageCantegory;
