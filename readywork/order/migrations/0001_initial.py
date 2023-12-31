# Generated by Django 4.2.4 on 2023-08-28 12:41

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('w_id', models.IntegerField()),
                ('lmi_merchant_id', models.CharField(max_length=255)),
                ('lmi_payment_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('lmi_currency', models.CharField(max_length=10)),
                ('lmi_payment_no', models.CharField(max_length=255)),
                ('lmi_sys_payment_id', models.CharField(max_length=255)),
                ('lmi_sys_payment_date', models.DateTimeField()),
                ('lmi_paid_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('lmi_paid_currency', models.CharField(max_length=10)),
                ('lmi_payment_desc', models.TextField()),
                ('lmi_payment_method', models.CharField(max_length=255)),
                ('lmi_hash', models.CharField(max_length=255)),
                ('hash_method', models.CharField(max_length=255)),
                ('lmi_payer_identifier', models.CharField(max_length=255)),
                ('lmi_payer_ip_address', models.GenericIPAddressField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
