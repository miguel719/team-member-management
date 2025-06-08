// src/pages/ListPage.jsx
import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Avatar,
  Stack,
  Divider,
  Button,
  Box,
  Flex,
} from "@mantine/core";
import { getMembers } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ListPage() {
  const [members, setMembers] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (err) {
        console.error("Failed to load members:", err);
      }
    };
    fetchMembers();
  }, []);

  return (
    <Container size="xs" py="xl">
      {/* Header */}
      <Flex justify="space-between" align="center" mb="md">
        <Box>
          <Text size="sm" color="dimmed">
            Logged in as
          </Text>
          <Text fw={500}>{user?.email || "Unknown"}</Text>
        </Box>
        <Button size="xs" variant="light" color="gray" onClick={logout}>
          Logout
        </Button>
      </Flex>

      <Title order={2} mb="xs">Team members</Title>
      <Text size="sm" color="dimmed" mb="md">
        You have {members.length} team member{members.length !== 1 && "s"}.
      </Text>

      <Divider mb="sm" />

      {/* Member list */}
      <Stack spacing="sm">
      {members.map((member) => {
        const profile = member.profile || {};

        return (
          <Card key={member.id || member.email} withBorder shadow="sm" radius="md" p="sm">
            <Group align="flex-start">
              <Avatar color="gray" radius="xl" />
              <Box>
                <Text fw={500}>
                  {profile.first_name || "No name"} {profile.last_name || ""}
                  {member.role === "admin" && " (admin)"}
                </Text>
                <Text size="sm" color="dimmed">
                  {profile.phone || "No phone"}
                </Text>
                <Text size="sm" color="dimmed">
                  {profile.email || member.email}
                </Text>
              </Box>
            </Group>
          </Card>
        );
      })}


      </Stack>
    </Container>
  );
}

export default ListPage;
