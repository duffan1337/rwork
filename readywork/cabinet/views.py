from django.shortcuts import render, redirect
from django.views import View

#from cabinet.forms import WorkCreationForm
from order.models import Order
from works.forms import WorkCreationForm
from works.models import *

# Create your views here.


class Profile(View):
    def get(self, request):
        user = request.user  # Получаем текущего пользователя

        if user.role == 'CLIENT':
            template_name = 'cabinet/client_profile.html'
        elif user.role == 'AUTHOR':
            template_name = 'cabinet/author_profile.html'
        return render(request, template_name)


class CreateWork(View):
    template_name = 'cabinet/create_work.html'

    def get(self, request):
        context = {'form': WorkCreationForm()}
        return render(request, self.template_name, context)

    def post(self, request):
        form = WorkCreationForm(request.POST, request.FILES)

        #if form.is_valid():
            # work = form.save(commit=False)
            # # Здесь вы можете дополнительно устанавливать поля работы, если это необходимо
            # #work.author = request.user  # Привязываем автора работы к текущему пользователю
            # # Сохраняем работу в базе данных
            # work.save()
            # return redirect('profile')
        if form.is_valid():
            # form.save()
            # Создаем новую работу, используя данные из формы
            work = Work(
                work_theme=form.cleaned_data['work_theme'],
                worktype_id=form.cleaned_data['worktype_id'].id,
                subject_id=form.cleaned_data['subject_id'].id,
                direction_id=form.cleaned_data['direction_id'].id,
                pages=form.cleaned_data['pages'],
                user_price=form.cleaned_data['user_price'],
                content=form.cleaned_data['content'],
                excerpt=form.cleaned_data['excerpt'],
                literature=form.cleaned_data['literature'],
                status=form.cleaned_data['status'],
                download_template=request.FILES['download_template'],  # Обработка файла
            )
            work.user_id = request.user.pk  # Привязываем автора работы к текущему пользователю
            work.dop_info = ""
            work.admin_info = ""
            work.count_purchases = 0
            work.old_slug = ""
            work.moder_status = 1
            work.order_status = 1
            work.save()
            return redirect('profile')

        context = {
            'form': form
        }
        return render(request, self.template_name, context)

class MyWorks(View):
    template_name = 'cabinet/my_works.html'

    def get(self, request):
        user = request.user  # Получаем текущего пользователя
        if user.role == "AUTHOR":
            works = Work.objects.filter(user_id=user.id)  # Фильтруем работы по user_id текущего пользователя
        else:
            try:
                # Получим все заказы для пользователя
                orders = Order.objects.filter(user_id=user.id)
                works = [order.work() for order in orders]  # Создаем список работ из всех заказов
            except Order.DoesNotExist:
                works = []
        context = {'works': works}
        return render(request, self.template_name, context)
