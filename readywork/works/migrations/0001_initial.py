# Generated by Django 4.2.4 on 2023-09-12 05:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Work',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField()),
                ('worktype_id', models.IntegerField()),
                ('subject_id', models.IntegerField()),
                ('user_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('direction_id', models.IntegerField()),
                ('work_theme', models.CharField(max_length=255)),
                ('pages', models.IntegerField()),
                ('content', models.TextField()),
                ('excerpt', models.TextField()),
                ('literature', models.TextField()),
                ('dop_info', models.TextField()),
                ('download_template', models.CharField(max_length=255)),
                ('status', models.IntegerField()),
                ('order_status', models.IntegerField()),
                ('admin_info', models.TextField()),
                ('count_purchases', models.IntegerField()),
                ('old_slug', models.CharField(max_length=255)),
                ('moder_status', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Worktype',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField()),
                ('custom_name', models.CharField(max_length=255)),
                ('padezh', models.CharField(max_length=255)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Direction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=255)),
                ('status', models.BooleanField()),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='works.subject')),
            ],
        ),
    ]