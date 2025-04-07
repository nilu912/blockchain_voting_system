import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // Ensure the correct path
import Header from "./components/Header"; // Also, make sure this is correct
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Elections from "./pages/Elections";
import Voting from "./pages/Voting";
import "./App.css";
import Admin from "./pages/Admin";
import NewElections from "./pages/NewElections";
import ListElections from "./pages/ListElections";
import ManageCandidates from "./pages/ManageCandidates";
import ElectionDetails from "./pages/ElectionDetails";

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
            <Route path="/election/:electionId" element={<ElectionDetails />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/newElection" element={<NewElections />} />
            <Route path="/electionsDashboard" element={<ListElections />} />
            <Route path="/electionsDashboard/:eveId" element={<ManageCandidates />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
