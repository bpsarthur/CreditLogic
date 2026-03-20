from rest_framework import serializers
from .models import Analise, AcessoLog


class AnaliseInputSerializer(serializers.Serializer):
    nome_solicitante = serializers.CharField(max_length=200)
    p1 = serializers.BooleanField(default=False)
    p2 = serializers.BooleanField(default=False)
    p3 = serializers.BooleanField(default=False)
    p4 = serializers.BooleanField(default=False)
    p5 = serializers.BooleanField(default=False)
    p6 = serializers.BooleanField(default=False)
    p7 = serializers.BooleanField(default=False)
    p8 = serializers.BooleanField(default=False)
    p9 = serializers.BooleanField(default=False)
    p10 = serializers.BooleanField(default=False)
    p11 = serializers.BooleanField(default=False)
    p12 = serializers.BooleanField(default=False)


class AnaliseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analise
        fields = "__all__"


class AcessoLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcessoLog
        fields = "__all__"
