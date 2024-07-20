import React, { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Colors } from "styles/theme/color";

export interface CustomSelectProps {
  data?: { id: string; name: string }[];
  value?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  handleChange?: (event: SelectChangeEvent<string>) => void;
  IconComponent?: React.ElementType;
  returnValue?: "id" | "name";
}

const StyledFormControl = styled(FormControl)<{ value: string }>(
  ({ value }) => `
    width: 100%;

    .MuiSelect-select {
      padding: 18px 17px 17px;
      color: ${value ? Colors.darkBlue : Colors.greySecond};
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
    }

    .MuiInputBase-formControl {
      margin-top: 8px;
      background-color: ${Colors.greySecond};
      border-radius: 16px;
      color: ${Colors.darkBlue};

      &.Mui-error {
        & .MuiOutlinedInput-notchedOutline {
          border: 1px solid ${Colors.red100};
        }
      }

      & .MuiOutlinedInput-notchedOutline {
        border: 0;
      }

      &.Mui-focused {
        background-color: ${Colors.white};
        border: 1px solid ${Colors.blue100};
      }
    }

    label {
        font-size: 16px;
        font-weight: 300;
        line-height: 24px;
        letter-spacing: 1.2px;
        color: ${Colors.darkGrey};
        transform-origin: unset;
        transition: none;
        max-width: 100%;
        transform: none;
        position: absolute;
        top: 45px;
        left: 16px;
        z-index: 1;
      }

  `
);

const CustomSelect: React.FC<CustomSelectProps> = React.memo(
  ({
    data,
    value: propValue = "",
    name,
    label,
    placeholder,
    disabled,
    error,
    handleChange,
    IconComponent,
    loading,
    returnValue = "id",
  }) => {
    const [state, setState] = useState(propValue);

    useEffect(() => {
      setState(propValue);
    }, [propValue]);

    // Memoize the event handler functions using useCallback
    const handleSelectChange = useCallback(
      (e: SelectChangeEvent<string>) => {
        const selectedValue = e.target.value;
        if (handleChange) handleChange(e);
        setState(selectedValue);
      },
      [handleChange]
    );

    return (
      <StyledFormControl
        disabled={disabled || !data}
        error={Boolean(error)}
        value={state}
      >
        <Typography variant="body2" color={Colors.darkGrey}>
          {label}
        </Typography>
        {!state && (
          <InputLabel>{loading ? "Wait a Moment..." : placeholder}</InputLabel>
        )}

        <Select
          value={state}
          name={name}
          onChange={handleSelectChange}
          IconComponent={IconComponent}
        >
          {data &&
            data.map((item) => (
              <MenuItem key={item.id} value={item[returnValue]}>
                {item.name}
              </MenuItem>
            ))}
        </Select>

        {error && (
          <Typography variant="body2" color={Colors.red100} marginTop="4px">
            {error}
          </Typography>
        )}
      </StyledFormControl>
    );
  }
);

export default CustomSelect;
