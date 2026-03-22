import { useState, useEffect } from 'react';
import { adminLogs } from '../../services/api';

function getPageNumbers(current, total) {
  const pages = new Set([1, total]);
  for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) {
    pages.add(i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...');
    result.push(sorted[i]);
  }
  return result;
}

export default function AdminLogs() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [metodo, setMetodo] = useState('');

  useEffect(() => {
    setError(null);
    const params = { page };
    if (metodo) params.metodo = metodo;
    adminLogs(params)
      .then((res) => setData(res.data))
      .catch(() => setError('Erro ao carregar logs.'));
  }, [page, metodo]);

  if (error) return <div className="loading">{error}</div>;
  if (!data) return <div className="loading">Carregando...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Logs de Acesso</h1>
        <p>{data.total} registros</p>
      </div>

      <div className="filters-bar">
        <div className="input-group">
          <label>Método HTTP</label>
          <select value={metodo} onChange={(e) => { setMetodo(e.target.value); setPage(1); }}>
            <option value="">Todos</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Método</th>
              <th>Página</th>
              <th>IP</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td><span className="badge badge-success">{log.metodo_http}</span></td>
                <td>{log.pagina_acessada}</td>
                <td>{log.ip_address}</td>
                <td>{new Date(log.criado_em).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.total_pages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
          {getPageNumbers(page, data.total_pages).map((p, i) =>
            p === '...'
              ? <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: 'var(--text-muted)' }}>…</span>
              : <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
          )}
          <button disabled={page >= data.total_pages} onClick={() => setPage(page + 1)}>Próximo</button>
        </div>
      )}
    </div>
  );
}
