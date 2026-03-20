import { useState, useEffect } from 'react';
import { adminAnalises } from '../../services/api';

export default function AdminAnalises() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [resultado, setResultado] = useState('');
  const [busca, setBusca] = useState('');

  const fetchData = () => {
    const params = { page };
    if (resultado) params.resultado = resultado;
    if (busca) params.busca = busca;
    adminAnalises(params).then((res) => setData(res.data));
  };

  useEffect(() => {
    fetchData();
  }, [page, resultado]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  if (!data) return <div className="loading">Carregando...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Análises</h1>
        <p>{data.total} registros encontrados</p>
      </div>

      <form className="filters-bar" onSubmit={handleSearch}>
        <div className="input-group">
          <label>Buscar por nome</label>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Nome do solicitante..."
          />
        </div>
        <div className="input-group">
          <label>Resultado</label>
          <select value={resultado} onChange={(e) => { setResultado(e.target.value); setPage(1); }}>
            <option value="">Todos</option>
            <option value="APROVADO">Aprovado</option>
            <option value="REPROVADO">Reprovado</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Filtrar</button>
      </form>

      <div className="card" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Resultado</th>
              <th>Verdadeiras</th>
              <th>IP</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.nome_solicitante}</td>
                <td>
                  <span className={`badge ${a.resultado === 'APROVADO' ? 'badge-success' : 'badge-danger'}`}>
                    {a.resultado}
                  </span>
                </td>
                <td>{a.total_verdadeiras}/12</td>
                <td>{a.ip_address}</td>
                <td>{new Date(a.criado_em).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.total_pages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
          {Array.from({ length: data.total_pages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>
              {p}
            </button>
          ))}
          <button disabled={page >= data.total_pages} onClick={() => setPage(page + 1)}>Próximo</button>
        </div>
      )}
    </div>
  );
}
