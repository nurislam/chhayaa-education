"use client";
import { useMeQuery } from "@/data/user/use-me.query";
import {
  AppBar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import { MouseEvent } from "react";
import LogoSmall from "@public/logo.png";
import Image from "next/image";

import { useState } from "react";
import Link from "next/link";

const drawerWidth = 0;
const appBarBgColor = "#E1ECFF";

const AdminHeader = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data } = useMeQuery();

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        bgcolor: appBarBgColor,
        flexDirection: "row",
        placeContent: "space-between",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#E1ECFF",
        }}
      >
        <Link
          href="/admin/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "#FFF",
          }}
        >
          <Image src={LogoSmall} alt="Logo" height={45} />
          {/* <Typography variant="h6" sx={{ ml: 1, fontWeight: "bold" }}>
          CMS
        </Typography> */}
        </Link>
      </Toolbar>

      <Toolbar sx={{ gap: 2 }}>
        {/* TODO: Add User Profile Menu */}
        <span style={{ color: "#000" }}>
          {data?.firstName} {data?.lastName}
        </span>
        <IconButton onClick={handleMenuOpen} sx={{ p: 0, width: "50" }}>
          <Avatar alt="User" src="/icon.png" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          sx={{ mt: 1 }}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/logout">Logout</Link>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
