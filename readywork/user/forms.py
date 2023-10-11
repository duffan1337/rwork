from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class UserCreationForm(UserCreationForm):
    email = forms.EmailField(
        label=_("Email"),
        max_length=254,
        widget=forms.EmailInput(attrs={'autocomplete': 'email'})
    )
    role = forms.ChoiceField(
        label=_("Role"),
        choices=[
            ('CLIENT', 'Client'),  # Первый элемент в кортеже - значение, второй - отображаемый текст
            ('AUTHOR', 'Author'),  # Аналогично для других ролей, если есть
        ]
    )

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "email")