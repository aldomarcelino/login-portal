import React from "react";
import { Box, Modal, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { Colors } from "styles/theme/color";
import { CircleAlert, MailCheck, X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  handleClick: () => void;
  loading: boolean;
  message?: string;
}

const Component = styled(Box)(
  ({ width, padding }) => `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${width};
  background-color: ${Colors.white};
  box-shadow: 0px 10px 40px rgba(164, 149, 107, 0.1);
  padding: ${padding};
  border-radius: 20px;
  outline: none;
`
);

const AskingVerifyLinkModal: React.FC<ModalProps> = ({
  open,
  onClose,
  handleClick,
  loading,
  message,
}) => {
  return (
    <Modal open={open} aria-labelledby="modal-verify-event">
      <Component width="544px" padding="32px">
        <Box position="relative">
          <Box
            position="absolute"
            right="0"
            top="0"
            zIndex="1"
            style={{ cursor: "pointer" }}
            onClick={onClose}
          >
            <X size={24} />
          </Box>
        </Box>
        {message ? (
          <Box display="flex" flexDirection="column" alignItems="center">
            <MailCheck size={32} color={Colors.green100} />
            <Typography textAlign="center" marginTop="12px">
              {message}
            </Typography>
          </Box>
        ) : (
          <>
            {" "}
            <Box display="flex" justifyContent="center">
              <CircleAlert size={38} color={Colors.yellow100} />
            </Box>
            <Typography
              variant="h3"
              fontWeight={600}
              fontSize="32px"
              textAlign="center"
            >
              Verify Your Account First
            </Typography>
            <Typography
              variant="body2"
              marginTop="24px"
              marginBottom="40px"
              textAlign="center"
            >
              We've sent a verification link to your email. Please check your
              inbox to verify your account. If you haven't received it, check
              your spam folder or click below to resend the email.
            </Typography>
            <Box display="flex" justifyContent="center" marginTop="24px">
              <Box
                display="flex"
                padding="13px"
                justifyContent="center"
                borderRadius="11px"
                width="230px"
                sx={{
                  backgroundColor: Colors.darkBlue,
                  color: Colors.white,
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
                onClick={handleClick}
              >
                <Typography>
                  {loading ? "Loading..." : "Resend Email Verification"}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Component>
    </Modal>
  );
};

export default AskingVerifyLinkModal;
