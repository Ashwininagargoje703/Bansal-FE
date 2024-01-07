import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Link } from "@mui/material";
import { AccountCircle, ExitToApp } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, handleLogout } = useContext(AuthContext);

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handlehome = () => {
    window.location.href = "/";
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#414042" }}>
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ color: "white", letterSpacing: 4 }}
          onClick={handlehome}
        >
          Bansal Analytics
        </Typography>
        {user ? (
          <>
            <Typography variant="h6" sx={{ color: "white" }}>
              Welcome, {user.name}
            </Typography>
            <Button
              color="inherit"
              startIcon={<ExitToApp />}
              sx={{ color: "white" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            color="inherit"
            startIcon={<AccountCircle />}
            sx={{ color: "white" }}
            onClick={handleLogin}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
