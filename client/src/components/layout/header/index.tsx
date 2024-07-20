import React from "react";
import { AppBar, Container, Grid } from "@mui/material";
import { Colors } from "styles/theme/color";

const Header = () => {
  return (
    <Container fixed={true} maxWidth={"lg"}>
      <AppBar
        color="inherit"
        position="fixed"
        sx={{
          zIndex: 2,
          boxShadow: Colors.shadow,
        }}
      >
        <Grid container spacing={0}>
          <Grid item xs={1} />
          <Grid item xs={3}>
            <img
              src="/logo.png"
              alt="user-portal-logo"
              style={{ objectFit: "cover", height: "64px" }}
            />
          </Grid>
        </Grid>
      </AppBar>
    </Container>
  );
};

export default Header;
