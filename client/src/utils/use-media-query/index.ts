import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";

type Breakpoints = {
  [key: string]: number;
};

type Viewport = {
  [key: string]: boolean;
};

const useResponsive = (): Viewport => {
  const theme = useTheme();
  const breakpoints: Breakpoints = theme.breakpoints.values;

  const initializeViewport = (): Viewport => {
    return Object.keys(breakpoints).reduce((acc, breakpoint) => {
      acc[breakpoint] = true;
      return acc;
    }, {} as Viewport);
  };

  const [viewport, setViewport] = useState<Viewport>(initializeViewport);

  const calculateViewport = (): Viewport => {
    return Object.keys(breakpoints).reduce((acc, breakpoint) => {
      acc[breakpoint] = window.matchMedia(
        `(min-width: ${breakpoints[breakpoint]}px)`
      ).matches;
      return acc;
    }, {} as Viewport);
  };

  useEffect(() => {
    const handleResize = () => {
      setViewport(calculateViewport());
    };

    if (typeof window !== "undefined") {
      setViewport(calculateViewport());

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [breakpoints]);

  return viewport;
};

export default useResponsive;
