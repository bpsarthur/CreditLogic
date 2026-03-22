import { Link, useLocation, useNavigate } from 'react-router-dom';
import { adminLogout } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  const handleLogout = async () => {
    try {
      await adminLogout();
    } finally {
      navigate('/admin/login');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        CreditLogic
      </Link>
      <div className="navbar-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Analisar
        </Link>
        <Link to="/tabela-verdade" className={location.pathname === '/tabela-verdade' ? 'active' : ''}>
          Tabela Verdade
        </Link>
        {isAdmin ? (
          <>
            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
              Dashboard
            </Link>
            <Link to="/admin/analises" className={location.pathname === '/admin/analises' ? 'active' : ''}>
              Análises
            </Link>
            <Link to="/admin/logs" className={location.pathname === '/admin/logs' ? 'active' : ''}>
              Logs
            </Link>
            <Link to="/admin/stats" className={location.pathname === '/admin/stats' ? 'active' : ''}>
              Estatísticas
            </Link>
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '4px 12px', fontSize: '0.875rem' }}>
              Sair
            </button>
          </>
        ) : (
          <Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active' : ''}>
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
