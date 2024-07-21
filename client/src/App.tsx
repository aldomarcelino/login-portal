import React from "react";
import { ThemeProvider } from "@mui/material";
import { Provider as ReduxProvider } from "react-redux";
import theme from "styles/theme";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { store } from "./store";
import router from "./router";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
          <RouterProvider router={router} />
          <ToastContainer />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default App;
