from django.urls import path
from . import views

urlpatterns = [
	path('register', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
 	path('userProfile/', views.UserView.as_view(), name='user_profile'),
	path('userProfile/<int:id>/', views.UserView.as_view(), name='user_profile'),
 	path('check-registration', views.UserCheckRegister.as_view(), name='check-registration'),
]