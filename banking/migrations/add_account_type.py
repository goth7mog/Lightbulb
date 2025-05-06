from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('banking', '0005_alter_account_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='account_type',
            field=models.CharField(choices=[('current', 'Current Account'), ('savings', 'Savings Account'), ('business', 'Business Account')], default='current', max_length=20),
        ),
    ]
