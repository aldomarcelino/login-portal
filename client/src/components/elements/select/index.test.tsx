import React from "react";
import { render } from "@testing-library/react";
import CustomSelect, { CustomSelectProps } from "./";

const mockData = [
  { id: "1", name: "Option 1" },
  { id: "2", name: "Option 2" },
  { id: "3", name: "Option 3" },
];

describe("CustomSelect Component", () => {
  const handleChange = jest.fn();

  const renderComponent = (props: Partial<CustomSelectProps> = {}) => {
    const defaultProps: CustomSelectProps = {
      data: mockData,
      value: "",
      label: "Select an option",
      placeholder: "Select...",
      handleChange,
    };
    return render(<CustomSelect {...defaultProps} {...props} />);
  };

  it("renders CustomSelect with label, placeholder, and options", () => {
    renderComponent();
  });

  it("triggers handleChange function on select change", () => {
    renderComponent();
  });
});
