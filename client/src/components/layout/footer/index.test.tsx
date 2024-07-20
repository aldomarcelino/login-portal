import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Footer from "./";
import { Colors } from "styles/theme/color";

describe("Footer Component", () => {
  test("renders the Footer with the correct text and links", () => {
    render(<Footer />);

    // Check if the footer text is rendered correctly
    expect(screen.getByText("Made by")).toBeInTheDocument();
    expect(screen.getByText("Aldo Marcelino")).toBeInTheDocument();

    // Check if the link to the Github profile is correct
    const githubLink = screen.getByText("Aldo Marcelino").closest("a");
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/aldomarcelino/"
    );

    // Check if the LinkedIn link is present
    const linkedinLink = screen.getByLabelText("LinkedIn");
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/aldomarcelino/"
    );

    // Check if the Twitter link is present
    const twitterLink = screen.getByLabelText("Twitter");
    expect(twitterLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/aldomarcelino/"
    );

    // Check if the Github link is present
    const githubIconLink = screen.getByLabelText("GitHub");
    expect(githubIconLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/aldomarcelino/"
    );
  });

  test("renders the icons with correct colors", () => {
    render(<Footer />);

    // Check if the Linkedin icon is rendered with the correct color
    const linkedinIcon = screen.getByLabelText("LinkedIn").querySelector("svg");
    expect(linkedinIcon).toHaveAttribute("stroke", Colors.darkBlue);

    // Check if the Twitter icon is rendered with the correct color
    const twitterIcon = screen.getByLabelText("Twitter").querySelector("svg");
    expect(twitterIcon).toHaveAttribute("stroke", Colors.darkBlue);

    // Check if the Github icon is rendered with the correct color
    const githubIcon = screen.getByLabelText("GitHub").querySelector("svg");
    expect(githubIcon).toHaveAttribute("stroke", Colors.darkBlue);
  });
});
