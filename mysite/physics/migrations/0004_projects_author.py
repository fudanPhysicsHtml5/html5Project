# Generated by Django 3.1.5 on 2021-03-22 07:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('physics', '0003_auto_20210322_1431'),
    ]

    operations = [
        migrations.AddField(
            model_name='projects',
            name='author',
            field=models.CharField(max_length=200, null=True),
        ),
    ]