from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Author(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='authors/', null=True, blank=True)

    def __str__(self):
        return self.name

class Course(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title


class Formula(models.Model):
    title = models.CharField(max_length=255)
    field = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    short_description = models.TextField()
    full_description = models.TextField()
    history = models.TextField(null=True, blank=True)
    author_photo = models.ImageField(upload_to='authors/', null=True, blank=True)
    authors = models.ManyToManyField(Author, related_name='formulas')
    courses = models.ManyToManyField(Course, related_name='formulas')

    class Meta:
        db_table = 'formulas'

    def __str__(self):
        return self.title

