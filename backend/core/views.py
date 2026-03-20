from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Analise
from .serializers import AnaliseInputSerializer, AnaliseSerializer
from .logic import avaliar_credito, PROPOSICOES


def get_client_ip(request):
    x_forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded:
        return x_forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


@api_view(["POST"])
def criar_analise(request):
    serializer = AnaliseInputSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    dados = serializer.validated_data
    props = {f"p{i}": dados[f"p{i}"] for i in range(1, 13)}

    resultado = avaliar_credito(**props)

    analise = Analise.objects.create(
        nome_solicitante=dados["nome_solicitante"],
        **props,
        total_verdadeiras=resultado["total_verdadeiras"],
        resultado=resultado["resultado"],
        expressao_logica=resultado["expressao_logica"],
        ip_address=get_client_ip(request),
        user_agent=request.META.get("HTTP_USER_AGENT", ""),
    )

    return Response(AnaliseSerializer(analise).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def tabela_verdade(request):
    return Response({
        "proposicoes": PROPOSICOES,
        "regras": {
            "obrigatorias": ["p1", "p2", "p3", "p6", "p12"],
            "minimo_verdadeiras": 8,
            "total_proposicoes": 12,
            "formula": "(P1 ∧ P2 ∧ P3 ∧ P6 ∧ P12) ∧ (total_verdadeiras >= 8)",
        },
    })
