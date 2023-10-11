from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.views import View

from user.forms import UserCreationForm


# Create your views here.

class Register(View):
    template_name = 'registration/register.html'

    def get(self, request):
        context = {'form': UserCreationForm()}
        return render(request, self.template_name, context)

    def post(self, request):
        form = UserCreationForm(request.POST)

        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password1'])
            user.save()
            role = form.cleaned_data.get('role')
            user.role = role
            user.save()
            login(request, user)
            return redirect('home')
        context = {
            'form': form
        }
        return render(request, self.template_name, context)