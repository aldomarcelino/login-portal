import { useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { Button, TextField } from "components/elements";
import { Eye, EyeOff } from "lucide-react";
import { Colors } from "styles/theme/color";
import { setLocalStorage } from "utils/local-storage";
import { useNavigate } from "react-router";
import AskingVerifyLinkModal from "./verification-model";

const LoginPage = () => {
  const navigate = useNavigate();
  // Initialize State
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsloading] = useState(false);
  const [message, setMessage] = useState("");

  // Event on change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Handle hit Login button
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/auth/login`,
        form
      );

      setLocalStorage("access_token", response.data?.access_token);
      setLocalStorage("full_name", response.data?.user.full_name);
      setLocalStorage("email", response.data?.user.email);
      setLoading(false);
      navigate("/");
    } catch (e: any) {
      setLoading(false);
      setShowModal(e.response?.status === 403);
      setError(e.response && e.response.data && e.response.data.message);
    }
  };

  // Handle Resend Email Verification
  const handleResendEmail = async () => {
    setIsloading(true);
    setError("");
    try {
      await axios.get(
        `${process.env.REACT_APP_API_SERVER}/email/verification`,
        { params: { email: form.email } }
      );

      setMessage(
        "The verification link has been successfully sent, please check your email"
      );
      setIsloading(false);
    } catch (e: any) {
      setIsloading(false);
      setShowModal(false);
      setError(e.response && e.response.data && e.response.data.message);
    }
  };

  return (
    <>
      <Box maxWidth="40%" margin="auto" padding="74px 0px">
        <Box textAlign="center" sx={{ cursor: "pointer" }}>
          <Box
            position="relative"
            sx={{ height: "114px", width: "100%", marginBottom: "23px" }}
          >
            <img
              alt="logo-wellness"
              src="/logo_transparent.png"
              style={{ objectFit: "contain" }}
              height="100%"
            />
          </Box>
        </Box>
        <Box
          padding="48px 74px"
          borderRadius="25px"
          sx={{
            backgroundColor: Colors.white,
            boxShadow: Colors.shadowDark,
          }}
        >
          <Typography variant="h3" fontSize="28px" fontWeight={700}>
            Login
          </Typography>
          <Typography marginBottom="24px" fontWeight={300}>
            Don't have an account yet?{" "}
            <span>
              <a href="/register" style={{ color: Colors.blue100 }}>
                Create an account
              </a>
            </span>
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              value={form.email}
              name="email"
              label="Email"
              type="email"
              handleChange={handleChange}
              placeholder="aldo.marcelino@mailinator.com"
              width="100%"
            />
            <Box marginTop="24px">
              <TextField
                value={form.password}
                name="password"
                label="Password"
                type={showPass ? "text" : "password"}
                placeholder="••••"
                width="100%"
                handleChange={handleChange}
                endAdornment={
                  <Box
                    sx={{ margin: "0px 12px", cursor: "pointer" }}
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <Eye /> : <EyeOff />}
                  </Box>
                }
              />
            </Box>

            <Typography
              variant="h3"
              fontSize="16px"
              color={Colors.blue100}
              textAlign="center"
              marginTop="24px"
              marginBottom="32px"
            >
              Forgot Password
            </Typography>

            <Box display="flex" flexDirection="column" justifyContent="center">
              <Typography
                variant="body2"
                color={Colors.red100}
                marginBottom="8px"
                textAlign="center"
              >
                {error}
              </Typography>
              <Button
                label={loading ? "Loading..." : "Login"}
                buttontype="primary"
                padding="15px 132px"
                submit
              />
            </Box>
          </form>
        </Box>
      </Box>
      {/* Asking to send Verification link modal */}
      <AskingVerifyLinkModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setMessage("");
        }}
        handleClick={handleResendEmail}
        loading={isLoading}
        message={message}
      />
    </>
  );
};

export default LoginPage;
