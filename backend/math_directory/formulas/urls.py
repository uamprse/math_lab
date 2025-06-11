from django.urls import path, include
from . import views
from .views import add_formula, delete_formula
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, AuthorViewSet, CourseViewSet, FormulaViewSet


router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'formulas', FormulaViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('', views.formula_list, name='formula_list'),
    path('<int:pk>/', views.formula_detail, name='formula_detail'),
    path("add/", add_formula, name="add_formula"),
    path("delete/<int:formula_id>/", delete_formula, name="delete_formula"),
]
