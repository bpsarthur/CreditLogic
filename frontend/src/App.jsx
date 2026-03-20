import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Resultado from './pages/Resultado';
import TabelaVerdade from './pages/TabelaVerdade';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalises from './pages/admin/AdminAnalises';
import AdminLogs from './pages/admin/AdminLogs';
import AdminStats from './pages/admin/AdminStats';
import { adminCheck } from './services/api';
import './styles/global.css';

function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    adminCheck()
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return <div className="loading">Verificando autenticação...</div>;
  if (!auth) return <Navigate to="/admin/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="/tabela-verdade" element={<TabelaVerdade />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/analises" element={<ProtectedRoute><AdminAnalises /></ProtectedRoute>} />
        <Route path="/admin/logs" element={<ProtectedRoute><AdminLogs /></ProtectedRoute>} />
        <Route path="/admin/stats" element={<ProtectedRoute><AdminStats /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
