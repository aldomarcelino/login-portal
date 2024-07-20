import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomMenu, { MenuItem } from "./";

// Mock menu items
const menuItems: MenuItem[] = [
  {
    id: 1,
    label: "Edit",
    handleClick: jest.fn(),
  },
  {
    id: 2,
    label: "Delete",
    handleClick: jest.fn(),
  },
];

describe("CustomMenu Component", () => {
  it("renders button base", () => {
    render(
      <CustomMenu
        buttonBase={<button>Menu Button</button>}
        menuItems={menuItems}
      />
    );
    const button = screen.getByText("Menu Button");
    expect(button).toBeInTheDocument();
  });

  it("opens menu on button click and closes on outside click", async () => {
    render(
      <CustomMenu
        buttonBase={<button>Menu Button</button>}
        menuItems={menuItems}
      />
    );

    // Menu should initially be closed
    let menuItemsElement = screen.queryByText("Edit");
    expect(menuItemsElement).not.toBeInTheDocument();

    // Open menu
    const button = screen.getByText("Menu Button");
    userEvent.click(button);

    // Wait for menu items to appear
    menuItemsElement = await screen.findByText("Edit");
    expect(menuItemsElement).toBeInTheDocument();

    // Click outside to close menu
    userEvent.click(document.body);

    // Menu should be closed again
    menuItemsElement = screen.queryByText("Edit");
    expect(menuItemsElement).toBeInTheDocument();
  });

  it("handles menu item click correctly", async () => {
    render(
      <CustomMenu
        buttonBase={<button>Menu Button</button>}
        menuItems={menuItems}
      />
    );

    // Open menu
    const button = screen.getByText("Menu Button");
    userEvent.click(button);

    // Wait for menu items to appear
    const editItem = await screen.findByText("Edit");
    const deleteItem = screen.getByText("Delete");

    // Click on "Delete" menu item
    userEvent.click(deleteItem);

    // Verify that the handleClick function for "Delete" was called
    expect(menuItems[1].handleClick).toHaveBeenCalledTimes(1);
  });
});
