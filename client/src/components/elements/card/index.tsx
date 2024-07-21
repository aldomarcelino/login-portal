import React from "react";
import { Box, Typography } from "@mui/material";
import { Colors } from "styles/theme/color";
import { UserTypes } from "store/types";
import moment from "moment";

interface CardProps {
  data: UserTypes;
  handleClick: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
}

const UserCard: React.FC<CardProps> = ({
  data,
  handleClick,
  handleEdit,
  handleDelete,
}) => {
  const handleShowStatus = (status: boolean) => {
    let color = Colors.green100;
    if (!status) color = Colors.red100;
    return (
      <Box
        border={`1px solid ${color}`}
        padding="4px 9px"
        marginTop="14px"
        borderRadius="9px"
      >
        <Typography variant="body2" color={color} textAlign="center">
          {status ? "User is logging in" : "The user has logged out"}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      bgcolor={Colors.white}
      boxShadow={Colors.shadowSecond}
      borderRadius="20px"
      onClick={handleClick}
    >
      <Box width="100%" borderRadius="20px" maxWidth="262px" minWidth="255px">
        <img
          alt="user-image"
          src={data.image_url}
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
        />
      </Box>

      <Box padding="16px">
        <Box width="220px">
          <Typography
            fontSize="21px"
            fontWeight={600}
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
          >
            {data.full_name}
          </Typography>
        </Box>
        <Typography
          marginTop="4px"
          fontSize="12px"
        >{`Email: ${data.email}`}</Typography>
        <Typography fontSize="12px">{`Phone: ${data.phone_number}`}</Typography>
        <Typography fontSize="12px">{`Login Count: ${data.login_count}`}</Typography>
        <Typography fontSize="12px">{`Sign Up On: ${moment(
          data.createdAt
        ).format("DD MMM YYYY, HH:mm")}`}</Typography>
        <Typography fontSize="12px">{`Log Out On: ${
          !data.is_login
            ? moment(data.updatedAt).format("DD MMM YYYY, HH:mm")
            : "-"
        }`}</Typography>
        {handleShowStatus(data.is_login)}
      </Box>
    </Box>
  );
};

export default UserCard;
