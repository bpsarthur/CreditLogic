import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function Resultado() {
  const location = useLocation();
  const navigate = useNavigate();
  const analise = location.state?.analise;

  if (!analise) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Nenhuma análise encontrada.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Voltar ao formulário
          </Link>
        </div>
      </div>
    );
  }

  const aprovado = analise.resultado === 'APROVADO';

  return (
    <div className="container">
      <div className="page-header">
        <h1>Resultado da Análise</h1>
      </div>

      <div className={`card result-card ${aprovado ? 'aprovado' : 'reprovado'}`}>
        <div className="result-icon">{aprovado ? '✓' : '✗'}</div>
        <div className="result-title">{analise.resultado}</div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Solicitante: <strong>{analise.nome_solicitante}</strong>
        </p>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Proposições verdadeiras: <strong>{analise.total_verdadeiras}/12</strong>
        </p>

        <div className="result-summary">
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Expressão Lógica Avaliada</h3>
          <pre>{analise.expressao_logica}</pre>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Nova Análise
          </button>
          <Link to="/tabela-verdade" className="btn btn-secondary">
            Ver Regras
          </Link>
        </div>
      </div>
    </div>
  );
}
