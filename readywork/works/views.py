from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.views import View

from .forms import WorkCreationForm
from works.models import *

class WorksListView(View):
    """Детализация заявки"""
    template_name = "list_of_works.html"
    def get(self, request):
        worktypes = Worktype.objects.all()
        subject = Subject.objects.all()
        context = {
            'worktypes': worktypes,
            'subjects': subject,
        }
        return render(request, self.template_name, context)

class GetAllWorks(View):
    """Детализация заявки"""
    template_name = "home.html"
    def get(self, request):
        works = Work.objects.all().order_by('-created_at')
        context = {
            'works': works,
        }
        return render(request, self.template_name, context)

class PricesAndServices(View):
    template_name = "prices_and_services.html"
    def get(self, request):
        worktypes = Worktype.objects.all()
        context = {
            'worktypes': worktypes,
        }
        return render(request, self.template_name, context)

class WorkDetailed(View):
    template_name = "work_detailed.html"

    def get(self, request, work_id):
        work = get_object_or_404(Work, pk=work_id)  # Получаем работу по ее идентификатору
        user = request.user

        context = {
            'user': user,
            'work': work,
        }
        return render(request, self.template_name, context)


class AddOrder(View):

    def post(self, request):
        form = WorkCreationForm(request.POST, request.FILES)

        # if form.is_valid():
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