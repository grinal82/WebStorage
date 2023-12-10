import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { LogIn } from "./pages/LogIn";
import { WelcomePage } from "./pages/WelcomePage";
import { Register } from "./pages/Register";
import { UserStorage } from "./pages/UserStorage";
import { AdminInspectFiles } from "./pages/AdminInspectFiles";
import Navbar from "./components/Navbar";
import { fetchCsrfToken } from "./store/authReducer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  dispatch(fetchCsrfToken());
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<WelcomePage />} exact="/" />
          <Route path="/sign-in" element={<LogIn />} />
          <Route path="/sign-up" element={<Register />} />
          <Route path="/user/:id" element={<UserStorage />} />
          <Route path="/inspect/:id" element={<AdminInspectFiles />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
