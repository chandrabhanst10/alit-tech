import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import LoginLogo from "../../Assets/loginLogo.png";
import { styled } from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
const Login = () => {
  const [username, setusername] = useState<string>("");
  const [usernameError, setusernameError] = useState<boolean>(false);
  const [usernameMessage, setusernameMessage] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [showPassword, setShowPassword] = React.useState(false);

  const validateusername = (e: any) => {
    setusername(e.target.value);
  };
  const validatePassword = (e: any) => {
    setPassword(e.target.value);
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleLogin = () => {
    if (!username) {
      setusernameError(true);
      setusernameMessage("plese enter username");
    } else if (!password) {
      setPasswordError(true);
      setPasswordMessage("Please enter password");
    } else {
      axios
        .post(
          `https://reacttestprojectapi.azurewebsites.net/api/UserManagement/AuthenticateUser?UserName=${username}&Password=${password}`
        )
        .then((res) => {
          if (res.status === 200) {
            let authToken = res.data.authToken;
            localStorage.setItem("authToken", authToken);
            window.location.reload();
            toast.success("User Logged in");
          } else {
          }
        })
        .catch((error) => {
          toast.error(error.response.data);
        });
    }
  };
  return (
    <LoginContainer>
      <Grid container>
        <Grid item xs={0} sm={0} md={6} lg={6}>
          <Box className="loginLogoContainer">
            <img src={LoginLogo} alt="" className="loginLogoImg" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Box className="loginRightContainer">
            <Typography variant="h2" className="loginHeading">
              Login
            </Typography>
            <Box className="loginFormContainer" onSubmit={handleLogin}>
              <TextField
                required
                placeholder="Enter your username"
                helperText={usernameMessage}
                error={usernameError}
                fullWidth
                // value={username}
                onChange={validateusername}
              />
              <TextField
                required
                placeholder="Enter your password"
                helperText={passwordMessage}
                error={passwordError}
                fullWidth
                value={password}
                onChange={validatePassword}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: showPassword ? (
                    <VisibilityOff onClick={handleShowPassword} />
                  ) : (
                    <Visibility onClick={handleShowPassword} />
                  ),
                }}
              />
              <Button type="submit" variant="contained" onClick={handleLogin}>
                Submit
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </LoginContainer>
  );
};
const LoginContainer = styled(Box)({
  "& .loginHeading": {
    fontWeight: 700,
    fontFamily: "poppins",
    padding: "20px 0px ",
  },
  "& .loginLogoContainer": {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  "& .loginLogoImg": {
    width: "100%",
    height: "100%",
  },
  "& .loginFormContainer": {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
  },
  "& .loginRightContainer": {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "0px 100px",
  },
});
export default Login;
