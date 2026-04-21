import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL, API_IMAGE_URL } from "../../Url/Url";

const EmployeerHomeContent = () => {
  const [newSlider, setNewSlider] = useState({
    title: "",
    description: "",
    image: null,
    preview: "",
  });

  const [sliders, setSliders] = useState([]);

  const [sections, setSections] = useState([
    {
      mainTitle: "",
      shortParagraph: "",
      bannerImage: null,
      oldImage: "",
      preview: "",
    },
  ]);
  const [thirdSections, setThirdSections] = useState([
    {
      mainTitle: "",
      shortParagraph: "",
      bannerImage: null,
      preview: "",
    },
  ]);
  const [fourthSections, setFourthSections] = useState([
    {
      mainTitle: "",
      shortParagraph: "",
      steps: [
        {
          title: "",
          description: "",
        },
      ],
    },
  ]);
  const [fifthSections, setFifthSections] = useState([
    {
      mainTitle: "",
      shortParagraph: "",
      bannerImage: null,
      preview: "",
      cards: [
        {
          title: "",
          description: "",
        },
      ],
    },
  ]);
  const getRecruiterHome = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}recruiterHome`);

      if (res.data.success) {
        const sliderData = res.data.data.sliders;

        const formatted = sliderData.map((item) => ({
          _id: item._id,
          title: item.title || "",
          description: item.paragraph || "",
          bannerImage: null,
          preview: item.image
            ? `${API_IMAGE_URL}${item.image}`
            : `${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`,
        }));

        setSliders(formatted);

        // SECOND SECTION
        const second = res.data.data.secondSections;

        setSections([
          {
            mainTitle: second?.title || "",
            shortParagraph: second?.paragraph || "",
            bannerImage: null,
            oldImage: second?.image || "",
            preview: second?.image
              ? `${API_IMAGE_URL}${second.image}`
              : `${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`,
          },
        ]);
        const third = res.data.data.thirdSections;

        setThirdSections([
          {
            mainTitle: third?.title || "",
            shortParagraph: third?.paragraph || "",
            bannerImage: null,
            preview: third?.image
              ? `${API_IMAGE_URL}${third.image}`
              : `${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`,
          },
        ]);
        const fourth = res.data.data.fourthSection;

        setFourthSections([
          {
            mainTitle: fourth?.title || "",
            shortParagraph: fourth?.paragraph || "",
            steps:
              fourth?.steps?.length > 0
                ? fourth.steps.map((step) => ({
                    title: step.title,
                    description: step.description,
                  }))
                : [
                    {
                      title: "",
                      description: "",
                    },
                  ],
          },
        ]);
        const fifth = res.data.data.fifthSection;

        setFifthSections([
          {
            mainTitle: fifth?.title || "",
            shortParagraph: fifth?.description || "",
            bannerImage: null,
            preview: fifth?.image
              ? `${API_IMAGE_URL}${fifth.image}`
              : `${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`,
            cards:
              fifth?.cards?.length > 0
                ? fifth.cards.map((card) => ({
                    title: card.title,
                    description: card.description,
                  }))
                : [
                    {
                      title: "",
                      description: "",
                    },
                  ],
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRecruiterHome();
  }, []);
  const handleSliderChange = (e) => {
    const { name, value } = e.target;

    setNewSlider((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSliderImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setNewSlider((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };
  const handleAddSlider = async () => {
    try {
      const formData = new FormData();

      formData.append("title", newSlider.title);
      // formData.append("description", newSlider.description);
      formData.append("paragraph", newSlider.description);
      formData.append("image", newSlider.image);

      const res = await axios.post(
        `${API_BASE_URL}recruiterHome/sliders`,
        formData,
      );

      if (res.data.success) {
        toast.success("Slider Added Successfully");

        getRecruiterHome(); // refresh sliders

        setNewSlider({
          title: "",
          description: "",
          image: null,
          preview: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteSlider = async (id) => {
    try {
      const res = await axios.post(`${API_BASE_URL}delete/sliders/${id}`);

      if (res.data.success) {
        toast.success("Slider Deleted");

        setSliders((prev) => prev.filter((slider) => slider._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFifthInputChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...fifthSections];
    updated[index][name] = value;

    setFifthSections(updated);
  };
  const handleFifthImageChange = (index, e) => {
    const file = e.target.files[0];

    const updated = [...fifthSections];
    updated[index].bannerImage = file;
    updated[index].preview = URL.createObjectURL(file);

    setFifthSections(updated);
  };
  const handleCardChange = (sectionIndex, cardIndex, e) => {
    const { name, value } = e.target;

    const updated = [...fifthSections];
    updated[sectionIndex].cards[cardIndex][name] = value;

    setFifthSections(updated);
  };
  const addCard = () => {
    const updated = [...fifthSections];

    updated[0].cards.push({
      title: "",
      description: "",
    });

    setFifthSections(updated);
  };
  const removeCard = (cardIndex) => {
    const updated = [...fifthSections];

    updated[0].cards.splice(cardIndex, 1);

    setFifthSections(updated);
  };
  const handleFifthSubmit = async (e) => {
    e.preventDefault();

    try {
      const section = fifthSections[0];

      const formData = new FormData();

      formData.append("title", section.mainTitle);
      formData.append("paragraph", section.shortParagraph);
      formData.append("cards", JSON.stringify(section.cards));

      if (section.bannerImage) {
        // new uploaded image
        formData.append("image", section.bannerImage);
      } else if (section.preview) {
        // convert existing preview image to binary
        const response = await fetch(section.preview);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });

        formData.append("image", file);
      }

      const res = await axios.post(
        `${API_BASE_URL}recruiterHome/fifth`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        toast.success("Fifth section updated");
        getRecruiterHome();
      }
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };
  const handleFourthInputChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...fourthSections];
    updated[index][name] = value;

    setFourthSections(updated);
  };
  const handleStepChange = (stepIndex, e) => {
    const { name, value } = e.target;

    const updated = [...fourthSections];
    updated[0].steps[stepIndex][name] = value;

    setFourthSections(updated);
  };
  const addStep = () => {
    const updated = [...fourthSections];

    updated[0].steps.push({
      title: "",
      description: "",
    });

    setFourthSections(updated);
  };
  const removeStep = (index) => {
    const updated = [...fourthSections];

    updated[0].steps.splice(index, 1);

    setFourthSections(updated);
  };
  const handleFourthSubmit = async (e) => {
    e.preventDefault();

    try {
      const section = fourthSections[0];

      const payload = {
        title: section.mainTitle,
        paragraph: section.shortParagraph,
        steps: section.steps,
      };

      const res = await axios.post(
        `${API_BASE_URL}recruiterHome/fourth`,
        payload,
      );

      if (res.data.success) {
        toast.success("Fourth section updated");
      }
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };
  const handleThirdInputChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...thirdSections];
    updated[index][name] = value;

    setThirdSections(updated);
  };

  const handleThirdImageChange = (index, e) => {
    const file = e.target.files[0];

    const updated = [...thirdSections];
    updated[index].bannerImage = file;
    updated[index].preview = URL.createObjectURL(file);

    setThirdSections(updated);
  };
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...sections];
    updated[index][name] = value;

    setSections(updated);
  };
  const handleImageChange = (index, e) => {
    const file = e.target.files[0];

    const updated = [...sections];
    updated[index].bannerImage = file;
    updated[index].preview = URL.createObjectURL(file);

    setSections(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const section = sections[0];

      const formData = new FormData();
      formData.append("title", section.mainTitle);
      formData.append("paragraph", section.shortParagraph);

      if (section.bannerImage) {
        // new uploaded image
        formData.append("image", section.bannerImage);
      } else if (section.preview) {
        // convert existing image to binary
        const response = await fetch(section.preview);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });

        formData.append("image", file);
      }

      const res = await axios.post(
        `${API_BASE_URL}recruiterHome/second`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        toast.success("Updated successfully");
        getRecruiterHome();
      }
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };
  const handleThirdSubmit = async (e) => {
    e.preventDefault();

    try {
      const section = thirdSections[0];

      const formData = new FormData();
      formData.append("title", section.mainTitle);
      formData.append("paragraph", section.shortParagraph);

      if (section.bannerImage) {
        // new uploaded image
        formData.append("image", section.bannerImage);
      } else if (section.preview) {
        // convert existing image to binary
        const response = await fetch(section.preview);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });

        formData.append("image", file);
      }

      const res = await axios.post(
        `${API_BASE_URL}recruiterHome/third`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        toast.success("Third section updated");
        getRecruiterHome();
      }
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Employer Home Page Content Form</h4>
        </div>
      </section>
      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/">
            <i className="fa-solid fa-angles-left"></i>
          </Link>
          Employer Home Page Slider Content Update
        </h5>
      </div>

      <div className="super-dashboard-cms-content-form">
        <div className="container">
          <div className="super-dashboard-common-heading ">
            <h5>Add Slider</h5>
          </div>

          <div className="row">
            {/* Title */}
            <div className="col-lg-6 form-group">
              <label>Slider Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={newSlider.title}
                onChange={handleSliderChange}
              />
            </div>

            {/* Description */}
            <div className="col-lg-6 form-group">
              <label>Description</label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={newSlider.description}
                onChange={handleSliderChange}
              />
            </div>

        
            <div className="col-lg-12 col-md-12 mt-2">
              <div className="section-Img-upload-input">
                <label>Slider Image</label>
              </div>

              <div className="upload-company-info-area">
                {/* Preview */}
                <div className="upload-company-img-preview">
                  <img
                    src={
                      newSlider.preview
                        ? newSlider.preview
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
                  hidden
                  accept="image/*"
                  onChange={handleSliderImage}
                  id="teamMemberImage"
                />

                <div className="upload-company-file-name">
                  <span className="file-name">
                    {newSlider.image
                      ? newSlider.image.name
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
            {/* Add Button */}
            <div className="col-lg-12 mt-3">
              <button
                className="super-dashboard-content-btn"
                onClick={handleAddSlider}
              >
                Add Slider
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="super-dashboard-cms-content-form mt-4">
        <div className="container">
          <h5>Sliders</h5>

          <div className="row mt-3">
            {sliders.map((slider) => (
              <div className="col-lg-3 mb-3" key={slider._id}>
                <div className="card p-2 text-center">
                  <img
                    crossOrigin="anonymous"
                    src={`${slider.preview}`}
                    height="120"
                    style={{ objectFit: "cover" }}
                  />

                  <h6 className="mt-2">{slider.title}</h6>
                  <p>{slider.description}</p>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteSlider(slider._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/">
            <i className="fa-solid fa-angles-left"></i>
          </Link>
          Employer Home Page Second Section Content Update
        </h5>
      </div>
      <div className="super-dashboard-cms-content-form">
        <div className="container">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {sections.map((section, index) => (
              <div key={index} className="row  p-3 mb-4">
                {/* Main Title */}
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Main Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mainTitle"
                      value={section.mainTitle}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </div>
                </div>

                {/* Paragraph */}
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Short Paragraph</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shortParagraph"
                      value={section.shortParagraph}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="col-lg-12 col-md-12">
                  <div className="section-Img-upload-input">
                    <label>Banner Image</label>
                  </div>

                  <div className="upload-company-info-area">
                    <div className="upload-company-img-preview">
                      <img
                        crossOrigin="anonymous"
                        src={
                          section.preview
                            ? section.preview
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
                      id={`imageInput_${index}`}
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e)}
                    />

                    <div className="upload-company-file-name">
                      <span className="file-name">
                        {section.bannerImage
                          ? section.bannerImage.name
                          : "No file selected"}
                      </span>
                    </div>

                    <div className="upload-company-file-btn">
                      <label
                        htmlFor={`imageInput_${index}`}
                        className="super-dashboard-custom-upload"
                      >
                        Choose Img
                      </label>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
              </div>
            ))}

            {/* Add Section */}

            {/* Submit */}
            <div className="super-dashboard-content-btn-info">
              <button type="submit" className="super-dashboard-content-btn">
                Update Content
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/">
            <i className="fa-solid fa-angles-left"></i>
          </Link>
          Employer Home Page Third Section Content Update
        </h5>
      </div>
      <div className="super-dashboard-cms-content-form">
        <div className="container">
          <form onSubmit={handleThirdSubmit} encType="multipart/form-data">
            {thirdSections.map((section, index) => (
              <div key={index} className="row  p-3 mb-4">
                {/* Main Title */}
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Main Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mainTitle"
                      value={section.mainTitle}
                      onChange={(e) => handleThirdInputChange(index, e)}
                    />
                  </div>
                </div>

                {/* Paragraph */}
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Short Paragraph</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shortParagraph"
                      value={section.shortParagraph}
                      onChange={(e) => handleThirdInputChange(index, e)}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="col-lg-12 col-md-12">
                  <div className="section-Img-upload-input">
                    <label>Banner Image</label>
                  </div>

                  <div className="upload-company-info-area">
                    <div className="upload-company-img-preview">
                      <img
                        crossOrigin="anonymous"
                        src={
                          section.preview
                            ? section.preview
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
                      id={`third_${index}`}
                      hidden
                      onChange={(e) => handleThirdImageChange(index, e)}
                    />

                    <div className="upload-company-file-name">
                      <span className="file-name">
                        {section.bannerImage
                          ? section.bannerImage.name
                          : "No file selected"}
                      </span>
                    </div>

                    <div className="upload-company-file-btn">
                      <label
                        htmlFor={`third_${index}`}
                        className="super-dashboard-custom-upload"
                      >
                        Choose Img
                      </label>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
              </div>
            ))}

            {/* Add Section */}

            {/* Submit */}
            <div className="super-dashboard-content-btn-info">
              <button type="submit" className="super-dashboard-content-btn">
                Update Content
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/">
            <i className="fa-solid fa-angles-left"></i>
          </Link>
          Employer Home Page Fourth Section Content Update
        </h5>
      </div>

      <div className="super-dashboard-cms-content-form">
        <div className="container">
          <form onSubmit={handleFourthSubmit}>
            {fourthSections.map((section, index) => (
              <div key={index} className="row p-3 mb-4">
                {/* Main Title */}
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Main Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mainTitle"
                      value={section.mainTitle}
                      onChange={(e) => handleFourthInputChange(index, e)}
                    />
                  </div>
                </div>

                {/* Paragraph */}
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Short Paragraph</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shortParagraph"
                      value={section.shortParagraph}
                      onChange={(e) => handleFourthInputChange(index, e)}
                    />
                  </div>
                </div>

                {/* Steps */}
                <div className="col-lg-12">
                  <label>Steps</label>

                  {section.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="row mb-3">
                      <div className="col-lg-5">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Step Title"
                          name="title"
                          value={step.title}
                          onChange={(e) => handleStepChange(stepIndex, e)}
                        />
                      </div>

                      <div className="col-lg-5">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Step Description"
                          name="description"
                          value={step.description}
                          onChange={(e) => handleStepChange(stepIndex, e)}
                        />
                      </div>

                      <div className="col-lg-2">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeStep(stepIndex)}
                        >
                          Remove
                        </button>
                      </div>
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
              </div>
            ))}

            <div className="super-dashboard-content-btn-info">
              <button type="submit" className="super-dashboard-content-btn">
                Update Content
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/">
            <i className="fa-solid fa-angles-left"></i>
          </Link>
          Employer Home Page Fifth Section Content Update
        </h5>
      </div>

      <div className="super-dashboard-cms-content-form">
        <div className="container">
          <form onSubmit={handleFifthSubmit} encType="multipart/form-data">
            {fifthSections.map((section, index) => (
              <div key={index} className="row p-3 mb-4">
                {/* Main Title */}
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Main Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mainTitle"
                      value={section.mainTitle}
                      onChange={(e) => handleFifthInputChange(index, e)}
                    />
                  </div>
                </div>

                {/* Paragraph */}
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Short Paragraph</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shortParagraph"
                      value={section.shortParagraph}
                      onChange={(e) => handleFifthInputChange(index, e)}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="col-lg-12 col-md-12">
                  <div className="section-Img-upload-input">
                    <label>Banner Image</label>
                  </div>

                  <div className="upload-company-info-area">
                    <div className="upload-company-img-preview">
                      <img
                        crossOrigin="anonymous"
                        src={
                          section.preview
                            ? section.preview
                            : `${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`
                        }
                        class="main-logo"
                        id="preview"
                        alt="Image Preview"
                      />
                    </div>

                    <input
                      type="file"
                      id={`fifth_${index}`}
                      hidden
                      onChange={(e) => handleFifthImageChange(index, e)}
                    />
                    <div class="upload-company-file-name">
                      <span class="file-name">No file selected</span>
                    </div>
                    <div className="upload-company-file-btn">
                      <label
                        htmlFor={`fifth_${index}`}
                        className="super-dashboard-custom-upload"
                      >
                        Choose Img
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cards */}
                <div className="col-lg-12 mt-4">
                  <h5>Cards</h5>

                  {section.cards.map((card, cardIndex) => (
                    <div key={cardIndex} className="row mb-3">
                      <div className="col-lg-5">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Card Title"
                          name="title"
                          value={card.title}
                          onChange={(e) =>
                            handleCardChange(index, cardIndex, e)
                          }
                        />
                      </div>

                      <div className="col-lg-5">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Card Description"
                          name="description"
                          value={card.description}
                          onChange={(e) =>
                            handleCardChange(index, cardIndex, e)
                          }
                        />
                      </div>

                      <div className="col-lg-2">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeCard(cardIndex)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addCard}
                  >
                    Add Card
                  </button>
                </div>
              </div>
            ))}

            <div className="super-dashboard-content-btn-info">
              <button type="submit" className="super-dashboard-content-btn">
                Update Content
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default EmployeerHomeContent;
