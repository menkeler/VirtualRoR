import factory
from django.contrib.auth import get_user_model
from django.utils import timezone

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    email = factory.Faker('email')
    contact = factory.Faker('phone_number')
    department = factory.Faker('word')
    bio = factory.Faker('paragraph')
    avatar = factory.django.ImageField(color='blue')
    date_joined = factory.Faker('date_time_this_decade', tzinfo=timezone.utc)
    is_staff = False  # You can customize this as needed