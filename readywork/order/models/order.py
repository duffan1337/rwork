from django.db import models
from user.models.user import User
from works.models.work import Work


class Order(models.Model):
    user_id = models.IntegerField()
    work_id = models.IntegerField()  # Ссылка на работу (аналогично вам придется создать связь с Works моделью)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def work(self):
        # Связь с Works моделью, используя w_id
        return Work.objects.get(id=self.work_id)

    def user(self):
        # Связь с пользователем
        return User.objects.get(id=self.user_id)

    def get_work(self):
        # Аналогично work(), связь с Works моделью, используя w_id
        return Work.objects.get(id=self.w_id)

    def __str__(self):
        return f"Order for {self.user}: {self.lmi_payment_amount} {self.lmi_currency}"
