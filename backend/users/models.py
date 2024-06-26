from django.db import models
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin, UserManager
from django.db.models.signals import post_save
from django.dispatch import receiver

class CustomUserManager(UserManager):
    def _create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('An email is required.')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields)
    
class Department(models.Model):
    name = models.CharField(max_length=255, unique=True)
  
      
class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.CharField(max_length=200, unique=True)
    contact = models.CharField(max_length=50, default='', blank=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', default='public/default.png')
    date_joined = models.DateTimeField(default=timezone.now)
    enable_notifications = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    
class Staff(models.Model):
    POSITION_DIRECTOR = 'Director'

    POSITION_CHOICES = [
        ('Program Officer', 'Program Officer'),
        ('Director', 'Director'),
    ]

    user = models.OneToOneField(User,on_delete=models.CASCADE, primary_key=True,)

    position = models.CharField(max_length=255, choices=POSITION_CHOICES)
    date_hired = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name_plural = 'Staff Members'

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.position}"

    def save(self, *args, **kwargs):
        # Ensure only one director exists at a time
        if self.position == self.POSITION_DIRECTOR:
            Staff.objects.filter(position=self.POSITION_DIRECTOR).exclude(user=self.user).delete()
        super().save(*args, **kwargs)
        
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Check if "None" department exists, if not, create it
        none_department, _ = Department.objects.get_or_create(name="None")

        # Assign "None" department to the user profile
        instance.department = none_department
        instance.save()
