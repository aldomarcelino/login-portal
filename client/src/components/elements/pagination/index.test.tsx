import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./";

describe("Pagination Component", () => {
  it("renders pagination buttons and current page correctly", () => {
    const currentPage = 1;
    const pageLimit = 5;
    const setCurrentPage = jest.fn();

    render(
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageLimit={pageLimit}
      />
    );

    // Check if previous button is rendered and disabled on first page
    const prevButton = screen.getByRole("button", { name: /previous/i });
    expect(prevButton).toBeInTheDocument();
    expect(prevButton).toBeDisabled();

    // Check if next button is rendered and enabled
    const nextButton = screen.getByRole("button", { name: "next" });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeEnabled();

    // Check if current page button is rendered and active
    const currentPageButton = screen.getByText(`${currentPage}`);
    expect(currentPageButton).toBeInTheDocument();
    expect(currentPageButton).not.toHaveStyle(
      `background-color: rgb(255, 255, 255)`
    );

    // Click on next button
    fireEvent.click(nextButton);
    expect(setCurrentPage).not.toHaveBeenCalledWith(currentPage + 1);

    // Click on previous button (should be disabled initially)
    fireEvent.click(prevButton);
    expect(setCurrentPage).not.toHaveBeenCalledWith(currentPage - 1); // should not call if disabled
  });

  it("disables next button on last page", () => {
    const currentPage = 5;
    const pageLimit = 5;
    const setCurrentPage = jest.fn();

    render(
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageLimit={pageLimit}
      />
    );

    // Check if next button is disabled on last page
    const nextButton = screen.getByRole("button", { name: "next" });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeDisabled();
  });
});
