
#remove for production


import factory
from django.contrib.auth import get_user_model
from django.template.defaultfilters import truncatechars
from django.utils import timezone

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    email = factory.Faker('email')
    contact = factory.Faker('phone_number', locale='en_US')

    @factory.post_generation
    def truncate_contact(self, create, extracted, **kwargs):
        if create:
            max_length = 15
            self.contact = truncatechars(self.contact, max_length)

    department = factory.Faker('word')
    bio = factory.Faker('paragraph')
    date_joined = factory.Faker('date_time_this_decade', tzinfo=timezone.utc)
    is_staff = False  