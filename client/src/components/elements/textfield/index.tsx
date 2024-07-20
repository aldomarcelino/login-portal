import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { TextField, Typography } from "@mui/material";
import { Colors } from "styles/theme/color";

interface TextFieldProps {
  width: string;
  padding: string;
  endadornment: React.ReactNode;
  startadornment: React.ReactNode;
}

interface CustomTextFieldProps {
  type?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  errors?: any;
  width?: string;
  padding?: string;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  maxLength?: number;
  value?: any;
  name?: string;
}

const Component = React.memo(
  styled(TextField)<TextFieldProps>(
    ({ width, padding, endadornment, startadornment }) => `
      width: ${width};
      border-radius: 10px;
      margin-top: 8px !important;
  
      & ::before,
      & ::after {
        border: 0px !important;
        transition-duration: 0s;
      }
      & .MuiFilledInput {
        &-root {
          background-color: ${
            endadornment ? Colors.greySecond : "transparent !important"
          };
          padding-right: ${endadornment && "0px"};
          padding-left: ${startadornment && "0px"};
          border: 1px solid ${Colors.greySecond};
          border-radius: 16px;
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number] {
            -moz-appearance: textfield;
          }
  
          &.Mui-error {
            border: 1px solid ${Colors.red100};
          }
  
          &:hover {
            background-color: ${endadornment && Colors.greySecond};
          }
  
          &.Mui-disabled {
            background-color: ${Colors.greySecond} !important;
          }
        }
        &-input {
          color: ${Colors.darkBlue};
          background-color: ${Colors.greySecond};
          border-radius: 16px;
          padding: ${padding};
          border: ${!endadornment && `1px solid ${Colors.greySecond}`};
          border-top-left-radius: ${startadornment ? "0px" : "16px"} !important;
          border-bottom-left-radius: ${
            startadornment ? "0px" : "16px"
          } !important;
          border-top-left-radius:  16px;
          border-bottom-left-radius: 16px;
  
  
          &.Mui-disabled {
            opacity: 0.8;
          }
  
          &.MuiSelect-select {
            background-color: ${Colors.white};
          }
        }
      }
  
      & .MuiInputLabel {
        &-root {
          top: 0px;
          left: 4px;
          color: ${Colors.darkGrey};
          font-size: 16px;
          font-weight: 100;
          line-height: 24px;
          letter-spacing: 1.2px;
          &.Mui-error {
            color: ${Colors.red100};
          }
        }
        &-shrink {
          display: none;
        }
      }
  
      & .Mui-focused {
        border: ${`1px solid ${Colors.blue100}`};
        border-radius: 16px !important;
  
        & .MuiFilledInput-input {
          background-color: ${Colors.white};
          box-shadow: 0px 10px 40px rgba(164, 149, 107, 0.1);
          border-left: ${startadornment && "0px !important"};
          border-top-left-radius: ${startadornment && "0px !important"};
          border-bottom-left-radius: ${startadornment && "0px !important"};
          border-top-right-radius: ${endadornment && "0px !important"};
          border-bottom-right-radius: ${endadornment && "0px !important"};
        }
  
        & .MuiSelect-select {
          border: 0px;
          border: 1px solid ${Colors.blue100};
          border-top-left-radius: ${startadornment && "16px !important"};
          border-bottom-left-radius: ${startadornment && "16px !important"};
        }
      }
    `
  )
);

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  type = "text",
  label,
  placeholder,
  disabled,
  errors,
  width = "200px",
  padding = "16px",
  endAdornment,
  startAdornment,
  handleChange,
  onClick,
  onBlur,
  maxLength,
  value,
  name,
}) => {
  return (
    <>
      {label && (
        <Typography variant="body2" color={Colors.darkGrey}>
          {label}
        </Typography>
      )}
      <Component
        value={value}
        name={name}
        type={type}
        variant="filled"
        label={placeholder}
        error={errors}
        disabled={disabled}
        onChange={handleChange}
        onClick={onClick}
        onBlur={onBlur}
        inputProps={{ maxLength: maxLength }}
        InputProps={{
          endAdornment,
          startAdornment,
        }}
        width={width}
        padding={padding}
        endadornment={endAdornment}
        startadornment={startAdornment}
      />
    </>
  );
};

export default CustomTextField;
