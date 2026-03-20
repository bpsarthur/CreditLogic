import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarAnalise, getTabelaVerdade } from '../services/api';

const TOTAL_STEPS = 13; // 0=nome, 1-12=proposições

export default function Home() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [nome, setNome] = useState('');
  const [proposicoes, setProposicoes] = useState([]);
  const [valores, setValores] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getTabelaVerdade().then((res) => {
      setProposicoes(res.data.proposicoes);
    });
  }, []);

  const currentProp = step >= 1 && step <= 12 ? proposicoes[step - 1] : null;
  const isLastQuestion = step === 12;
  const isSummary = step === TOTAL_STEPS;
  const progress = Math.round((step / TOTAL_STEPS) * 100);

  const canAdvance = () => {
    if (step === 0) return nome.trim().length > 0;
    if (step >= 1 && step <= 12) {
      const prop = proposicoes[step - 1];
      return prop && valores[prop.id] !== undefined;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (!canAdvance()) {
      if (step === 0) setError('Informe o nome do solicitante');
      else setError('Selecione Sim ou Não para continuar');
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError('');
    setStep((s) => s - 1);
  };

  const handleAnswer = (value) => {
    const prop = proposicoes[step - 1];
    setValores((prev) => ({ ...prev, [prop.id]: value }));
    setError('');
  };

  const goToStep = (targetStep) => {
    setError('');
    setStep(targetStep);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const payload = { nome_solicitante: nome, ...valores };
      const res = await criarAnalise(payload);
      navigate('/resultado', { state: { analise: res.data } });
    } catch {
      setError('Erro ao processar análise. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  if (proposicoes.length === 0) {
    return <div className="container"><p className="loading">Carregando...</p></div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Análise de Crédito</h1>
        <p>Responda as perguntas abaixo para avaliar a aprovação de crédito</p>
      </div>

      <div className="wizard-progress">
        <div className="wizard-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="wizard-step-label">
        {isSummary ? 'Resumo' : `Pergunta ${step + 1} de ${TOTAL_STEPS}`}
      </p>

      {/* Etapa 0: Nome */}
      {step === 0 && (
        <div className="card wizard-card">
          <div className="card-header">Dados do Solicitante</div>
          <div className="input-group">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => { setNome(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="Digite o nome do solicitante"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Etapas 1-12: Proposições */}
      {currentProp && (
        <div className="card wizard-card">
          <div className="card-header">
            {currentProp.id.toUpperCase()}
            {currentProp.obrigatoria && <span className="tag">Obrigatória</span>}
          </div>
          <p className="wizard-question">{currentProp.descricao}</p>
          <div className="wizard-answers">
            <button
              type="button"
              className={`btn wizard-btn-yes ${valores[currentProp.id] === true ? 'selected' : ''}`}
              onClick={() => handleAnswer(true)}
            >
              Sim
            </button>
            <button
              type="button"
              className={`btn wizard-btn-no ${valores[currentProp.id] === false ? 'selected' : ''}`}
              onClick={() => handleAnswer(false)}
            >
              Não
            </button>
          </div>
        </div>
      )}

      {/* Etapa 13: Resumo */}
      {isSummary && (
        <div className="card wizard-card">
          <div className="card-header">Resumo da Análise</div>
          <div className="wizard-summary">
            <div className="wizard-summary-row" onClick={() => goToStep(0)}>
              <span className="wizard-summary-label">Nome</span>
              <span className="wizard-summary-value">{nome}</span>
              <span className="wizard-summary-edit">editar</span>
            </div>
            {proposicoes.map((p, i) => (
              <div key={p.id} className="wizard-summary-row" onClick={() => goToStep(i + 1)}>
                <span className="wizard-summary-label">
                  {p.id.toUpperCase()}
                  {p.obrigatoria && <span className="tag">Obrigatória</span>}
                </span>
                <span className={`wizard-summary-value ${valores[p.id] ? 'text-success' : 'text-danger'}`}>
                  {valores[p.id] ? 'Sim' : 'Não'}
                </span>
                <span className="wizard-summary-edit">editar</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="error-msg">{error}</p>}

      {/* Navegação */}
      <div className="wizard-nav">
        {step > 0 && (
          <button type="button" className="btn btn-secondary" onClick={handleBack}>
            Voltar
          </button>
        )}
        <div className="wizard-nav-spacer" />
        {isSummary ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Analisando...' : 'Analisar Crédito'}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
          >
            {isLastQuestion ? 'Ver Resumo' : 'Próximo'}
          </button>
        )}
      </div>
    </div>
  );
}
