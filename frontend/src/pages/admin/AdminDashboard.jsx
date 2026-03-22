import { useState, useEffect } from 'react';
import { adminDashboard } from '../../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminDashboard()
      .then((res) => setData(res.data))
      .catch(() => setError('Erro ao carregar dashboard.'));
  }, []);

  if (error) return <div className="loading">{error}</div>;
  if (!data) return <div className="loading">Carregando...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Visão geral do sistema</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{data.total_analises}</div>
          <div className="stat-label">Total de Análises</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--success)' }}>{data.aprovados}</div>
          <div className="stat-label">Aprovados</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{data.reprovados}</div>
          <div className="stat-label">Reprovados</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.taxa_aprovacao}%</div>
          <div className="stat-label">Taxa de Aprovação</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Últimas Análises</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Resultado</th>
              <th>Verdadeiras</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {data.ultimas_analises.map((a) => (
              <tr key={a.id}>
                <td>{a.nome_solicitante}</td>
                <td>
                  <span className={`badge ${a.resultado === 'APROVADO' ? 'badge-success' : 'badge-danger'}`}>
                    {a.resultado}
                  </span>
                </td>
                <td>{a.total_verdadeiras}/12</td>
                <td>{new Date(a.criado_em).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
