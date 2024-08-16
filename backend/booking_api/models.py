from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from django.core.exceptions import ValidationError as DjangoValidationError


# from djongo import models
import uuid
import logging
from django.db.utils import DatabaseError


logger = logging.getLogger(__name__)


class UserManager(BaseUserManager):
    def create_user(self, username, password, email, name=None, **extra_fields):
        if not username:
            raise ValueError("Username should be provided")
        if not email:
            raise ValueError("Email should be provided")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, name=name, **extra_fields)
        user.set_password(password)

        try:
            user.save(using=self._db)
        except DatabaseError as e:
            if "duplicate key" in str(e):
                raise DjangoValidationError(f"Username '{username}' is already taken.")
            else:
                raise DjangoValidationError(f"An error occurred: {str(e)}")

        print(
            f"Created user: {user.username}, is_staff: {user.is_staff}, is_superuser: {user.is_superuser}"
        )
        return user

    def create_superuser(self, username, password, email, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        user = self.create_user(username, password, email, **extra_fields)
        print(
            f"Created superuser: {user.username}, is_staff: {user.is_staff}, is_superuser: {user.is_superuser}"
        )
        return user


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=60)
    password = models.CharField(max_length=128)
    username = models.CharField(max_length=100, unique=True)
    refresh_token = models.CharField(max_length=300, blank=True, null=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    objects = UserManager()

    def __str__(self):
        return self.username


class Actor(models.Model):
    # id = models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Movie(models.Model):
    GENRE_CHOICES = [
        ("ACTION", "Action"),
        ("COMEDY", "Comedy"),
        ("DRAMA", "Drama"),
        ("FANTASY", "Fantasy"),
        ("HORROR", "Horror"),
        ("ROMANCE", "Romance"),
        ("THRILLER", "Thriller"),
    ]

    LANGUAGE_CHOICES = [
        ("EN", "English"),
        ("ES", "Spanish"),
        ("FR", "French"),
        ("DE", "German"),
        ("IT", "Italian"),
        ("CN", "Chinese"),
        ("JP", "Japanese"),
        ("KR", "Korean"),
    ]

    RATING_CHOICES = [
        ("G", "General Audience"),
        ("PG", "Parental Guidance"),
        ("PG-13", "Parents Strongly Cautioned"),
        ("R", "Restricted"),
        ("NC-17", "Adults Only"),
    ]
    # id = models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    runtime = models.CharField(max_length=255)
    director = models.CharField(max_length=255)
    starring_actors = models.ManyToManyField(Actor, related_name="movies")
    votes = models.IntegerField()
    stars = models.CharField(max_length=50)
    genre = models.CharField(max_length=50, choices=GENRE_CHOICES)
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES)
    description = models.TextField()
    rating = models.CharField(max_length=5, choices=RATING_CHOICES, default="G")
    poster = models.ImageField(upload_to="movie_images/", null=True, blank=True)

    def __str__(self):
        return self.title


class Theater(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=455)
    total_rows = models.IntegerField()
    seats_per_row = models.IntegerField()

    def __str__(self):
        return self.name


class Screening(models.Model):
    TIME_CHOICES = [
        ("09:00", "09:00 AM"),
        ("12:00", "12:00 PM"),
        ("15:00", "03:00 PM"),
        ("18:00", "06:00 PM"),
        ("21:00", "09:00 PM"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    screening_date = models.DateField()
    screening_time = models.CharField(max_length=5, choices=TIME_CHOICES)
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.movie.title} on {self.screening_date} at {self.screening_time}"


class Seat(models.Model):
    SEAT_TYPE_CHOICES = [
        ("Standard", "Standard"),
        ("VIP", "VIP"),
        ("Premium", "Premium"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seat_id = models.CharField(max_length=10, unique=True)
    seat_type = models.CharField(
        max_length=20, choices=SEAT_TYPE_CHOICES, default="Standard"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    row = models.CharField(max_length=5)
    number = models.IntegerField()
    screening = models.ForeignKey(
        Screening, related_name="seats", on_delete=models.CASCADE
    )
    is_available = models.BooleanField(default=True)
    version = models.IntegerField(default=1)

    class Meta:
        unique_together = ("screening", "row", "number")


class Booking(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Ongoing", "Ongoing"),
        ("Confirmed", "Confirmed"),
        ("Cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    screening = models.ForeignKey(
        Screening, related_name="bookings", on_delete=models.CASCADE
    )
    seats = models.ManyToManyField(Seat, related_name="bookings")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    razorpay_order_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking by {self.user.username} for {self.screening.movie.title} on {self.screening.screening_date} at {self.screening.screening_time}"
