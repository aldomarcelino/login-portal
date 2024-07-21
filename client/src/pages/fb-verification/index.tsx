import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setLocalStorage } from "utils/local-storage";

const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const full_name = urlParams.get("full_name");
    const email = urlParams.get("email");

    if (token) {
      setLocalStorage("access_token", token);
      setLocalStorage("full_name", full_name!);
      setLocalStorage("email", email!);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default AuthRedirect;
