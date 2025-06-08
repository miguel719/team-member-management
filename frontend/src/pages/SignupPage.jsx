import React, { useState } from "react";
import { TextInput, PasswordInput, Button, Paper, Title, Text, Anchor } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/api";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signupUser(email, password);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <Paper shadow="md" radius="md" p="xl" withBorder style={{ maxWidth: 400, margin: "auto", marginTop: "5rem" }}>
      <Title order={2} align="center" mb="md">Sign Up</Title>

      <form onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          placeholder="you@mail.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb="sm"
        />

        <PasswordInput
          label="Password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb="sm"
        />

        <PasswordInput
          label="Repeat Password"
          placeholder="Repeat your password"
          required
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          mb="md"
        />

        <Button type="submit" fullWidth mt="md">Create Account</Button>

        {error && <Text color="red" mt="sm">{error}</Text>}

        <Text size="sm" mt="md" align="center">
          Already have an account?{" "}
          <Anchor component="button" onClick={() => navigate("/login")}>
            Log in
          </Anchor>
        </Text>
      </form>
    </Paper>
  );
}

export default SignupPage;
