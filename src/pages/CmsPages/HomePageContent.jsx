import { Link } from "react-router-dom";
const HomePageContent = () => {
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Home Page Content Form</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i class="fa-solid fa-angles-left"></i>
            </Link>
            Home Page First Section Content Update Here
          </h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Short Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="short-title"
                    placeholder="Short Title"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title"
                    placeholder="Main Title"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title Short Paragraph</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title-short-paragraph"
                    placeholder="Main Title Short Paragraph"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Trending Keywords</label>
                  <input
                    type="text"
                    className="form-control"
                    name="trending-keywords"
                    placeholder="Trending Keywords"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="section-Img-upload-input">
                  <label>First Section Img Upload</label>
                </div>
                <div className="upload-company-info-area">
                  <div className="upload-company-img-preview">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`}
                      className="main-logo"
                      id="preview"
                      alt="Image Preview"
                    />
                  </div>
                  <div className="upload-company-input">
                    {/* Hidden input */}
                    <input type="file" id="imageInput" accept="image/*" />
                  </div>
                  <div className="upload-company-file-name">
                    {/* Display file name */}
                    <span className="file-name" id="fileName">
                      No file selected
                    </span>
                  </div>
                  <div className="upload-company-file-btn">
                    {/* Label acting as custom button */}
                    <label
                      htmlFor="imageInput"
                      className="super-dashboard-custom-upload"
                    >
                      Choose Img
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Second Section Content Update Here</h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title"
                    placeholder="Main Title"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title Short Paragraph</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title-short-paragraph"
                    placeholder="Main Title Short Paragraph"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Third Section Content Update Here</h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title"
                    placeholder="Main Title"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title Short Paragraph</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title-short-paragraph"
                    placeholder="Main Title Short Paragraph"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Icon Heading</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title-short-paragraph"
                    placeholder="Icon Heading"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="section-Img-upload-input">
                  <label>Third Section Img Upload</label>
                </div>
                <div className="upload-company-info-area">
                  <div className="upload-company-img-preview">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`}
                      className="main-logo"
                      id="preview"
                      alt="Image Preview"
                    />
                  </div>
                  <div className="upload-company-input">
                    {/* Hidden input */}
                    <input type="file" id="imageInput" accept="image/*" />
                  </div>
                  <div className="upload-company-file-name">
                    {/* Display file name */}
                    <span className="file-name" id="fileName">
                      No file selected
                    </span>
                  </div>
                  <div className="upload-company-file-btn">
                    {/* Label acting as custom button */}
                    <label
                      htmlFor="imageInput"
                      className="super-dashboard-custom-upload"
                    >
                      Choose Img
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Fourth Section Content Update Here</h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title"
                    placeholder="Main Title"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title Short Paragraph</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title-short-paragraph"
                    placeholder="Main Title Short Paragraph"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Fifth Section Content Update Here</h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title"
                    placeholder="Main Title"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title Short Paragraph</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title-short-paragraph"
                    placeholder="Main Title Short Paragraph"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>User Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="user-name"
                    placeholder="User Name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>User Name Position</label>
                  <input
                    type="text"
                    className="form-control"
                    name="user-name-position"
                    placeholder="User Name Position"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Write Review for the Website</label>
                  <textarea
                    id="review"
                    className="form-control"
                    rows={2}
                    placeholder="Write your review here..."
                    required
                    defaultValue={""}
                  />
                </div>
                <div className="super-dashboard-star-rating">
                  <h5>Rating *</h5>
                  <span>
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-regular fa-star" />
                  </span>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Sixth Section Content Update Here</h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              {/* <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <div className="super-dashboard-upload-Img">
                    <input type="file" id="officePhotos" accept="image/*" />
                    <span className="file-name" id="fileInfo">
                      No image selected
                    </span>
                    <label
                      htmlFor="officePhotos"
                      className="Custom-Upload default-btn btn"
                    >
                      Choose Image
                    </label>
                  </div>
                  <div id="previewContainer" />
                </div>
              </div> */}
              <div className="col-lg-12 col-md-12">
                <div className="section-Img-upload-input">
                  <label>Seventh Section Img Upload</label>
                </div>
                <div className="upload-company-info-area">
                  <div className="upload-company-img-preview">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`}
                      className="main-logo"
                      id="preview"
                      alt="Image Preview"
                    />
                  </div>
                  <div className="upload-company-input">
                    {/* Hidden input */}
                    <input type="file" id="imageInput" accept="image/*" />
                  </div>
                  <div className="upload-company-file-name">
                    {/* Display file name */}
                    <span className="file-name" id="fileName">
                      No file selected
                    </span>
                  </div>
                  <div className="upload-company-file-btn">
                    {/* Label acting as custom button */}
                    <label
                      htmlFor="imageInput"
                      className="super-dashboard-custom-upload"
                    >
                      Choose Img
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title-number"
                    placeholder="Main Title Short Paragraph"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Number Heading</label>
                  <input
                    type="text"
                    className="form-control"
                    name="number-heading"
                    placeholder="Number Heading"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Seventh Section Content Update Here</h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title"
                    placeholder="Main Title"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title Description Paragraph</label>
                  <textarea
                    id="review"
                    className="form-control"
                    rows={2}
                    placeholder="Write your description here..."
                    required
                    defaultValue={""}
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="section-Img-upload-input">
                  <label>Seventh Section Img Upload</label>
                </div>
                <div className="upload-company-info-area">
                  <div className="upload-company-img-preview">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`}
                      className="main-logo"
                      id="preview"
                      alt="Image Preview"
                    />
                  </div>
                  <div className="upload-company-input">
                    {/* Hidden input */}
                    <input type="file" id="imageInput" accept="image/*" />
                  </div>
                  <div className="upload-company-file-name">
                    {/* Display file name */}
                    <span className="file-name" id="fileName">
                      No file selected
                    </span>
                  </div>
                  <div className="upload-company-file-btn">
                    {/* Label acting as custom button */}
                    <label
                      htmlFor="imageInput"
                      className="super-dashboard-custom-upload"
                    >
                      Choose Img
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Eight Section Content Update Here</h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title"
                    placeholder="Main Title"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="section-Img-upload-input">
                  <label>Eight Section Img Upload</label>
                </div>
                <div className="upload-company-info-area">
                  <div className="upload-company-img-preview">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`}
                      className="main-logo"
                      id="preview"
                      alt="Image Preview"
                    />
                  </div>
                  <div className="upload-company-input">
                    {/* Hidden input */}
                    <input type="file" id="imageInput" accept="image/*" />
                  </div>
                  <div className="upload-company-file-name">
                    {/* Display file name */}
                    <span className="file-name" id="fileName">
                      No file selected
                    </span>
                  </div>
                  <div className="upload-company-file-btn">
                    {/* Label acting as custom button */}
                    <label
                      htmlFor="imageInput"
                      className="super-dashboard-custom-upload"
                    >
                      Choose Img
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Ninth Section Content Update Here</h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title"
                    placeholder="Main Title"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title Short Paragraph</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title-short-paragraph"
                    placeholder="Main Title Short Paragraph"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Tenth Content Update Here</h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title"
                    placeholder="Main Title"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title Short Paragraph</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title-short-paragraph"
                    placeholder="Main Title Short Paragraph"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Eleventh Content Update Here</h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title"
                    placeholder="Main Title"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePageContent;
