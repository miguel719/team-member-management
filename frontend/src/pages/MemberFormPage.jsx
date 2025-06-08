// src/pages/MemberFormPage.jsx
import {
    TextInput,
    Button,
    Paper,
    Title,
    Text,
    Group,
    Radio,
    Stack
  } from "@mantine/core";
  import { useNavigate, useParams } from "react-router-dom";
  import { useState, useEffect } from "react";
  import { getMember, createMember, updateMember, deleteMember } from "../services/api";
  import { useAuth } from "../context/AuthContext";
  
  function MemberFormPage({ isEdit = false }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
  
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("regular");
    const [error, setError] = useState("");
  
    useEffect(() => {
      if (isEdit && id) {
        getMember(id).then(data => {
          setFirstName(data.profile.first_name || "");
          setLastName(data.profile.last_name || "");
          setEmail(data.email || "");
          setPhone(data.profile.phone || "");
          setRole(data.role || "regular");
        }).catch(() => {
          setError("Failed to load user");
        });
      }
    }, [id, isEdit]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const payload = { email, first_name: firstName, last_name: lastName, phone, role };
        if (isEdit) {
          await updateMember(id, payload);
        } else {
          await createMember(payload);
        }
        navigate("/list");
      } catch (err) {
        setError(err.message || "Error");
      }
    };
  
    const handleDelete = async () => {
      if (confirm("Are you sure?")) {
        await deleteMember(id);
        navigate("/list");
      }
    };
  
    return (
      <Paper shadow="md" radius="md" p="xl" withBorder style={{ maxWidth: 400, margin: "auto", marginTop: "5rem" }}>
        <Title order={2} align="center" mb="md">
          {isEdit ? "Edit team member" : "Add a team member"}
        </Title>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <TextInput label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            <TextInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextInput label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            
            <Text size="sm" mt="sm">Role</Text>
            <Radio.Group value={role} onChange={setRole}>
              <Stack>
                <Radio value="regular" label="Regular – Can’t delete members" />
                <Radio value="admin" label="Admin – Can delete members" disabled={user?.role !== "admin"} />
              </Stack>
            </Radio.Group>
  
            {error && <Text color="red">{error}</Text>}
  
            <Group grow mt="md">
              <Button variant="default" onClick={() => navigate("/list")}>Cancel</Button>
              <Button type="submit">Save</Button>
            </Group>
  
            {isEdit && user?.role === "admin" && (
              <Button color="red" onClick={handleDelete} mt="sm">Delete</Button>
            )}
          </Stack>
        </form>
      </Paper>
    );
  }
  
  export default MemberFormPage;
  