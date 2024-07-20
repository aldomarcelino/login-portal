import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Tabel, { TabelProps, ListHeadItem } from "./";

const mockListHead: ListHeadItem[] = [
  { id: 1, title: "Name", align: "left" },
  { id: 2, title: "Age", align: "center" },
  { id: 3, title: "Role", align: "right" },
  { id: 4, title: "Role", align: "inherit" },
  { id: 5, title: "Role", align: "justify" },
];

describe("Tabel Component", () => {
  const mockOnClickAdd = jest.fn();
  const mockChildren = (
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>25</td>
        <td>Admin</td>
      </tr>
      <tr>
        <td>Data 2</td>
        <td>30</td>
        <td>User</td>
      </tr>
    </tbody>
  );

  const renderComponent = (props: Partial<TabelProps> = {}) => {
    const defaultProps: TabelProps = {
      listHead: mockListHead,
      isEmpty: false,
      isLoading: false,
      onCLickAdd: mockOnClickAdd,
      children: mockChildren,
      ...props,
    };
    return render(<Tabel {...defaultProps} />);
  };

  it("renders Tabel with loading skeleton when isLoading is true", () => {
    renderComponent({ isLoading: true });

    // Check if skeleton rows are rendered
    const skeletonRows = screen.getAllByTestId("skeleton");
    expect(skeletonRows.length).toBe(30);
  });

  it("renders Tabel with 'No data' message when isEmpty is true", () => {
    renderComponent({ isEmpty: true });

    // Check if 'No data' message is rendered
    const noDataMessage = screen.getByText("No data");
    expect(noDataMessage).toBeInTheDocument();
  });

  it("renders Tabel with children when isLoading and isEmpty are false", () => {
    renderComponent();

    // Check if children data is rendered
    const dataRows = screen.getAllByRole("row");
    expect(dataRows.length).toBe(3); // Including header row and two data rows
    expect(screen.getByText("Data 1")).toBeInTheDocument();
    expect(screen.getByText("Data 2")).toBeInTheDocument();
  });

  it("triggers onClickAdd function when add button is clicked", () => {
    renderComponent();

    // Simulate click on add button
    const addButton = screen.getByTestId("add");
    fireEvent.click(addButton);

    // Expect onClickAdd to be called once
    expect(mockOnClickAdd).toHaveBeenCalled();
  });
});
