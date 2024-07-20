import React from "react";
import Footer from "../layout/footer";
import Header from "../layout/header";
import { Outlet } from "react-router-dom";

const Primary = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Primary;
