from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Author, Course, Formula
from .serializers import CategorySerializer, AuthorSerializer, CourseSerializer, FormulaSerializer
from django.http import JsonResponse


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    @action(detail=True, methods=['get'], url_path='formulas')
    def formulas(self, request, pk=None):
        """/api/authors/<pk>/formulas/"""
        author = self.get_object()
        count = author.formulas.count()
        return Response({
            "author_id": author.id,
            "author_name": author.name,
            "formula_count": count
        })

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    @action(detail=True, methods=['get'], url_path='formulas')
    def formulas(self, request, pk=None):
        """/api/courses/<pk>/formulas/"""
        course = self.get_object()
        formulas = course.formulas.all()
        serializer = FormulaSerializer(formulas, many=True)
        return Response(serializer.data)

class FormulaViewSet(viewsets.ModelViewSet):
    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer

    @action(detail=False, methods=['get'], url_path='count-by-category')
    def count_by_category(self, request):
        """/api/formulas/count-by-category/?category_id=<ID>"""
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response({'error': 'Параметр "category_id" обязателен'}, status=400)
        count = Formula.objects.filter(category__id=category_id).count()
        return Response({'category_id': category_id, 'formula_count': count})

def add_formula(request):
    if request.method == "POST":
        title = request.POST.get("title", "Новая формула")
        field = request.POST.get("field", "Не указано")
        short_description = request.POST.get("short_description", "")
        full_description = request.POST.get("full_description", "")
        category_name = request.POST.get("category", "Без категории")
        authors_input = request.POST.get("authors", "")
        courses_input = request.POST.get("courses", "")
        history = request.POST.get("history", "")

        author_photo = None
        if 'author_photo' in request.FILES:
            author_photo = request.FILES['author_photo']

        category, _ = Category.objects.get_or_create(name=category_name)

        formula = Formula.objects.create(
            title=title,
            field=field,
            short_description=short_description,
            full_description=full_description,
            category=category,
            history=history,
            author_photo=author_photo
        )

        if authors_input:
            for author_name in authors_input.split(','):
                author_name = author_name.strip()
                if author_name:
                    author, _ = Author.objects.get_or_create(name=author_name)
                    formula.authors.add(author)

        if courses_input:
            for course_title in courses_input.split(','):
                course_title = course_title.strip()
                if course_title:
                    course, _ = Course.objects.get_or_create(title=course_title)
                    formula.courses.add(course)

        return JsonResponse({"status": "ok", "id": formula.id})

    return JsonResponse({"error": "Метод не POST"}, status=400)

def delete_formula(request, formula_id):
    formula = get_object_or_404(Formula, pk=formula_id)
    formula.delete()
    return redirect("formula_list")

def my_view(request):
    categories = Category.objects.all()
    return render(request, 'my_template.html', {'categories': categories})