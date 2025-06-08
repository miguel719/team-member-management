// src/pages/LoginPage.jsx
import { useState } from "react";
import { Button, TextInput, Paper, Title, Stack, Anchor, Text } from "@mantine/core";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";



function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loadUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      await loadUser();
      navigate("/list");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Paper shadow="md" radius="md" p="xl" withBorder style={{ maxWidth: 400, margin: "auto", marginTop: "10vh" }}>
        
      <Title order={2} align="center" mb="md">Login</Title>
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput label="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
          <TextInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} required />
          <Button type="submit" fullWidth>Log in</Button>
          {error && <div style={{ color: "red", fontSize: "0.9rem" }}>{error}</div>}
        </Stack>

       
      </form>
      <Text size="sm" mt="md" align="center">
            Don’t have an account?{" "}
        <Anchor component="button" onClick={() => navigate("/signup")}>
            Sign up
        </Anchor>
        </Text>
    </Paper>
    
  );
}

export default LoginPage;
