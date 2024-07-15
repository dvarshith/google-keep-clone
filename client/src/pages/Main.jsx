import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from "../components/App";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthProvider } from '../components/AuthContext';

function Main() {

    return (
        <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<h1>404: There's nothing here</h1>} />
          </Routes>
        </Router>
        </AuthProvider>
      );

}

export default Main;