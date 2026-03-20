from django.db import models


class Analise(models.Model):
    RESULTADO_CHOICES = [
        ("APROVADO", "Aprovado"),
        ("REPROVADO", "Reprovado"),
    ]

    nome_solicitante = models.CharField(max_length=200)
    p1 = models.BooleanField(default=False)
    p2 = models.BooleanField(default=False)
    p3 = models.BooleanField(default=False)
    p4 = models.BooleanField(default=False)
    p5 = models.BooleanField(default=False)
    p6 = models.BooleanField(default=False)
    p7 = models.BooleanField(default=False)
    p8 = models.BooleanField(default=False)
    p9 = models.BooleanField(default=False)
    p10 = models.BooleanField(default=False)
    p11 = models.BooleanField(default=False)
    p12 = models.BooleanField(default=False)
    total_verdadeiras = models.IntegerField(default=0)
    resultado = models.CharField(max_length=10, choices=RESULTADO_CHOICES)
    expressao_logica = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, default="")
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-criado_em"]
        verbose_name_plural = "Análises"

    def __str__(self):
        return f"{self.nome_solicitante} - {self.resultado}"


class AcessoLog(models.Model):
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, default="")
    pagina_acessada = models.CharField(max_length=500)
    metodo_http = models.CharField(max_length=10)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-criado_em"]
        verbose_name_plural = "Logs de Acesso"

    def __str__(self):
        return f"{self.metodo_http} {self.pagina_acessada} - {self.ip_address}"
