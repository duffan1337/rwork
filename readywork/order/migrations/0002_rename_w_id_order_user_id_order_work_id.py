# Generated by Django 4.2.4 on 2023-09-08 08:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='w_id',
            new_name='user_id',
        ),
        migrations.AddField(
            model_name='order',
            name='work_id',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]