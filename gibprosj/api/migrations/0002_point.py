# Generated by Django 4.0.1 on 2022-03-25 10:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Point',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('category', models.CharField(choices=[('GROCERY', 'GROCERY'), ('LIQUOR', 'LIQUOR'), ('CLOTHING', 'CLOTHING')], default='GROCERY', max_length=9)),
            ],
        ),
    ]
