import random
from django.core.management.base import BaseCommand
from faker import Faker
from core.models import Analise
from core.logic import avaliar_credito

fake = Faker("pt_BR")


class Command(BaseCommand):
    help = "Gera 50 análises fictícias de crédito"

    def handle(self, *args, **options):
        self.stdout.write("Gerando 50 análises fictícias...")

        for _ in range(50):
            props = {f"p{i}": random.choice([True, False]) for i in range(1, 13)}

            resultado = avaliar_credito(**props)

            Analise.objects.create(
                nome_solicitante=fake.name(),
                **props,
                total_verdadeiras=resultado["total_verdadeiras"],
                resultado=resultado["resultado"],
                expressao_logica=resultado["expressao_logica"],
                ip_address=fake.ipv4(),
                user_agent=fake.user_agent(),
            )

        self.stdout.write(self.style.SUCCESS("50 análises criadas com sucesso!"))
