import React from "react";
import { Button } from "@mui/material";
import styled from "@emotion/styled";
import { Colors } from "styles/theme/color";

interface CustomButtonProps {
  id?: string;
  buttontype?: "primary" | "secondary" | "text";
  submit?: boolean;
  label: string;
  height?: string;
  width?: string;
  fontSize?: string;
  margin?: string;
  padding?: string;
  borderradius?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const StyledButton = styled(Button)<CustomButtonProps>(
  ({ height, width, margin, padding, borderradius, fontSize, buttontype }) => `
    transition-duration: 0s;
    text-transform: none;
    height: ${height};
    width: ${width};
    margin: ${margin};
    padding: ${padding};
    border: ${
      buttontype === "secondary" ? `1px solid ${Colors.darkBlue}` : "none"
    };
    border-radius: ${borderradius || "20px"};
    font-weight: 700;
    font-size: ${fontSize};
    line-height: 130%;

    background: ${buttontype === "primary" ? Colors.darkBlue : Colors.white};
    color: ${buttontype === "primary" ? Colors.white : Colors.darkBlue};

    &:hover {
      background: ${
        buttontype === "primary" ? Colors.darkBlue80 : Colors.white
      };
    }

    &:active {
      background: ${
        buttontype === "primary" ? Colors.darkBlue : Colors.darkBlue40
      };
    }

    &:disabled {
      background: ${buttontype === "text" ? "transparent" : Colors.darkBlue20};
      border: none;
      opacity: 0.8;
      color: ${buttontype === "primary" ? Colors.white : Colors.darkBlue};
    }
  `
);

const CustomButton: React.FC<CustomButtonProps> = ({
  id,
  buttontype = "primary",
  submit,
  label,
  height,
  width,
  fontSize = "18px",
  margin,
  padding,
  borderradius,
  onClick,
  disabled,
  startIcon,
  endIcon,
  ...props
}) => {
  return (
    <StyledButton
      label="custom-button"
      id={id}
      type={submit ? "submit" : "button"}
      onClick={onClick}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      height={height}
      width={width}
      margin={margin}
      padding={padding}
      borderradius={borderradius}
      fontSize={fontSize}
      buttontype={buttontype}
      {...props}
    >
      {label}
    </StyledButton>
  );
};

export default CustomButton;
