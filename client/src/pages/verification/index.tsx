import { useEffect, useState } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import axios from "axios";
import { Colors } from "styles/theme/color";
import { setLocalStorage } from "utils/local-storage";
import { useNavigate, useParams } from "react-router";
import { CircleAlert } from "lucide-react";

const VerficationPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  // Initialize State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFiled, setIsFiled] = useState(false);

  // Handle hit Login button
  const handleVerification = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/auth/verify/${token}`
      );

      setLocalStorage("access_token", response.data?.access_token);
      setLocalStorage("full_name", response.data?.user.full_name);
      setLocalStorage("email", response.data?.user.email);
      setLoading(false);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (e: any) {
      setIsFiled(true);
      setLoading(false);
      setError(e.response && e.response.data && e.response.data.message);
    }
  };

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <>
      <Box
        position="relative"
        paddingLeft="84px"
        sx={{ height: "64px", width: "100%", marginBottom: "23px" }}
      >
        <img
          onClick={() => navigate("/login")}
          alt="logo-wellness"
          src="/logo_transparent.png"
          style={{ objectFit: "contain" }}
          height="100%"
        />
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <Skeleton sx={{ width: "40%", height: "600px" }} />
        </Box>
      ) : (
        <Box maxWidth="40%" margin="auto" padding="74px 0px">
          <Box
            padding="48px 74px"
            borderRadius="25px"
            display="flex"
            alignItems="center"
            flexDirection="column"
            sx={{
              backgroundColor: Colors.white,
              boxShadow: Colors.shadowDark,
            }}
          >
            {!isFiled ? (
              <>
                <img
                  alt="logo-wellness"
                  src="/verified-success.png"
                  style={{ objectFit: "contain" }}
                  height="200px"
                />

                <Typography
                  variant="h3"
                  fontSize="28px"
                  fontWeight={700}
                  textAlign="center"
                >
                  Cungatulation Your Account Successfully Verified
                </Typography>

                <Typography textAlign="center" marginTop="18px">
                  You Will Be redirect Outomaticly in 2s.
                </Typography>
              </>
            ) : (
              <>
                <CircleAlert size={42} color={Colors.red100} />
                <Typography
                  variant="h3"
                  fontSize="28px"
                  fontWeight={700}
                  textAlign="center"
                >
                  Verification Failed
                </Typography>
              </>
            )}
          </Box>
        </Box>
      )}
      <Typography
        variant="body2"
        color={Colors.red100}
        marginBottom="8px"
        textAlign="center"
      >
        {error}
      </Typography>
    </>
  );
};

export default VerficationPage;
