import factory
from django.contrib.auth import get_user_model
from django.template.defaultfilters import truncatechars
from django.utils import timezone

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    # Define a static counter to generate unique email addresses
    _counter = 1

    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')

    @classmethod
    def generate_email(cls):
        # Generate a unique email address using the counter
        email = f'user{cls._counter}@example.com'
        cls._counter += 1
        return email

    email = factory.LazyAttribute(lambda _: UserFactory.generate_email())
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
