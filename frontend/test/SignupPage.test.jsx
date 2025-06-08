import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupPage from "../src/pages/SignupPage";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import * as api from "../src/services/api";

// Mock de navegación
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Render con MantineProvider y Router
function renderSignupPage() {
  return render(
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    </MantineProvider>
  );
}

describe("SignupPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows error if passwords don't match", async () => {
    renderSignupPage();

    fireEvent.change(screen.getByPlaceholderText(/you@mail.com/i), {
      target: { value: "test@mail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText(/repeat your password/i), {
      target: { value: "654321" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("calls signupUser and navigates on success", async () => {
    jest.spyOn(api, "signupUser").mockResolvedValue({});

    renderSignupPage();

    fireEvent.change(screen.getByPlaceholderText(/you@mail.com/i), {
      target: { value: "user@mail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "mypassword" },
    });
    fireEvent.change(screen.getByPlaceholderText(/repeat your password/i), {
      target: { value: "mypassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(api.signupUser).toHaveBeenCalledWith("user@mail.com", "mypassword");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("shows error if signup fails", async () => {
    jest.spyOn(api, "signupUser").mockRejectedValue(new Error("Signup failed"));

    renderSignupPage();

    fireEvent.change(screen.getByPlaceholderText(/you@mail.com/i), {
      target: { value: "fail@mail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText(/repeat your password/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/signup failed/i)).toBeInTheDocument();
    });
  });
});
