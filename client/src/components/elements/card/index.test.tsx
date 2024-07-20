import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserCard from "./index";
import { UserTypes } from "store/types";

const mockUser: UserTypes = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  company: {
    name: "Example Corp",
    catchPhrase: "",
    bs: "",
  },
  website: "example.com",
  imageUrl: "https://via.placeholder.com/150",
  username: "",
  address: {
    street: "",
    suite: "",
    city: "",
    zipcode: "",
    geo: {
      lat: "",
      lng: "",
    },
  },
};

describe("UserCard Component", () => {
  test("renders the UserCard component with correct data", () => {
    render(
      <UserCard
        data={mockUser}
        handleClick={() => {}}
        handleEdit={() => {}}
        handleDelete={() => {}}
      />
    );

    expect(screen.getByAltText("user-image")).toHaveAttribute(
      "src",
      mockUser.imageUrl
    );
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(`Email: ${mockUser.email}`)).toBeInTheDocument();
    expect(screen.getByText(`Phone: ${mockUser.phone}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Company: ${mockUser.company.name}`)
    ).toBeInTheDocument();
    expect(screen.getByText("About User ➟")).not.toHaveAttribute(
      "href",
      `https://${mockUser.website}`
    );
  });

  test("handleClick is called when the card is clicked", () => {
    const handleClick = jest.fn();
    render(
      <UserCard
        data={mockUser}
        handleClick={handleClick}
        handleEdit={() => {}}
        handleDelete={() => {}}
      />
    );

    fireEvent.click(screen.getByAltText("user-image"));
    expect(handleClick).toHaveBeenCalled();
  });

  test("handleEdit is called when the edit icon is clicked", () => {
    const handleEdit = jest.fn();
    render(
      <UserCard
        data={mockUser}
        handleClick={() => {}}
        handleEdit={handleEdit}
        handleDelete={() => {}}
      />
    );

    fireEvent.click(screen.getByTestId("edit-icon"));
    expect(handleEdit).toHaveBeenCalled();
  });

  test("handleDelete is called when the delete icon is clicked", () => {
    const handleDelete = jest.fn();
    render(
      <UserCard
        data={mockUser}
        handleClick={() => {}}
        handleEdit={() => {}}
        handleDelete={handleDelete}
      />
    );

    fireEvent.click(screen.getByTestId("delete-icon"));
    expect(handleDelete).toHaveBeenCalled();
  });
});
