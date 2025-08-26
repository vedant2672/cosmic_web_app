import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Container from "@mui/material/Container";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";
import Footer from "./components/Footer";

export default function App() {
  // selections reset to empty on full page refresh
  const [selections, setSelections] = useState({});
  // Clean up any legacy persisted value
  useEffect(() => {
    try {
      localStorage.removeItem("selections");
    } catch {}
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home selections={selections} setSelections={setSelections} />
            }
          />
          <Route
            path="/compare"
            element={<Compare selections={selections} />}
          />
          <Route
            path="*"
            element={<Container sx={{ py: 4 }}>Not Found</Container>}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
