from rest_framework import serializers
from .models import Analise, AcessoLog


class AnaliseInputSerializer(serializers.Serializer):
    nome_solicitante = serializers.CharField(max_length=200)
    p1 = serializers.BooleanField()
    p2 = serializers.BooleanField()
    p3 = serializers.BooleanField()
    p4 = serializers.BooleanField()
    p5 = serializers.BooleanField()
    p6 = serializers.BooleanField()
    p7 = serializers.BooleanField()
    p8 = serializers.BooleanField()
    p9 = serializers.BooleanField()
    p10 = serializers.BooleanField()
    p11 = serializers.BooleanField()
    p12 = serializers.BooleanField()


class AnaliseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analise
        fields = "__all__"


class AcessoLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcessoLog
        fields = "__all__"
