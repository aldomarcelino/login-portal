import React from "react";
import { createBrowserRouter, redirect } from "react-router-dom";
import Layout from "components/template";
import LoginPage from "pages/login";
import RegisterPage from "pages/register";
import { getLocalStorage } from "utils/local-storage";
import Dashboard from "pages/dashboard";
import VerficationPage from "pages/verification";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    loader: () => {
      if (!getLocalStorage("access_token")) throw redirect("/login");
      return null;
    },
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: () => {
      if (getLocalStorage("access_token")) throw redirect("/");
      return null;
    },
  },
  {
    path: "/verify/:token",
    element: <VerficationPage />,
    loader: () => {
      if (getLocalStorage("access_token")) throw redirect("/");
      return null;
    },
  },
  {
    path: "/register",
    element: <RegisterPage />,
    loader: () => {
      if (getLocalStorage("access_token")) throw redirect("/");
      return null;
    },
  },
]);

export default router;
