// StaticMap.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import StaticMap from "./";

describe("StaticMap Component", () => {
  const testProps = {
    id: "test-map",
    size: "400x300",
    lat: 40.7128,
    lng: -74.006,
    width: "100%",
    height: "100%",
    borderRadius: "10px",
  };

  test("renders map with correct props", () => {
    render(
      <StaticMap
        id={testProps.id}
        size={testProps.size}
        lat={testProps.lat}
        lng={testProps.lng}
        width={testProps.width}
        height={testProps.height}
        borderRadius={testProps.borderRadius}
      />
    );

    const mapElement = screen.getByTestId("static-google-map");
    expect(mapElement).toBeInTheDocument();
    expect(mapElement).toHaveStyle(`border-radius: ${testProps.borderRadius}`);
    expect(mapElement).toHaveStyle("object-fit: cover");
  });

  test("has correct link to Google Maps", () => {
    render(
      <StaticMap
        id={testProps.id}
        size={testProps.size}
        lat={testProps.lat}
        lng={testProps.lng}
        width={testProps.width}
        height={testProps.height}
        borderRadius={testProps.borderRadius}
      />
    );

    const mapLink = screen.getByRole("link", { name: /view on google maps/i });
    expect(mapLink).toBeInTheDocument();
    expect(mapLink).toHaveAttribute(
      "href",
      `https://maps.google.com/?q=${testProps.lat}+${testProps.lng}`
    );
    expect(mapLink).toHaveAttribute("target", "_blank");
    expect(mapLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
