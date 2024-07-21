import React from "react";
import { Box, Modal, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { Colors } from "styles/theme/color";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  clickLink: () => void;
  email: string;
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

const VerificationModal: React.FC<ModalProps> = ({
  open,
  onClose,
  email,
  clickLink,
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

        <Box display="flex" justifyContent="center">
          <img
            alt="logo-wellness"
            src="/verification.png"
            style={{ objectFit: "contain" }}
            height="240px"
          />
        </Box>

        <Typography
          variant="h3"
          fontWeight={600}
          fontSize="32px"
          textAlign="center"
        >
          Account Registered Successfully
        </Typography>
        <Typography
          variant="body2"
          marginTop="24px"
          marginBottom="40px"
          textAlign="center"
        >
          {`We have sent an email with a verification link to your email address,
          please check your email to verify your account '${email}'.`}
        </Typography>

        <Box display="flex" justifyContent="center" marginTop="24px">
          <Box
            display="flex"
            padding="13px"
            justifyContent="center"
            borderRadius="11px"
            width="200px"
            sx={{
              backgroundColor: Colors.darkBlue,
              color: Colors.white,
              cursor: "pointer",
              "&:hover": {
                opacity: 0.9,
              },
            }}
            onClick={clickLink}
          >
            <Typography> To Login page</Typography>
          </Box>
        </Box>
      </Component>
    </Modal>
  );
};

export default VerificationModal;
