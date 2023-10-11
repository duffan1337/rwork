from django.db import models
class Works(models.Model):
    user_id = models.IntegerField()
    worktype_id = models.IntegerField()
    subject_id = models.IntegerField()
    user_price = models.DecimalField(max_digits=10, decimal_places=2)
    direction_id = models.IntegerField()
    work_theme = models.CharField(max_length=255)
    pages = models.IntegerField()
    content = models.TextField()
    excerpt = models.TextField()
    literature = models.TextField()
    dop_info = models.TextField()
    download_template = models.CharField(max_length=255)
    status = models.IntegerField()
    order_status = models.IntegerField()
    admin_info = models.TextField()
    count_purchases = models.IntegerField()
    old_slug = models.CharField(max_length=255)
    moder_status = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.work_theme