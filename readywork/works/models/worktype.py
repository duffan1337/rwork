from django.db import models

from works.models.work import Work


class Worktype(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField()
    custom_name = models.CharField(max_length=255)
    padezh = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def work(self):
        # Связь с Works моделью, используя worktype_id
        return Work.objects.filter(worktype_id=self.id)

    def __str__(self):
        return self.name