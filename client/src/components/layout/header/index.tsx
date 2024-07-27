import React, { useState } from "react";
import { AppBar, Box, Container, Grid, Typography } from "@mui/material";
import { Colors } from "styles/theme/color";
import { getLocalStorage } from "utils/local-storage";
import { ChevronDown, Power } from "lucide-react";
import { Menu } from "components/elements";
import { logout } from "store/action";

const Header = () => {
  // Initialize state
  const [loading, setLoading] = useState(false);

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
          <Grid item xs={10}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <img
                src="/logo.png"
                alt="user-portal-logo"
                style={{ objectFit: "cover", height: "64px" }}
              />
              <Box display="flex" alignItems="center" gap={5}>
                <Typography fontSize={24}>{`Hi, ${
                  getLocalStorage("full_name") || ""
                }`}</Typography>
                <Menu
                  width="240px"
                  buttonBase={<ChevronDown style={{ cursor: "pointer" }} />}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    padding="21px 0px"
                  >
                    <img
                      alt="user-profile"
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      style={{
                        height: 64,
                        width: 64,
                        borderRadius: 64,
                        objectFit: "cover",
                        border: `1px solid ${Colors.darkGrey}`,
                      }}
                    />
                    <Typography
                      fontSize={22}
                      fontWeight={300}
                      lineHeight="22px"
                      marginTop="9px"
                    >
                      {getLocalStorage("full_name") || "Aldo Marcelino"}
                    </Typography>
                    <Typography
                      fontSize={14}
                      fontWeight={300}
                      color={Colors.darkGrey}
                    >
                      {getLocalStorage("email") || "aldomarcelino@gmail.com"}
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      borderRadius="11px"
                      padding="4px 19px"
                      gap="5px"
                      marginTop="24px"
                      color={Colors.red100}
                      sx={{
                        transition: "0.5s all ease",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: Colors.red100,
                          color: Colors.white,
                        },
                      }}
                      onClick={() => {
                        logout();
                        setLoading(true);
                        setTimeout(() => {
                          setLoading(false);
                        }, 1000);
                      }}
                    >
                      <Power size={17} />
                      <Typography fontSize={15}>
                        {loading ? "Logging out..." : "Log Out"}
                      </Typography>
                    </Box>
                  </Box>
                </Menu>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </AppBar>
    </Container>
  );
};

export default Header;
