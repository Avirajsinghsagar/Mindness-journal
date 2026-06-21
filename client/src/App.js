import { Navigate, Route, Routes } from "react-router-dom";

/* Components */
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

/* Pages */
import Breathing from "./pages/Breathing";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Home → redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/journal" element={
          <ProtectedRoute><Journal /></ProtectedRoute>
        } />
        <Route path="/breathing" element={
          <ProtectedRoute><Breathing /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;