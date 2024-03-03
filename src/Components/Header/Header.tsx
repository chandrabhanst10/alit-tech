import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { styled } from "styled-components";
import LogoutIcon from "@mui/icons-material/Logout";
const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate(0);
    await localStorage.clear();
  };
  return (
    <HeaderContainer>
      <AppBar>
        <Toolbar>
          <Typography sx={{ flex: 1 }}>Logo</Typography>
          <Box>
            <ul className="menuList">
              <li className="headerItem">
                <Link to={"/customerList"} className="btn">
                  Customer List
                </Link>
              </li>
              <li className="headerItem">
                <Link to={"/billingList"} className="btn">
                  Billing List
                </Link>
              </li>
              <li className="headerItem">
                <Tooltip title="Logout" arrow>
                  <IconButton onClick={handleLogout}>
                    <LogoutIcon className="logoutBtn" />
                  </IconButton>
                </Tooltip>
              </li>
            </ul>
          </Box>
        </Toolbar>
      </AppBar>
    </HeaderContainer>
  );
};
const HeaderContainer = styled(Box)({
  "& .btn": {
    textDecoration: "none",
    color: "#fff",
    margin: "0px 20px",
  },
  "& .menuList": {
    listStyle: "none",
    display: "flex",
  },
  "& .headerItem": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  "& .logoutBtn": {
    color: "#fff",
  },
});
export default Header;
