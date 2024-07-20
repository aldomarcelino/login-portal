// theme.d.ts
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    mobile: true;
    mobile2: true;
    mobile3: true;
    tablet: true;
    laptop: true;
    laptop2: true;
    desktop: true;
  }
}
