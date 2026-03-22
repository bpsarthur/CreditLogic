import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { adminStats } from '../../services/api';

const COLORS = { aprovado: '#3fb950', reprovado: '#f85149', accent: '#58a6ff' };

export default function AdminStats() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminStats()
      .then((res) => setData(res.data))
      .catch(() => setError('Erro ao carregar estatísticas.'));
  }, []);

  if (error) return <div className="loading">{error}</div>;
  if (!data) return <div className="loading">Carregando...</div>;

  const pieData = [
    { name: 'Aprovados', value: data.aprovados },
    { name: 'Reprovados', value: data.reprovados },
  ];

  const propData = Object.entries(data.proposicoes_stats).map(([key, val]) => ({
    name: key.toUpperCase(),
    taxa: val.taxa,
  }));

  const porDia = [...data.por_dia].reverse().map((d) => ({
    data: d.data,
    total: d.total,
    aprovados: d.aprovados,
  }));

  return (
    <div className="container">
      <div className="page-header">
        <h1>Estatísticas</h1>
        <p>Análise detalhada dos dados</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{data.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: COLORS.aprovado }}>{data.aprovados}</div>
          <div className="stat-label">Aprovados</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: COLORS.reprovado }}>{data.reprovados}</div>
          <div className="stat-label">Reprovados</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.taxa_aprovacao}%</div>
          <div className="stat-label">Taxa de Aprovação</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="chart-container">
          <h3>Aprovados vs Reprovados</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                <Cell fill={COLORS.aprovado} />
                <Cell fill={COLORS.reprovado} />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Taxa de Veracidade por Proposição</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={propData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="name" stroke="#8b949e" fontSize={12} />
              <YAxis stroke="#8b949e" />
              <Tooltip contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', color: '#c9d1d9' }} />
              <Bar dataKey="taxa" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {porDia.length > 0 && (
        <div className="chart-container">
          <h3>Análises por Dia</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={porDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="data" stroke="#8b949e" fontSize={12} />
              <YAxis stroke="#8b949e" />
              <Tooltip contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', color: '#c9d1d9' }} />
              <Line type="monotone" dataKey="total" stroke={COLORS.accent} strokeWidth={2} />
              <Line type="monotone" dataKey="aprovados" stroke={COLORS.aprovado} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="chart-container">
        <h3>Distribuição de Proposições Verdadeiras</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.distribuicao_proposicoes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            <XAxis dataKey="total_verdadeiras" stroke="#8b949e" label={{ value: 'Verdadeiras', position: 'insideBottom', offset: -5, fill: '#8b949e' }} />
            <YAxis stroke="#8b949e" />
            <Tooltip contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', color: '#c9d1d9' }} />
            <Bar dataKey="count" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
