import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import ListPage from "../src/pages/ListPage";
import * as api from "../src/services/api";
import * as AuthContext from "../src/context/AuthContext";
import { act } from "react";

// Mock de navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

function renderListPage() {
  return render(
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <ListPage />
      </BrowserRouter>
    </MantineProvider>
  );
}

describe("ListPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders member list from API", async () => {
    jest.spyOn(api, "getMembers").mockResolvedValue([
      {
        id: 1,
        email: "jane@example.com",
        role: "admin",
        profile: {
          first_name: "Jane",
          last_name: "Doe",
          phone: "1234567890",
          email: "jane@example.com",
        },
      },
    ]);

    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: { email: "admin@example.com" },
      logout: jest.fn(),
    });

    await act(async () => {
      renderListPage();
    });

    await waitFor(() => {
      expect(screen.getByText("Jane Doe (admin)")).toBeInTheDocument();
      expect(screen.getByText("1234567890")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
      expect(screen.getByText("Team members")).toBeInTheDocument();
    });
  });
});
