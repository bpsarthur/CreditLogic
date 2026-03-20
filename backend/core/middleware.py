from .models import AcessoLog


class AcessoLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Não logar requisições de arquivos estáticos
        if not request.path.startswith("/static/"):
            try:
                x_forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
                ip = x_forwarded.split(",")[0].strip() if x_forwarded else request.META.get("REMOTE_ADDR")

                AcessoLog.objects.create(
                    ip_address=ip,
                    user_agent=request.META.get("HTTP_USER_AGENT", ""),
                    pagina_acessada=request.path,
                    metodo_http=request.method,
                )
            except Exception:
                pass

        return response
