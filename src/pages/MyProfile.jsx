import React, { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { TextField, Button } from "@mui/material";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const MyProfile = () => {
const [profileImage, setProfileImage] = useState(
  `${process.env.PUBLIC_URL}/assets/images/userImg/candidate1.jpg`
);

  const fileInputRef = useRef(null);

  // Handle image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // Trigger file input when clicking the icon
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
  
      <div className="container " style={{ backgroundColor: "#fff" }}>
        <div className="row m-0 ">
           <div className="col-12 my-2">
          </div>
          <div className="row justify-content-center">
            <div className="col-12 text-center position-relative">
              {/* Profile Image */}
              <img
                src={profileImage}
                alt="Profile"
                onClick={handleImageClick}
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  border: "2px solid #1E95D5",
                  marginBottom: "20px",
                  cursor: "pointer",
                  objectFit: "cover",
                }}
              />

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              {/* Pencil Icon Overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "calc(50% - 75px)",
                  backgroundColor: "#1E95D5",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "16px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
                onClick={handleImageClick}
                title="Edit Profile Picture"
              >
                <i className="fa-solid fa-pencil"></i>
              </div>
            </div>
          </div>

          <div className="col-12 my-2">
            <TextField
              fullWidth
              variant="outlined"
              size="large"
              label={"Name"}
              name="oldPassword"
            />
          </div>
          <div className="col-12 my-2">
            <TextField
              fullWidth
              variant="outlined"
              aize="large"
              label={"Email"}
              name="newPassword"
            />
          </div>
          <div className="col-12 my-2">
            <TextField
              fullWidth
              variant="outlined"
              className="me-2"
              size="large"
              label={"Phone Number"}
              name="confirmPassword"
            />
          </div>
          <div className="col-12 my-2 d-flex justify-content-center">
            <Button type="submit" className="btn">
             Update
            </Button>
          </div>
        </div>
      </div>

  );
};

export default MyProfile;
