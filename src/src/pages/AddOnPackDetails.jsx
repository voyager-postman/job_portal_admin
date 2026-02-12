import { Link, useNavigate } from "react-router-dom";
function AddOnPackDetails() {
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Add On Pack Details</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/super-admin-add-on-pack-created-list">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Add On Pack Name: Initial Base Pack
          </h5>
         
        </div>
        <div className="super-admin-white-bg">
          <div className="plan-detail-info-area">
            <div className="plan-heading-info-area">
              <h4>Initial Base Pack</h4>
              <h5>$50</h5>
            </div>
            <div className="plan-detail-table">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Job Post Credit</td>
                    <td>10 Credits</td>
                  </tr>
                  <tr>
                    <td>Daily Job Posting Limit</td>
                    <td>3 Job Post Per Day</td>
                  </tr>
                  <tr>
                    <td>Daily Profile Viewing Limit</td>
                    <td>5 Profile View Per Day</td>
                  </tr>
                  <tr>
                    <td>Validity</td>
                    <td>3 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="plan-detail-info-area">
            <div className="plan-heading-info-area">
              <h4>Stander Base Pack</h4>
              <h5>$60</h5>
            </div>
            <div className="plan-detail-table">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CV Viewing Credit</td>
                    <td>20 Credits</td>
                  </tr>
                  <tr>
                    <td>Daily Profile Viewing Limit</td>
                    <td>5 Profile View Per Day</td>
                  </tr>
                  <tr>
                    <td>Validity</td>
                    <td>3 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AddOnPackDetails;
