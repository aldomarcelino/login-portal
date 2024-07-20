import React from "react";
import { createBrowserRouter, redirect } from "react-router-dom";
import Layout from "components/template";
import LoginPage from "pages/login";
import RegisterPage from "pages/register";
// import SignIn from "components/SignIn";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    loader: () => {
      if (!localStorage.getItem("access_token")) throw redirect("/login");
      return null;
    },
    children: [
      {
        path: "/",
        element: <div>Home Page</div>,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: () => {
      if (localStorage.getItem("access_token")) throw redirect("/");
      return null;
    },
  },
  {
    path: "/register",
    element: <RegisterPage />,
    loader: () => {
      if (localStorage.getItem("access_token")) throw redirect("/");
      return null;
    },
  },
]);

export default router;
