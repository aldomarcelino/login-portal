import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "./";

describe("SearchBar Component", () => {
  it("renders SearchBar with Search icon and TextField", () => {
    const search = "";
    const setSearch = jest.fn();
    const resetPage = jest.fn();

    render(
      <SearchBar search={search} setSearch={setSearch} resetPage={resetPage} />
    );

    // Check if Search icon is rendered
    const searchIcon = screen.getByTestId("search-icon");
    expect(searchIcon).toBeInTheDocument();

    // Check if TextField is rendered with placeholder text
    const textField = screen.getByPlaceholderText("Search Name");
    expect(textField).toBeInTheDocument();
  });

  it("triggers setSearch and resetPage functions on input change", () => {
    const search = "";
    const setSearch = jest.fn();
    const resetPage = jest.fn();

    render(
      <SearchBar search={search} setSearch={setSearch} resetPage={resetPage} />
    );

    // Simulate typing in the TextField
    const textField = screen.getByPlaceholderText("Search Name");
    fireEvent.change(textField, { target: { value: "Test" } });

    // Expect setSearch and resetPage to be called
    expect(setSearch).toHaveBeenCalledWith("Test");
    expect(resetPage).toHaveBeenCalledWith(1); // Assuming resetPage sets the page to 1
  });
});
