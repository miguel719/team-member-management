// frontend/tests/LoginPage.test.jsx
import React from "react";
import { MantineProvider } from "@mantine/core";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../src/pages/LoginPage";
import { BrowserRouter } from "react-router-dom";
import AuthContext from "../src/context/AuthContext";
import * as api from "../src/services/api";


// Mock navigation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows login success and navigates", async () => {
    jest.spyOn(api, "loginUser").mockResolvedValue({
      access: "access-token",
      refresh: "refresh-token",
    });

    const mockLoadUser = jest.fn();

    render(
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AuthContext.Provider value={{ loadUser: mockLoadUser }}>
            <BrowserRouter>
              <LoginPage />
            </BrowserRouter>
          </AuthContext.Provider>
        </MantineProvider>
      );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "adminspass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(api.loginUser).toHaveBeenCalledWith("admin@example.com", "adminspass");
      expect(localStorage.getItem("access")).toBe("access-token");
      expect(mockLoadUser).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/list");
    });
  });

  it("shows error message on failed login", async () => {
    jest.spyOn(api, "loginUser").mockRejectedValue(new Error("Invalid credentials"));

    render(
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AuthContext.Provider value={{ loadUser: jest.fn() }}>
            <BrowserRouter>
              <LoginPage />
            </BrowserRouter>
          </AuthContext.Provider>
        </MantineProvider>
      );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
