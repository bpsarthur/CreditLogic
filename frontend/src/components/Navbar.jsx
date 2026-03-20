import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

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
