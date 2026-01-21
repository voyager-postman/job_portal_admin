import React from "react";
import { TextField, Button } from "@mui/material";

const ChangePassword = () => {
  return (
      <div className="container " style={{ backgroundColor: "#fff" }}>
        <div className="row m-0 ">
          <div className="col-12 my-3">
            <h4 className="text-center"> Change Password</h4>
          </div>
          <div className="col-12 my-3">
            <TextField
              fullWidth
              variant="outlined"
              size="large"
              label={"Old Password "}
              name="oldPassword"
            />
          </div>
          <div className="col-12 my-3">
            <TextField
              fullWidth
              variant="outlined"
              aize="large"
              label={"New password "}
              name="newPassword"
            />
          </div>
          <div className="col-12 my-3">
            <TextField
              fullWidth
              variant="outlined"
              className="me-2"
              size="large"
              label={"Confirm Password "}
              name="confirmPassword"
            />
          </div>
          <div className="col-12 my-3 d-flex justify-content-center">
            <Button type="submit" className="btn">
              SUBMIT
            </Button>
          </div>
        </div>
      </div>
  );
};

export default ChangePassword;
