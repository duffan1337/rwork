from django.shortcuts import render, redirect
from django.views import View

#from cabinet.forms import WorkCreationForm
from order.models import Order
from works.models import Work


# Create your views here.

class BuyWork(View):
    template_name = 'cabinet/my_works.html'

    def post(self, request):
        work_id = request.POST.get('work_id')  # Предположим, что вы передаете work_id через форму
        print(work_id)
        # Получите информацию о текущем пользователе (предположим, что пользователь аутентифицирован)
        user = request.user

        # Создайте новый объект Order и сохраните его
        new_order = Order.objects.create(user_id=user.id, work_id=work_id)

        work = new_order.work()

        # Инкрементируйте поле count_purchase на 1
        work.count_purchases += 1

        # Сохраните обновленную работу
        work.save()

        # Получите все заказы пользователя, включая новый заказ
        all_orders = Order.objects.filter(user_id=user.id)
        works = [order.work() for order in all_orders]  # Создаем список работ из всех заказов

        context = {'works': works}
        return render(request, self.template_name, context)
