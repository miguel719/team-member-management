
import { useEffect, useState } from "react";
import { getMembers } from "../services/api";

function ListPage() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    getMembers()
      .then(setMembers)
      .catch((err) => console.error("Failed to load members:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
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
