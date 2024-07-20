import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CustomButton from "./";
import { Colors } from "styles/theme/color";

describe("CustomButton Component", () => {
  test("renders the CustomButton with default props", () => {
    render(<CustomButton label="Click Me" />);

    const button = screen.getByText("Click Me");
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle(`background: ${Colors.darkBlue}`);
    expect(button).toHaveStyle(`color: ${Colors.white}`);
  });

  test("renders the CustomButton with secondary type", () => {
    render(<CustomButton label="Click Me" buttontype="secondary" />);

    const button = screen.getByText("Click Me");
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveStyle(`background: ${Colors.white}`);
    expect(button).toHaveStyle(`color: ${Colors.darkBlue}`);
    expect(button).toHaveStyle(`border: 1px solid ${Colors.darkBlue}`);
  });

  test("renders the CustomButton with text type", () => {
    render(<CustomButton label="Click Me" buttontype="text" />);

    const button = screen.getByText("Click Me");
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle(`background: rgb(83, 105, 196)`);
    expect(button).toHaveStyle(`color: ${Colors.darkBlue}`);
    expect(button).not.toHaveStyle(`border: 1px solid ${Colors.darkBlue}`);
  });

  test("handleClick is called when the button is clicked", () => {
    const handleClick = jest.fn();
    render(<CustomButton label="Click Me" onClick={handleClick} />);

    const button = screen.getByText("Click Me");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });

  test("button is disabled", () => {
    render(<CustomButton label="Click Me" disabled />);

    const button = screen.getByText("Click Me");
    expect(button).toBeDisabled();
  });

  test("renders CustomButton with startIcon and endIcon", () => {
    const startIcon = <span data-testid="start-icon">StartIcon</span>;
    const endIcon = <span data-testid="end-icon">EndIcon</span>;

    render(
      <CustomButton label="Click Me" startIcon={startIcon} endIcon={endIcon} />
    );

    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
  });

  test("renders CustomButton with custom styles", () => {
    render(
      <CustomButton
        label="Click Me"
        height="50px"
        width="200px"
        fontSize="16px"
        margin="10px"
        padding="5px"
        borderradius="10px"
      />
    );

    const button = screen.getByText("Click Me");
    expect(button).toHaveStyle(`height: 50px`);
    expect(button).toHaveStyle(`width: 200px`);
    expect(button).toHaveStyle(`font-size: 16px`);
    expect(button).toHaveStyle(`margin: 10px`);
    expect(button).toHaveStyle(`padding: 5px`);
    expect(button).toHaveStyle(`border-radius: 10px`);
  });
});
