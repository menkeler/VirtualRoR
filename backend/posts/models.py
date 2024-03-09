from django.db import models
from users.models import User

class Post(models.Model):

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
    ]

    CATEGORY_CHOICES = [
        ('Regular', 'Regular'),
        ('Announcements', 'Announcements'),
    ]

    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    message = models.TextField()
    title = models.CharField(max_length=255)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    images = models.ImageField(upload_to='post_images/', null=True, blank=True)
    views = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')  # Added status field
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"{self.author.first_name} {self.author.last_name} - {self.message[:50]}"

    def increment_views(self):
        self.views += 1
        self.save()
        
   
