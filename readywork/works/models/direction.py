from django.db import models
#from works.models.subject import Subject
from works.models.work import Work


class Direction(models.Model):
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE)  # Связь с моделью Subjects
    name = models.CharField(max_length=255)  # Название направления
    slug = models.SlugField(max_length=255)  # URL-подходящая версия названия направления
    status = models.BooleanField()  # Статус направления (активно/неактивно)

    def __str__(self):
        return self.name  # Строковое представление объекта: имя направления

    def work(self):
        # Связь с моделью Works через ForeignKey
        return Work.objects.filter(direction_id=self.id)