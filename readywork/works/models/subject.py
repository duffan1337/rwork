from django.db import models

# from works.models.direction import Direction
from works.models.work import Work


class Subject(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    # Другие поля, если они есть

    def works(self):
        return Work.objects.filter(subject_id=self.id)

    def directions(self):
        return 'Direction'.objects.filter(subject_id=self.id)

    def direction_count(self):
        return self.directions().count()

    def __str__(self):
        return self.name