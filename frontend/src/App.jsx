import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // Ensure the correct path
import Header from "./componets/Header"; // Also, make sure this is correct
import PrivateRoute from "./componets/PrivateRoute";
import Home from "./pages/Home";
import Elections from "./pages/Elections";
import Voting from "./pages/Voting";
import "./App.css";
import Admin from "./pages/Admin";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<PrivateRoute />}>
            <Route path="/election" element={<Elections />} />
            <Route path="/voting" element={<Voting />} />
            {/* <Route path="/admin" element={<Admin />} /> */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
