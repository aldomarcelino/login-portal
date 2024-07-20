import React, { useState } from "react";
import { Box, Modal, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { Colors } from "styles/theme/color";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "hooks";
import { selectUserList, setUserList } from "store/reducer/user-profile";
import { toastSuccess } from "utils/toast-message";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  id: number;
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

const VerificationModal: React.FC<ModalProps> = ({ open, onClose, id }) => {
  const dispatch = useAppDispatch();
  // Initialize State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Data from global state
  const data = useAppSelector(selectUserList);

  // Clear state handler
  const handleCancel = () => {
    setError("");
    setLoading(false);
    onClose();
  };

  // Handle create event form
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const temp = data?.filter((val) => val.id !== id);
    setTimeout(() => {
      dispatch(setUserList(temp));
      toastSuccess("Deleted Succesfully.");
      handleCancel();
    }, 1000);
  };

  return (
    <Modal open={open} aria-labelledby="modal-verify-action">
      <Component width="544px" padding="32px">
        <Box position="relative">
          <Box
            position="absolute"
            right="0"
            top="0"
            zIndex="1"
            style={{ cursor: "pointer" }}
            onClick={handleCancel}
          >
            <X size={24} />
          </Box>
        </Box>

        <Typography variant="h3" fontWeight={600} fontSize="32px">
          Are You Sure ?
        </Typography>
        <Typography variant="body2" marginBottom="40px">
          {`By clicking the button below  you will 'Delete' this user.`}
        </Typography>

        <Typography
          variant="body2"
          color={Colors.red100}
          margin="8px 0px"
          textAlign="center"
        >
          {error}
        </Typography>

        <Box justifyContent="center" marginTop="24px">
          <Box
            display="flex"
            padding="13px"
            justifyContent="center"
            borderRadius="11px"
            width="100%"
            sx={{
              backgroundColor: Colors.red100,
              color: Colors.white,
              cursor: "pointer",
              "&:hover": {
                opacity: 0.9,
              },
            }}
            onClick={handleSubmit}
          >
            <Typography>{loading ? "Loading..." : "Delete"}</Typography>
          </Box>
        </Box>
      </Component>
    </Modal>
  );
};

export default VerificationModal;
