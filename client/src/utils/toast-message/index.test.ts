import { render } from "@testing-library/react";
import { Bounce, toast } from "react-toastify";
import { toastSuccess } from "./";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("toastSuccess function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays success toast with correct message", () => {
    const message = "This is a success message";
    toastSuccess(message);

    expect(toast).toHaveBeenCalledWith(message, expect.any(Object));
  });

  it("configures toast with correct options", () => {
    const message = "Test message";
    toastSuccess(message);

    expect(toast).toHaveBeenCalledWith(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  });
});
