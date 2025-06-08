// src/App.jsx
import { useState } from "react";
import { MantineProvider } from "@mantine/core";
import LoginPage from "./pages/LoginPage";
import ListPage from "./pages/ListPage";

function App() {
  const [user, setUser] = useState(null);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      {user ? <ListPage /> : <LoginPage onLogin={setUser} />}
    </MantineProvider>
  );
}

export default App;
