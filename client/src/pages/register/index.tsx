import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import { Button, TextField } from "components/elements";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Colors } from "styles/theme/color";
import { setLocalStorage } from "utils/local-storage";
import { password, phoneNumber } from "utils/validation-form";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const RegisterPage = () => {
  const navigate = useNavigate();
  // Initialize State
  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [isActive, setIsActive] = useState(false);

  // Event on change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Handle hit Login button
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validation
    const errorPhone = phoneNumber(form.phone);
    const errorPass = password(form.password);
    if (errorPhone || errorPass || form.password !== form.confirmPassword) {
      setError(errorPhone || errorPass || "Password not match!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const formData = {
        name: form.name,
        email: form.email,
        phone: `+62${form.phone}`,
        password: form.password,
      };
      const response = await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status) {
        navigate("/");
        setLocalStorage("user_name", response.data.name);
      }

      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      setError(e.response && e.response.data && e.response.data.message);
    }
  };

  useEffect(() => {
    setIsActive(Object.values(form).every((val) => val !== ""));
  }, [form]);

  return (
    <Box
      height="100vh"
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box width="65%" margin="auto">
        <Box
          textAlign="center"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <Box
            position="relative"
            sx={{ height: "64px", width: "100%", marginBottom: "23px" }}
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
            Register
          </Typography>
          <Typography marginBottom="24px" fontWeight={300}>
            Crate your Profile Portal account, it's fast, easy and free!
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container>
              <Grid item md={6} paddingRight="14px">
                <TextField
                  value={form.name}
                  name="name"
                  label="Full Name"
                  handleChange={handleChange}
                  placeholder="Aldo Marcelino"
                  width="100%"
                />
                <Box margin="24px 0px">
                  <TextField
                    value={form.email}
                    name="email"
                    label="Email"
                    type="email"
                    handleChange={handleChange}
                    placeholder="aldo.marcelino@mailinator.com"
                    width="100%"
                  />
                </Box>
                <TextField
                  value={form.phone}
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  handleChange={handleChange}
                  placeholder="82267559092"
                  width="100%"
                  startAdornment={
                    <Box padding="0px 12px">
                      <Typography>+62</Typography>
                    </Box>
                  }
                />
              </Grid>
              <Grid item md={6} paddingLeft="14px">
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

                <Box marginTop="24px">
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
                </Box>
              </Grid>
            </Grid>

            <Typography
              variant="h3"
              fontSize="16px"
              textAlign="center"
              margin="32px 0px 24px"
              fontWeight={300}
            >
              Already have an account?{" "}
              <a
                href="/login"
                style={{ color: Colors.blue100, fontWeight: 400 }}
              >
                Login
              </a>
            </Typography>

            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography
                variant="body2"
                color={Colors.red100}
                marginBottom="8px"
                textAlign="center"
              >
                {error}
              </Typography>
              <Button
                label={loading ? "Loading..." : "Submit"}
                buttontype="primary"
                padding="15px 132px"
                disabled={!isActive}
                submit
              />
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
