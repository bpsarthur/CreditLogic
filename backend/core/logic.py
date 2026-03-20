"""
Motor de Decisão para Aprovação de Crédito baseado em Tabela Verdade.

12 Proposições Lógicas:
    P1:  Renda mensal >= R$ 2.000
    P2:  Não possui restrições no CPF (SPC/Serasa)
    P3:  Idade entre 18 e 65 anos
    P4:  Tempo de emprego >= 6 meses
    P5:  Não possui empréstimo ativo em atraso
    P6:  Score de crédito >= 500
    P7:  Possui conta bancária ativa
    P8:  Residência estável (mesmo endereço >= 1 ano)
    P9:  Não é réu em ação judicial financeira
    P10: Renda comprometida < 30%
    P11: Possui ao menos 1 referência pessoal verificável
    P12: Documentação completa e válida

Regras de Decisão (Tabela Verdade simplificada):
    - APROVADO se:
        (P1 ∧ P2 ∧ P3 ∧ P6 ∧ P12) ∧ (total_verdadeiras >= 8)
        Ou seja: as proposições obrigatórias devem ser verdadeiras
        E pelo menos 8 das 12 proposições devem ser verdadeiras.
    - REPROVADO caso contrário.
"""

PROPOSICOES = [
    {"id": "p1", "descricao": "Renda mensal >= R$ 2.000", "obrigatoria": True},
    {"id": "p2", "descricao": "Não possui restrições no CPF (SPC/Serasa)", "obrigatoria": True},
    {"id": "p3", "descricao": "Idade entre 18 e 65 anos", "obrigatoria": True},
    {"id": "p4", "descricao": "Tempo de emprego >= 6 meses", "obrigatoria": False},
    {"id": "p5", "descricao": "Não possui empréstimo ativo em atraso", "obrigatoria": False},
    {"id": "p6", "descricao": "Score de crédito >= 500", "obrigatoria": True},
    {"id": "p7", "descricao": "Possui conta bancária ativa", "obrigatoria": False},
    {"id": "p8", "descricao": "Residência estável (mesmo endereço >= 1 ano)", "obrigatoria": False},
    {"id": "p9", "descricao": "Não é réu em ação judicial financeira", "obrigatoria": False},
    {"id": "p10", "descricao": "Renda comprometida < 30%", "obrigatoria": False},
    {"id": "p11", "descricao": "Possui ao menos 1 referência pessoal verificável", "obrigatoria": False},
    {"id": "p12", "descricao": "Documentação completa e válida", "obrigatoria": True},
]


def avaliar_credito(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12):
    """
    Avalia a aprovação de crédito com base nas 12 proposições.

    Retorna dict com:
        - resultado: "APROVADO" ou "REPROVADO"
        - expressao_logica: string com a expressão avaliada
        - total_verdadeiras: int com total de proposições verdadeiras
    """
    valores = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12]
    total_verdadeiras = sum(1 for v in valores if v)

    # Proposições obrigatórias: P1, P2, P3, P6, P12
    obrigatorias_ok = p1 and p2 and p3 and p6 and p12
    minimo_ok = total_verdadeiras >= 8

    resultado = "APROVADO" if (obrigatorias_ok and minimo_ok) else "REPROVADO"

    # Montar expressão lógica legível
    partes = []
    for i, v in enumerate(valores, 1):
        simbolo = "V" if v else "F"
        partes.append(f"P{i}={simbolo}")

    expressao = (
        f"({' ∧ '.join(partes)})\n"
        f"Obrigatórias (P1∧P2∧P3∧P6∧P12) = {'V' if obrigatorias_ok else 'F'}\n"
        f"Total verdadeiras = {total_verdadeiras}/12 (mínimo 8) = {'V' if minimo_ok else 'F'}\n"
        f"Resultado = {'APROVADO' if resultado == 'APROVADO' else 'REPROVADO'}"
    )

    return {
        "resultado": resultado,
        "expressao_logica": expressao,
        "total_verdadeiras": total_verdadeiras,
    }
