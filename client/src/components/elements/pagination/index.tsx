import { Box, IconButton, Typography } from "@mui/material";
import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { Colors } from "styles/theme/color";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BtnPageProps {
  isActive: boolean;
}

interface PaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageLimit: number;
}

const Wrapper = styled(Box)`
  display: flex;
  gap: 8px;
  align-items: center;

  & .MuiIconButton-root {
    background-color: transparent;
    width: 40px;
    height: 40px;
    transition: 0.7s;
    &:hover {
      background-color: transparent;
    }

    &.Mui-disabled {
      background-color: transparent;
      opacity: 0.5;
    }
  }
`;

const BtnPage = styled(Box)<BtnPageProps>(
  ({ isActive }) => `
  height: 40px;
  width: 40px;
  border-radius: 40px;
  background-color: ${isActive ? Colors.darkBlue : Colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${Colors.shadowLight};
  color:  ${isActive ? Colors.blue : Colors.black};
  cursor: ${isActive ? "default" : "pointer"};
  transition: 0.3s all ease;
  border: 1px solid ${Colors.darkBlue};
  &:hover {
    color:  ${Colors.blue};
  }
`
);

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  pageLimit,
}) => {
  // Handle to next page
  const goToNextPage = useCallback(() => {
    setCurrentPage((page) => page + 1);
  }, [setCurrentPage]);

  // Handle to previous page
  const goToPreviousPage = useCallback(() => {
    setCurrentPage((page) => page - 1);
  }, [setCurrentPage]);

  // Generate list of page
  const getPaginationGroup = useCallback(() => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(pageLimit)
      .fill(undefined)
      .map((_, idx) => start + idx + 1);
  }, [currentPage, pageLimit]);

  return (
    <Wrapper>
      {/* previous button */}
      <IconButton
        aria-label="previous"
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={24} color={Colors.darkBlue} />
      </IconButton>

      {/* show page numbers */}
      {getPaginationGroup().map((item, index) => (
        <BtnPage
          onClick={() => setCurrentPage(item)}
          key={`${index}-page-btn`}
          isActive={currentPage === item}
        >
          <Typography>{item}</Typography>
        </BtnPage>
      ))}

      {/* next button */}
      <IconButton
        aria-label="next"
        onClick={goToNextPage}
        disabled={currentPage === pageLimit}
      >
        <ChevronRight size={24} color={Colors.darkBlue} />
      </IconButton>
    </Wrapper>
  );
};

export default Pagination;
