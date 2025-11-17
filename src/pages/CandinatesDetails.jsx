const CandinatesDetails = () => {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Candidate Profile</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>Candidate Profile Details</h5>
        </div>
        <div className="super-admin-candidate-profile-detail">
          <div className="super-admin-candidate-img-short-detail">
            <div className="super-admin-candidate-img">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/userImg/candidate1.jpg`}
                alt="Candidate"
              />
            </div>
            <div className="super-admin-candidate-short-detail">
              <h3>
                <strong>Name:</strong> Andy Smith
              </h3>
              <h3>
                <strong>Position:</strong>Website Desginer
              </h3>
              <h3>
                <strong>Email:</strong> andysmith@gmail.com
              </h3>
              <h3>
                <strong>Contact:</strong> +567 908 234 875
              </h3>
              <h3>
                <strong>Address:</strong> New York, USA
              </h3>
            </div>
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>Professional Summary</h4>
            <p>
              A talented professional with an academic background in IT and
              proven commercial development experience as C++ developer since
              1999. Has a sound knowledge of the software development life
              cycle. Was involved in more than 140 software development
              outsourcing projects.
            </p>
            <p>
              Programming Languages: C/C++, .NET C++, Python, Bash, Shell, PERL,
              Python, Angular, React, Node.js, Vue.js, Gatsby, Regular
              expressions Active-script.
            </p>
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>Career Goals</h4>
            <ul>
              <li>
                <h5>Desired Job Title</h5>
                <p>Website Designer</p>
              </li>
              <li>
                <h5>Desired Employment Type</h5>
                <p>Permanent contract</p>
              </li>
              <li>
                <h5>Desired Occupation Type</h5>
                <p>Full-time</p>
              </li>
            </ul>
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>About your role</h4>
            <ul>
              <li>
                <h5>Job title</h5>
                <p>Website Designer</p>
              </li>
              <li>
                <h5>Years of experience</h5>
                <p>3 Years</p>
              </li>
              <li>
                <h5>Job category</h5>
                <p>Software Engineering / Web Development</p>
              </li>
            </ul>
          </div>
          {/*    <div class="super-admin-candidate-profile-summary">
   <h4>Career Goals</h4> 
   <ul>
    <li>
     <h5>Desired Job Title</h5>
     <p>Website Designer</p>  
    </li>
    <li>
     <h5>Desired Employment Type</h5>
     <p>Permanent contract</p>  
    </li>
    <li>
     <h5>Desired Occupation Type</h5>
     <p>Full-time</p>  
    </li>
   </ul>
   </div> */}
          <div className="super-admin-candidate-profile-summary">
            <h4>Work Experience</h4>
            <ul>
              <li>
                <h5>Website Designer</h5>
                <p>Feb 2020 - Until now</p>
              </li>
              <li>
                <h5>Agriculture PVT LTD</h5>
                <p>United States, TN, Cordova, Frence</p>
              </li>
              <li />
            </ul>
            <h5>Description</h5>
            <p>
              We are a dynamic agricultural products, farming, and service
              company committed to meeting the diverse needs of farmers,
              wholesale markets, traders, exportersWe are a dynamic agricultural
              products, farming, and service company committed to meeting the
              diverse needs of farmers, wholesale markets, traders, exportersWe
              are a dynamic agricultural products, farming, and service company
              committed to meeting the diverse needs of farmers, wholesale
              markets, traders, exporters
            </p>
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>Position Salary(Gross)</h4>
            <ul>
              <li>
                <h5>Salary</h5>
                <p>2000 $</p>
              </li>
              <li>
                <h5>Payroll frequency</h5>
                <p>Monthly</p>
              </li>
              <li />
            </ul>
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>Education</h4>
            <ul>
              <li>
                <h5>Degree</h5>
                <p>B.Tech</p>
              </li>
              <li>
                <h5>University</h5>
                <p>IGNU</p>
              </li>
              <li>
                <h5>Start Date</h5>
                <p>05 / 2020</p>
              </li>
              <li>
                <h5>End Date</h5>
                <p>Until now</p>
              </li>
            </ul>
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>Skills &amp; Technologies</h4>
            <div className="super-admin-candidate-profile-tags">
              <ul>
                <li>PHP</li>
                <li>PYTHON</li>
                <li>ANDROID</li>
                <li>SEO</li>
                <li>DIGITAL MARKETING</li>
                <li>WEBSITE DESIGN</li>
              </ul>
            </div>
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>Languages</h4>
            <ul>
              <li>
                <h5>French</h5>
                <p>Native / Bilingual (C2)</p>
              </li>
              <li>
                <h5>English</h5>
                <p>Basic (A1 / A2)</p>
              </li>
              <li />
            </ul>
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>Certificates</h4>
            <ul>
              <li>
                <h5>B.Tech</h5>
                <p>Issue Date: 2025</p>
              </li>
              <li>
                <h5>BCA</h5>
                <p>Issue Date: 2021</p>
              </li>
              <li />
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandinatesDetails;
