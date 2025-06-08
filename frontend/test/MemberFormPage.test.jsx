import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MemberFormPage from "../src/pages/MemberFormPage";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import * as api from "../src/services/api";
import * as AuthContext from "../src/context/AuthContext";
import { act } from "react";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderWithProviders(ui) {
  return render(
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <BrowserRouter>{ui}</BrowserRouter>
    </MantineProvider>
  );
}

describe("MemberFormPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: { role: "admin" },
    });
  });

  it("renders empty form for adding a member", async () => {
    renderWithProviders(<MemberFormPage />);

    expect(screen.getByLabelText(/first name/i)).toHaveValue("");
    expect(screen.getByLabelText(/last name/i)).toHaveValue("");
    expect(screen.getByLabelText(/email/i)).toHaveValue("");
    expect(screen.getByLabelText(/phone/i)).toHaveValue("");

    // Simula envío
    jest.spyOn(api, "createMember").mockResolvedValue({});

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Ana" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "García" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ana@mail.com" } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "1234567890" } });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(api.createMember).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/list");
    });
  });

  it("renders form with member data in edit mode", async () => {
    const memberData = {
      id: "1",
      email: "john@mail.com",
      role: "admin",
      profile: {
        first_name: "John",
        last_name: "Doe",
        phone: "5551234",
      },
    };

    jest.spyOn(api, "getMember").mockResolvedValue(memberData);

    await act(async () => {
      render(
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <MemoryRouter initialEntries={["/members/edit/1"]}>
            <Routes>
              <Route path="/members/edit/:id" element={<MemberFormPage isEdit />} />
            </Routes>
          </MemoryRouter>
        </MantineProvider>
      );
    });

    expect(screen.getByLabelText(/first name/i)).toHaveValue("John");
    expect(screen.getByLabelText(/last name/i)).toHaveValue("Doe");
    expect(screen.getByLabelText(/email/i)).toHaveValue("john@mail.com");
    expect(screen.getByLabelText(/phone/i)).toHaveValue("5551234");

    // Simula guardado
    jest.spyOn(api, "updateMember").mockResolvedValue({});

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(api.updateMember).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/list");
    });
  });
});
