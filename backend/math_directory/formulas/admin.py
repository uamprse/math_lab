from django.contrib import admin
from .models import Formula, Category, Author, Course

admin.site.register(Formula)
admin.site.register(Category)
admin.site.register(Author)
admin.site.register(Course)