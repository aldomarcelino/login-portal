import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Header from "./";

describe("Header Component", () => {
  test("renders the Header with the logo", () => {
    render(<Header />);

    // Check if the logo image is present
    const logo = screen.getByAltText("user-portal-logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logo.png");
    expect(logo).toHaveStyle({ objectFit: "cover", height: "64px" });
  });

  test("renders the AppBar with correct styles", () => {
    act(() => {
      render(<Header />);
    });

    // Check if the AppBar is rendered
    const appBar = screen.getByRole("banner");
    expect(appBar).toBeInTheDocument();

    // Check if the styles match the expected values
    expect(appBar).toHaveStyle(`
      z-index: 2;
      box-shadow:0px 10px 40px 0px rgba(164, 149, 107, 0.10);
    `);
  });
});
