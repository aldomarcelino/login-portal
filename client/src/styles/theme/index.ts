import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0, // MUI default
      sm: 600, // MUI default
      md: 960, // MUI default
      lg: 1280, // MUI default
      xl: 1920, // MUI default
      mobile: 0,
      mobile2: 376,
      mobile3: 426,
      tablet: 600,
      laptop: 960,
      laptop2: 1280,
      desktop: 1440,
    },
  },
});

export default theme;
