import { useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { Button, TextField } from "components/elements";
import { Colors } from "styles/theme/color";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { password } from "utils/validation-form";
import { useSearchParams } from "react-router-dom";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  // Initialize State
  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ password: "", confirmPassword: "" });

  // Event on change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Handle hit Login button
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validation
    const errorPass = password(form.password);
    if (errorPass || form.password !== form.confirmPassword) {
      setError(errorPass || "Password not match!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${process.env.REACT_APP_API_SERVER}/auth/change-password`,
        {
          password: form.password,
          token,
        }
      );

      setIsSuccess(true);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);

      setError(e.response && e.response.data && e.response.data.message);
    }
  };

  return (
    <Box maxWidth="39%" margin="auto" padding="74px 0px">
      <Box textAlign="center" sx={{ cursor: "pointer" }}>
        <Box
          position="relative"
          sx={{ height: "94px", width: "100%", marginBottom: "12px" }}
        >
          <img
            alt="logo-wellness"
            src="/logo_transparent.png"
            style={{ objectFit: "contain" }}
            height="100%"
            onClick={() => navigate("/login")}
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
        {!isSuccess ? (
          <>
            <Typography variant="h3" fontSize="28px" fontWeight={700}>
              Create a New Password
            </Typography>
            <Typography marginBottom="24px" fontWeight={300}>
              You will use this password as login access to your Profile Portal
              account.
            </Typography>
            <form onSubmit={handleSubmit}>
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
              <Typography
                variant="body2"
                color={Colors.darkGrey}
                marginTop="8px"
                marginBottom="17px"
              >
                The password must contain min 8 characters, lowercase and
                uppercase letters, numbers and also symbols (!@#$%^&*,.?)
              </Typography>

              <TextField
                value={form.confirmPassword}
                name="confirmPassword"
                label="Confirm Password"
                type={showConPass ? "text" : "password"}
                placeholder="••••"
                width="100%"
                handleChange={handleChange}
                endAdornment={
                  <Box
                    sx={{ margin: "0px 12px", cursor: "pointer" }}
                    onClick={() => setShowConPass(!showConPass)}
                  >
                    {showConPass ? <Eye /> : <EyeOff />}
                  </Box>
                }
              />

              <Box
                marginTop="32px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Typography
                  variant="body2"
                  color={Colors.red100}
                  marginBottom="8px"
                  textAlign="center"
                >
                  {error}
                </Typography>
                <Button
                  label={loading ? "Loading..." : "Send Link"}
                  buttontype="primary"
                  padding="15px 132px"
                  submit
                />
              </Box>
            </form>
          </>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <img
              alt="logo-wellness"
              src="/verified-success.png"
              style={{ objectFit: "contain" }}
              height="200px"
            />
            <Typography
              variant="h3"
              fontSize="20px"
              fontWeight={700}
              marginTop="13px"
            >
              Congratulation! Your password has been successfully changed
            </Typography>
            <Typography marginBottom="24px" fontWeight={300} marginTop="17px">
              Now you can start monitoring profile again
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChangePasswordPage;
