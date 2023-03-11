// import logo from './logo.svg';
import "./App.css";
// import Table from './components/Table';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Authentication from "./components/Authentication";
import Login from "./components/Login";
import Register from "./components/Register";
// import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import MyBooks from "./components/MyBooks";

function App() {

  return (
    <Router>
   
      <Routes>
        {/* <Route exact={true} path="/" element={<Authentication />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/myBooks" element={<MyBooks />} />
      </Routes>
    </Router>
  );
}

export default App;
