import React from "react";
import { Box, Typography } from "@mui/material";
import { Colors } from "styles/theme/color";
import { UserTypes } from "store/types";
import { Pen, Trash2 } from "lucide-react";

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
          src={data.imageUrl}
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
        <Box display="flex" gap="7px" justifyContent="end" alignItems="center">
          <Pen
            size={17}
            color={Colors.darkBlue}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            data-testid="edit-icon"
          />
          <Trash2
            size={17}
            color={Colors.red100}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            data-testid="delete-icon"
          />
        </Box>
        <Box width="220px">
          <Typography
            fontSize="21px"
            fontWeight={600}
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
          >
            {data.name}
          </Typography>
        </Box>
        <Typography
          marginTop="4px"
          fontSize="12px"
        >{`Email: ${data.email}`}</Typography>
        <Typography fontSize="12px">{`Phone: ${data.phone}`}</Typography>
        <Typography fontSize="12px">{`Company: ${data.company.name}`}</Typography>
        <Box
          bgcolor={Colors.darkBlue}
          padding="4px 9px"
          marginTop="14px"
          borderRadius="9px"
          onClick={(e) => e.stopPropagation()}
        >
          <a href={"https://" + data.website} target="_blank">
            <Typography color={Colors.blue} textAlign="center">
              About User ➟
            </Typography>
          </a>
        </Box>
      </Box>
    </Box>
  );
};

export default UserCard;
