import { useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { Button, TextField } from "components/elements";
import { Colors } from "styles/theme/color";
import { useNavigate } from "react-router";
import { CircleAlert } from "lucide-react";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  // Initialize State
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "" });

  // Event on change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Handle hit Login button
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.email) {
      setError("Email is Required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${process.env.REACT_APP_API_SERVER}/auth/forgot-password`,
        form
      );

      setIsSent(true);
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
          Reset Password
        </Typography>
        <Typography marginBottom="24px" fontWeight={300}>
          Please enter your e-mail address. We will send a link to that e-mail
          address
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

          {isSent && (
            <Box
              display="flex"
              gap="13px"
              bgcolor={Colors.lightBlue100}
              padding="16px"
              marginTop="32px"
              borderRadius="20px"
            >
              <CircleAlert size={32} color={Colors.blue100} />
              <Typography
                fontWeight={300}
                fontSize={13}
                color={Colors.darkGrey}
              >
                The link has been successfully sent to your email. If you don't
                find the email, try checking your spam folder or try sending the
                link again.
              </Typography>
            </Box>
          )}

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
          <Typography
            variant="h3"
            fontSize="16px"
            color={Colors.blue100}
            textAlign="center"
            marginTop="24px"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Typography>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
