import React from "react";
import { Box, TextField } from "@mui/material";
import { Search } from "lucide-react";
import styled from "@emotion/styled";

interface SearchBarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  resetPage: React.Dispatch<React.SetStateAction<number>>;
}

const StyledTextField = styled(TextField)`
  width: 100%;
  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: transparent;
    }
    &:hover fieldset {
      border-color: transparent;
    }
    &.Mui-focused fieldset {
      border-color: transparent;
    }
  }
`;

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  setSearch,
  resetPage,
}) => {
  return (
    <Box display="flex" justifyContent="end">
      <Box
        width="35%"
        sx={{
          backgroundColor: "white",
          padding: "0px 21px",
          borderRadius: "11px",
        }}
      >
        <Box display="flex" alignItems="center" width="100%">
          <Search size={24} data-testid="search-icon" />
          <StyledTextField
            name="search"
            placeholder="Search Name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage(1);
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SearchBar;
