import json
import functools
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Count, Q
from django.db.models.functions import TruncDate

from .models import Analise, AcessoLog
from .serializers import AnaliseSerializer, AcessoLogSerializer

ADMIN_USER = "admin"
ADMIN_PASS = "creditlogic2026"


def admin_required(view_func):
    @functools.wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.session.get("admin_logged_in"):
            return JsonResponse({"error": "Não autorizado"}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper


@csrf_exempt
@require_http_methods(["POST"])
def admin_login(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    username = data.get("username", "")
    password = data.get("password", "")

    if username == ADMIN_USER and password == ADMIN_PASS:
        request.session["admin_logged_in"] = True
        return JsonResponse({"message": "Login realizado com sucesso"})

    return JsonResponse({"error": "Credenciais inválidas"}, status=401)


@csrf_exempt
@require_http_methods(["POST"])
def admin_logout(request):
    request.session.flush()
    return JsonResponse({"message": "Logout realizado"})


@require_http_methods(["GET"])
def admin_check(request):
    if request.session.get("admin_logged_in"):
        return JsonResponse({"authenticated": True})
    return JsonResponse({"authenticated": False}, status=401)


@admin_required
@require_http_methods(["GET"])
def admin_dashboard(request):
    total = Analise.objects.count()
    aprovados = Analise.objects.filter(resultado="APROVADO").count()
    reprovados = Analise.objects.filter(resultado="REPROVADO").count()
    taxa_aprovacao = round((aprovados / total * 100), 1) if total > 0 else 0

    ultimas = Analise.objects.order_by("-criado_em")[:5]

    return JsonResponse({
        "total_analises": total,
        "aprovados": aprovados,
        "reprovados": reprovados,
        "taxa_aprovacao": taxa_aprovacao,
        "ultimas_analises": AnaliseSerializer(ultimas, many=True).data,
    })


@admin_required
@require_http_methods(["GET"])
def admin_analises(request):
    queryset = Analise.objects.all()

    resultado = request.GET.get("resultado")
    if resultado in ("APROVADO", "REPROVADO"):
        queryset = queryset.filter(resultado=resultado)

    busca = request.GET.get("busca")
    if busca:
        queryset = queryset.filter(nome_solicitante__icontains=busca)

    try:
        page = max(1, int(request.GET.get("page", 1)))
        page_size = min(100, max(1, int(request.GET.get("page_size", 20))))
    except (ValueError, TypeError):
        return JsonResponse({"error": "Parâmetros de paginação inválidos"}, status=400)

    total = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size

    analises = queryset[start:end]

    return JsonResponse({
        "results": AnaliseSerializer(analises, many=True).data,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size if total > 0 else 1,
    })


@admin_required
@require_http_methods(["GET"])
def admin_logs(request):
    queryset = AcessoLog.objects.all()

    metodo = request.GET.get("metodo")
    if metodo:
        queryset = queryset.filter(metodo_http=metodo)

    try:
        page = max(1, int(request.GET.get("page", 1)))
        page_size = min(100, max(1, int(request.GET.get("page_size", 20))))
    except (ValueError, TypeError):
        return JsonResponse({"error": "Parâmetros de paginação inválidos"}, status=400)

    total = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size

    logs = queryset[start:end]

    return JsonResponse({
        "results": AcessoLogSerializer(logs, many=True).data,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size if total > 0 else 1,
    })


@admin_required
@require_http_methods(["GET"])
def admin_stats(request):
    total = Analise.objects.count()
    aprovados = Analise.objects.filter(resultado="APROVADO").count()
    reprovados = Analise.objects.filter(resultado="REPROVADO").count()

    # Análises por dia (últimos 30 registros agrupados por data)
    por_dia = (
        Analise.objects.annotate(data=TruncDate("criado_em"))
        .values("data")
        .annotate(total=Count("id"), aprovados=Count("id", filter=Q(resultado="APROVADO")))
        .order_by("-data")[:30]
    )

    # Distribuição de proposições verdadeiras
    dist_props = (
        Analise.objects.values("total_verdadeiras")
        .annotate(count=Count("id"))
        .order_by("total_verdadeiras")
    )

    # Taxa de cada proposição
    prop_stats = {}
    for i in range(1, 13):
        campo = f"p{i}"
        verdadeiras = Analise.objects.filter(**{campo: True}).count()
        prop_stats[campo] = {
            "verdadeiras": verdadeiras,
            "falsas": total - verdadeiras,
            "taxa": round((verdadeiras / total * 100), 1) if total > 0 else 0,
        }

    return JsonResponse({
        "total": total,
        "aprovados": aprovados,
        "reprovados": reprovados,
        "taxa_aprovacao": round((aprovados / total * 100), 1) if total > 0 else 0,
        "por_dia": list(por_dia),
        "distribuicao_proposicoes": list(dist_props),
        "proposicoes_stats": prop_stats,
    })
