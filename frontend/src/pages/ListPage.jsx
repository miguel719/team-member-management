
import { useEffect, useState } from "react";
import { getMembers, logoutUser } from "../services/api";
import { Button } from "@mantine/core";
import { useAuth } from "../context/AuthContext";

function ListPage() {
  const [members, setMembers] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    getMembers()
      .then(setMembers)
      .catch((err) => console.error("Failed to load members:", err));
  }, []);

  const handleLogout = () => {
    logoutUser();
  }


  return (
    <div style={{ padding: "2rem" }}>
      <h1>Hello, {user?.profile?.first_name || user?.email}</h1>
      <p>Your role: <strong>{user?.role}</strong></p>
      <Button onClick={() => { logout(); navigate("/login"); }} color="red">
        Logout
      </Button>
      <h1>Team Members</h1>
      <ul>
        {members.map((m, i) => (
          <li key={i}>
            {m.profile?.first_name} {m.profile?.last_name} – {m.profile?.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListPage;
