from rest_framework import serializers
from .models import Category, Author, Course, Formula

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')             # или '__all__', если хотите все поля

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('id', 'name')

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'title')

class FormulaSerializer(serializers.ModelSerializer):
    # вот здесь «вкладываем» другие сериализаторы
    category = CategorySerializer(read_only=True)
    authors  = AuthorSerializer(many=True, read_only=True)
    courses  = CourseSerializer(many=True, read_only=True)

    class Meta:
        model = Formula
        fields = (
            'id',
            'title',
            'field',
            'short_description',
            'full_description',
            'history',
            'author_photo',
            'category',
            'authors',
            'courses',
        )
