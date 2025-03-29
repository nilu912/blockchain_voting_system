import { AuthProvider } from "./contexts/AuthContext";  // Ensure the correct path
import Header from "./componets/Header";  // Also, make sure this is correct
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Header />
    </AuthProvider>
  );
}

export default App;
