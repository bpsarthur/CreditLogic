import { useState, useEffect } from 'react';
import { getTabelaVerdade } from '../services/api';

export default function TabelaVerdade() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getTabelaVerdade().then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="loading">Carregando...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Tabela Verdade</h1>
        <p>Entenda as regras do motor de decisão de crédito</p>
      </div>

      <div className="card">
        <div className="card-header">Fórmula de Decisão</div>
        <div className="formula-box">
          {data.regras.formula}
        </div>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>
          As proposições obrigatórias devem ser VERDADEIRAS e o total de proposições verdadeiras deve ser &ge; {data.regras.minimo_verdadeiras}
        </p>
      </div>

      <div className="card">
        <div className="card-header">Proposições</div>
        {data.proposicoes.map((p) => (
          <div key={p.id} className={`rule-card ${p.obrigatoria ? 'required' : ''}`}>
            <strong>{p.id.toUpperCase()}</strong>: {p.descricao}
            {p.obrigatoria && (
              <span className="badge badge-danger" style={{ marginLeft: '0.75rem' }}>
                Obrigatória
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">Fluxo de Decisão</div>
        <div style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.8' }}>
          <p><strong>1.</strong> Verificar se as proposições obrigatórias (P1, P2, P3, P6, P12) são VERDADEIRAS</p>
          <p style={{ paddingLeft: '1.5rem', color: 'var(--danger)' }}>
            Se alguma for FALSA → REPROVADO
          </p>
          <p><strong>2.</strong> Contar o total de proposições verdadeiras (P1 a P12)</p>
          <p style={{ paddingLeft: '1.5rem', color: 'var(--danger)' }}>
            Se total &lt; 8 → REPROVADO
          </p>
          <p style={{ paddingLeft: '1.5rem', color: 'var(--success)' }}>
            Se total &ge; 8 → APROVADO
          </p>
        </div>
      </div>
    </div>
  );
}
