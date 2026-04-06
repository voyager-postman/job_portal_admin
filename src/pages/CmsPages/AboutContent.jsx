import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL, API_IMAGE_URL } from "../../Url/Url";

const AboutContent = () => {
  const [formData, setFormData] = useState({
    mainTitle: "",
    mainTitleDescription: "",
    bannerImage: null, // can be File or string URL
  });
  const [secondSection, setSecondSection] = useState({
    mainTitle: "",
    description: "",
    steps: [{ title: "", description: "" }],
  });
  const [teamMeta, setTeamMeta] = useState({
    title: "",
    description: "",
  });

  const [teamMembers, setTeamMembers] = useState([]);

  const [newMember, setNewMember] = useState({
    name: "",
    designation: "",
    image: null,
    preview: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    },
  });
  const [imagePreview, setImagePreview] = useState("");

  // Fetch About Us first section
  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}getAboutUs`);
        if (res.data.success && res.data.data.firstSection) {
          const firstSection = res.data.data.firstSection;
          setFormData({
            mainTitle: firstSection.mainTitle || "",
            mainTitleDescription: firstSection.mainTitleDescription || "",
            bannerImage: firstSection.image || null,
          });
          setImagePreview(
            firstSection.image ? `${API_IMAGE_URL}${firstSection.image}` : "",
          );
        }
        if (res.data.success && res.data.data.secondSection) {
          const ss = res.data.data.secondSection;
          setSecondSection({
            mainTitle: ss.mainTitle || "",
            description: ss.description || "",
            steps: ss.steps.length
              ? ss.steps
              : [{ title: "", description: "" }],
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch About Us data");
      }
    };

    fetchAboutUs();
    fetchTeamMeta();
  }, []);
  const fetchTeamMeta = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}GetTeamSectionMeta`);

      if (res.data.success) {
        setTeamMeta({
          title: res.data.data.title || "",
          description: res.data.data.description || "",
        });

        setTeamMembers(res.data.data.members || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTeamMetaChange = (e) => {
    setTeamMeta({ ...teamMeta, [e.target.name]: e.target.value });
  };
  const handleTeamMetaSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}team/meta/update`, teamMeta);

      if (res.data.success) {
        toast.success("Team section updated");
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };
  const handleMemberChange = (e) => {
    const { name, value } = e.target;

    setNewMember({
      ...newMember,
      [name]: value,
    });
  };
  const handleSocialChange = (e) => {
    const { name, value } = e.target;

    setNewMember({
      ...newMember,
      socialLinks: {
        ...newMember.socialLinks,
        [name]: value,
      },
    });
  };
  const handleMemberImage = (e) => {
    const file = e.target.files[0];

    setNewMember({
      ...newMember,
      image: file,
      preview: URL.createObjectURL(file),
    });
  };
  const handleAddMember = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", newMember.name);
    formData.append("designation", newMember.designation);
    formData.append("image", newMember.image);
    formData.append("socialLinks", JSON.stringify(newMember.socialLinks));

    try {
      const res = await axios.post(`${API_BASE_URL}team/member/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Member added");

        setNewMember({
          name: "",
          designation: "",
          image: null,
          preview: "",
          socialLinks: {
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: "",
          },
        });

        fetchTeamMeta();
      }
    } catch (error) {
      toast.error("Failed to add member");
    }
  };
  const deleteMember = async (id) => {
    try {
      const res = await axios.post(`${API_BASE_URL}team/member/delete`, {
        memberId: id,
      });

      if (res.data.success) {
        toast.success("Member deleted");
        fetchTeamMeta();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };
  // Handle input changes
  const handleChange = (e) => {
    if (e.target.name === "bannerImage" && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({ ...formData, bannerImage: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("mainTitle", formData.mainTitle);
    data.append("mainTitleDescription", formData.mainTitleDescription);

    // Only send file if it’s a new upload
    if (formData.bannerImage instanceof File) {
      data.append("image", formData.bannerImage);
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}updateAboutUsFirstSection`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      if (res.data.success) {
        toast.success("About Us section updated successfully!");
      } else {
        toast.error(res.data.message || "Failed to update content");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating content");
    }
  };
  const handleStepChange = (index, field, value) => {
    const newSteps = [...secondSection.steps];
    newSteps[index][field] = value;
    setSecondSection({ ...secondSection, steps: newSteps });
  };

  const addStep = () => {
    setSecondSection({
      ...secondSection,
      steps: [...secondSection.steps, { title: "", description: "" }],
    });
  };

  const removeStep = (index) => {
    const newSteps = [...secondSection.steps];
    newSteps.splice(index, 1);
    setSecondSection({ ...secondSection, steps: newSteps });
  };

  // Submit updated second section
  const handleSubmit1 = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}updateAboutUsSecondSection`,
        secondSection,
      );
      if (res.data.success)
        toast.success("Second section updated successfully!");
      else toast.error(res.data.message || "Failed to update second section");
    } catch (error) {
      console.error(error);
      toast.error("Error updating second section");
    }
  };

  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>About Us Page Content Form</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <a href="super-admin-dashboard.html">
              <i class="fa-solid fa-angles-left"></i>
            </a>
            About Us Page First Section Content Update Here
          </h5>
        </div>

        <form
          className="super-dashboard-cms-content-form"
          onSubmit={handleSubmit}
        >
          <div className="container">
            <div className="row">
              {/* Main Title */}
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="mainTitle"
                    placeholder="Main Title"
                    value={formData.mainTitle}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title Description Paragraph</label>
                  <textarea
                    className="form-control"
                    rows="8"
                    placeholder="Write your description here..."
                    name="mainTitleDescription"
                    value={formData.mainTitleDescription}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </div>

              {/* Banner Image */}
              <div className="col-lg-12 col-md-12">
                <div className="section-Img-upload-input">
                  <label>Banner Image</label>
                </div>
                <div className="upload-company-info-area">
                  <div className="upload-company-img-preview">
                    <img
                      crossorigin="anonymous"
                      src={imagePreview}
                      className="main-logo"
                      id="preview"
                      alt="Image Preview"
                    />
                  </div>
                  <div className="upload-company-input">
                    <input
                      type="file"
                      id="imageInput"
                      name="bannerImage"
                      placeholder="Select image"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="upload-company-file-name">
                    <span className="file-name" id="fileName">
                      {formData.bannerImage
                        ? formData.bannerImage instanceof File
                          ? formData.bannerImage.name
                          : typeof formData.bannerImage === "string"
                            ? formData.bannerImage.split("/").pop()
                            : "Current Image"
                        : "No file selected"}
                    </span>
                  </div>
                  <div className="upload-company-file-btn">
                    <label
                      htmlFor="imageInput"
                      className="super-dashboard-custom-upload"
                    >
                      Choose Img
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <button type="submit" className="super-dashboard-content-btn">
                    Update Content
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="super-dashboard-common-heading">
          <h5>About Us Page Second Section Content Update Here</h5>
        </div>

        <form
          className="super-dashboard-cms-content-form"
          onSubmit={handleSubmit1}
        >
          <div className="container">
            <div className="row">
              {/* Main Title */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="mainTitle"
                    value={secondSection.mainTitle}
                    onChange={handleChange}
                    placeholder="Main Title"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="description"
                    value={secondSection.description}
                    onChange={handleChange}
                    placeholder="Description"
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="col-lg-12">
                <label>Steps</label>
                {secondSection.steps.map((step, index) => (
                  <div
                    key={index}
                    className="step-item mb-3 p-3 border rounded"
                  >
                    <div className="form-group">
                      <label>Step Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={step.title}
                        onChange={(e) =>
                          handleStepChange(index, "title", e.target.value)
                        }
                        placeholder="Step Title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Step Description</label>
                      <input
                        type="text"
                        className="form-control"
                        value={step.description}
                        onChange={(e) =>
                          handleStepChange(index, "description", e.target.value)
                        }
                        placeholder="Step Description"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger mt-2"
                      onClick={() => removeStep(index)}
                    >
                      Remove Step
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-primary mt-2"
                  onClick={addStep}
                >
                  Add Step
                </button>
              </div>

              {/* Submit Button */}
              <div className="col-lg-12 mt-3">
                <button type="submit" className="super-dashboard-content-btn">
                  Update Second Section
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="super-dashboard-common-heading">
          <h5>About Us Page Third Section (Team)</h5>
        </div>

        <form
          className="super-dashboard-cms-content-form"
          onSubmit={handleTeamMetaSubmit}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <label>Team Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={teamMeta.title}
                  onChange={handleTeamMetaChange}
                />
              </div>

              <div className="col-lg-12 mt-3">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="description"
                  value={teamMeta.description}
                  onChange={handleTeamMetaChange}
                />
              </div>

              <div className="col-lg-12 mt-3">
                <button type="submit" className="super-dashboard-content-btn">
                  Update Team Meta
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="super-dashboard-cms-content-form mt-2">
          <div className="container">
            <div className="super-dashboard-common-heading mb-3">
              <h5>Add Team Member</h5>
            </div>

            <div className="row">
              {/* Name */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Member Name"
                    name="name"
                    value={newMember.name}
                    onChange={handleMemberChange}
                  />
                </div>
              </div>

              {/* Designation */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Designation"
                    name="designation"
                    value={newMember.designation}
                    onChange={handleMemberChange}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="col-lg-12 col-md-12 mt-2">
                <div className="section-Img-upload-input">
                  <label>Member Image</label>
                </div>

                <div className="upload-company-info-area">
                  {/* Preview */}
                  <div className="upload-company-img-preview">
                    <img
                      src={
                        newMember.preview
                          ? newMember.preview
                          : `${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`
                      }
                      class="main-logo"
                      id="preview"
                      alt="Image Preview"
                    />
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    id="teamMemberImage"
                    hidden
                    accept="image/*"
                    onChange={handleMemberImage}
                  />

                  <div className="upload-company-file-name">
                    <span className="file-name">
                      {newMember.image
                        ? newMember.image.name
                        : "No file selected"}
                    </span>
                  </div>

                  <div className="upload-company-file-btn">
                    <label
                      htmlFor="teamMemberImage"
                      className="super-dashboard-custom-upload"
                    >
                      Choose Img
                    </label>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="col-lg-12 mt-4">
                <h6>Social Links</h6>
              </div>

              <div className="col-lg-6">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Facebook URL"
                  name="facebook"
                  value={newMember.socialLinks.facebook}
                  onChange={handleSocialChange}
                />
              </div>

              <div className="col-lg-6">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Instagram URL"
                  name="instagram"
                  value={newMember.socialLinks.instagram}
                  onChange={handleSocialChange}
                />
              </div>

              <div className="col-lg-6">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Twitter URL"
                  name="twitter"
                  value={newMember.socialLinks.twitter}
                  onChange={handleSocialChange}
                />
              </div>

              <div className="col-lg-6">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="LinkedIn URL"
                  name="linkedin"
                  value={newMember.socialLinks.linkedin}
                  onChange={handleSocialChange}
                />
              </div>

              {/* Submit Button */}
              <div className="col-lg-12 mt-3">
                <button
                  className="super-dashboard-content-btn"
                  onClick={handleAddMember}
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="super-dashboard-cms-content-form mt-4">
          <div className="container mt-4">
            <h5 >Team Members</h5>

            <div className="row mt-3">
              {teamMembers.map((member) => (
                <div className="col-lg-3 mb-3" key={member._id}>
                  <div className="card p-2 text-center">
                    <img
                      crossorigin="anonymous"
                      src={`${API_IMAGE_URL}${member.image}`}
                      height="120"
                      style={{ objectFit: "cover" }}
                    />

                    <h6 className="mt-2">{member.name}</h6>
                    <p>{member.designation}</p>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteMember(member._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AboutContent;
