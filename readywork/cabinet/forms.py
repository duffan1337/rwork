# from django import forms
# from works.models import *
# class WorkCreationForm(forms.Form):
#     work_theme = forms.CharField(max_length=255, label="Название темы работы")
#     worktype_id = forms.ModelChoiceField(
#         queryset=Worktype.objects.all(),  # Здесь вы выбираете все объекты из модели WorkType
#         empty_label=None,  # Если не хотите, чтобы была пустая метка в поле выбора
#         label="Тип работы"
#     )
#     subject_id = forms.ModelChoiceField(
#         queryset=Subject.objects.all(),  # Здесь вы выбираете все объекты из модели Subject
#         empty_label=None,  # Если не хотите, чтобы была пустая метка в поле выбора
#         label="Предмет"
#     )
#     direction_id = forms.ModelChoiceField(
#         queryset=Direction.objects.all(),  # Здесь вы выбираете все объекты из модели Subject
#         empty_label=None,  # Если не хотите, чтобы была пустая метка в поле выбора
#         label="Направление"
#     )
#     pages = forms.IntegerField(label="Количество страниц")
#     user_price = forms.DecimalField(label="Желаемая стоимость продажи", max_digits=10, decimal_places=2)
#     content = forms.CharField(widget=forms.Textarea, label="Содержание")
#     excerpt = forms.CharField(widget=forms.Textarea, label="Выдержки из работы")
#     literature = forms.CharField(widget=forms.Textarea, label="Список литературы")
#     status = forms.BooleanField(label="Новая работа", required=False)
#     download_template = forms.FileField(label="Файл")
#
# class WorkCreationForm(forms.Form):
#     work_theme = forms.CharField(max_length=255, label="Название темы работы")
#     worktype_id = forms.ModelChoiceField(
#         queryset=Worktype.objects.all(),  # Здесь вы выбираете все объекты из модели WorkType
#         empty_label=None,  # Если не хотите, чтобы была пустая метка в поле выбора
#         label="Тип работы"
#     )
#     subject_id = forms.ModelChoiceField(
#         queryset=Subject.objects.all(),  # Здесь вы выбираете все объекты из модели Subject
#         empty_label=None,  # Если не хотите, чтобы была пустая метка в поле выбора
#         label="Предмет"
#     )
#     direction_id = forms.ModelChoiceField(
#         queryset=Direction.objects.all(),  # Здесь вы выбираете все объекты из модели Subject
#         empty_label=None,  # Если не хотите, чтобы была пустая метка в поле выбора
#         label="Направление"
#     )
#     pages = forms.IntegerField(label="Количество страниц")
#     user_price = forms.DecimalField(label="Желаемая стоимость продажи", max_digits=10, decimal_places=2)
#     content = forms.CharField(widget=forms.Textarea, label="Содержание")
#     excerpt = forms.CharField(widget=forms.Textarea, label="Выдержки из работы")
#     literature = forms.CharField(widget=forms.Textarea, label="Список литературы")
#     status = forms.BooleanField(label="Новая работа", required=False)
#     download_template = forms.FileField(label="Файл")
#
#
#
#
