from django.urls import path
from . import views, admin_views

urlpatterns = [
    # API pública
    path("api/analise/", views.criar_analise, name="criar_analise"),
    path("api/tabela-verdade/", views.tabela_verdade, name="tabela_verdade"),

    # Admin
    path("api/admin/login/", admin_views.admin_login, name="admin_login"),
    path("api/admin/logout/", admin_views.admin_logout, name="admin_logout"),
    path("api/admin/check/", admin_views.admin_check, name="admin_check"),
    path("api/admin/dashboard/", admin_views.admin_dashboard, name="admin_dashboard"),
    path("api/admin/analises/", admin_views.admin_analises, name="admin_analises"),
    path("api/admin/logs/", admin_views.admin_logs, name="admin_logs"),
    path("api/admin/stats/", admin_views.admin_stats, name="admin_stats"),
]
