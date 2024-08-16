from django.db import DatabaseError
from rest_framework import serializers
from django.contrib.auth import authenticate
from decimal import Decimal
from bson.decimal128 import Decimal128
from .models import Actor, Booking, Screening, Seat, Theater, User, Movie


import logging
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(
        required=True
    )  # Ensure it's required if it should be
    name = serializers.CharField(required=False, allow_blank=True)  # Optional

    class Meta:
        model = User
        fields = ("username", "email", "name", "password")

    def validate_username(self, value):
        print(f"Validating username: {value}")
        try:
            # Attempt to get a user with the provided username
            user = User.objects.get(username=value)
            # If the user is found, raise a validation error
            print("Username exists, raising ValidationError")
            raise serializers.ValidationError("Username is already taken.")
        except User.DoesNotExist:
            # If no user is found, the username is available
            print("Username is available")
            return value

    def validate_email(self, value):
        print(f"Validating email: {value}")
        if not value:
            print("Email is empty, raising ValidationError")
            raise serializers.ValidationError("Email field cannot be empty.")
        print("Email is valid")
        return value

    def create(self, validated_data):
        print(f"Creating user with data: {validated_data}")
        try:
            user = User.objects.create_user(
                username=validated_data["username"],
                password=validated_data["password"],
                email=validated_data["email"],
                name=validated_data.get("name"),
            )
            print(f"User created successfully: {user}")
            return user
        except DjangoValidationError as e:
            print(f"Validation error occurred: {e}")
            raise serializers.ValidationError({"username": str(e)})
        except DatabaseError as e:
            print(f"Database error occurred: {e}")
            raise serializers.ValidationError({"database_error": str(e)})


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect credentials")


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "name", "is_superuser", "is_staff"]


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "name"]  # Add fields that can be updated


class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = "__all__"


class MovieDetailsSerializer(serializers.ModelSerializer):
    starring_actors = ActorSerializer(many=True)

    class Meta:
        model = Movie
        fields = "__all__"


class MovieSerializer(serializers.ModelSerializer):

    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "votes",
            "stars",
            "language",
            "poster",
        ]


class ScreeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screening
        # fields = ['movie', 'screening_date', 'screening_time', 'theater']
        fields = "__all__"


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = [
            "id",
            "seat_id",
            "seat_type",
            "price",
            "row",
            "number",
            "is_available",
        ]


class TheaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theater
        fields = "__all__"


logger = logging.getLogger(__name__)


class BookingSerializer(serializers.ModelSerializer):
    user = serializers.UUIDField()
    seats = serializers.ListField(child=serializers.UUIDField())
    screening_date = serializers.SerializerMethodField()
    screening_time = serializers.SerializerMethodField()
    theater = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "user",
            "screening",
            "seats",
            "screening_date",
            "screening_time",
            "theater",
        ]

    def get_screening_date(self, obj):
        return obj.screening.screening_date

    def get_screening_time(self, obj):
        return obj.screening.screening_time

    def get_theater(self, obj):
        return obj.screening.theater.name

    def create(self, validated_data):
        user_id = validated_data.pop("user")
        seats = validated_data.pop("seats")

        # Retrieve the user object
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist")

        # Retrieve the screening object
        screening = validated_data["screening"]

        seat_objects = []
        try:
            for seat_id in seats:
                seat = Seat.objects.get(
                    id=seat_id, screening=screening, is_available=True
                )
                if not seat.is_available:
                    raise serializers.ValidationError(
                        "One or more seats are not available"
                    )
                seat_objects.append(seat)
        except Seat.DoesNotExist:
            raise serializers.ValidationError("Seat does not exist")

        # Create the booking
        booking = Booking.objects.create(user=user, screening=screening)
        booking.seats.set(seat_objects)

        total_price = 0
        for seat in seat_objects:
            if isinstance(seat.price, Decimal128):
                seat_price = Decimal(seat.price.to_decimal())
            else:
                seat_price = Decimal(seat.price)
            # print(f"Original seat price type: {type(seat.price)}")
            # print(f"Converted seat price type: {type(seat_price)}")
            total_price += seat_price

        # print(total_price,type(total_price),"total_price")

        booking.total_price = total_price
        booking.status = "Ongoing"
        booking.save()

        # Update seat availability
        for seat in seat_objects:
            try:

                seat_price = Decimal(seat.price.to_decimal())
                # Update seat availability
                seat.is_available = False
                seat.version += 1

                seat.price = seat_price
                seat.save()
            except Exception as e:
                print(f"Error processing seat ID {seat.id}: {e}")

        return booking


class BookingSummarySerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source="screening.movie.title")
    seats = serializers.SerializerMethodField()
    screening_date = serializers.DateField(source="screening.screening_date")
    screening_time = serializers.CharField(source="screening.screening_time")
    theater = serializers.CharField(source="screening.theater.name")

    class Meta:
        model = Booking
        fields = [
            "id",
            "razorpay_order_id",
            "status",
            "total_price",
            "movie_title",
            "seats",
            "screening_date",
            "screening_time",
            "theater",
            "created_at",
        ]

    def get_seats(self, obj):
        return [
            {
                "seat_type": seat.seat_type,
                "seat_id": seat.id,
                "row": seat.row,
                "number": seat.number,
            }
            for seat in obj.seats.all()
        ]


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField()

    def validate(self, data):
        try:
            uid = urlsafe_base64_decode(data.get("uid")).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid token or user ID")

        if not default_token_generator.check_token(user, data.get("token")):
            raise serializers.ValidationError("Invalid token")

        return data

    def save(self):
        uid = urlsafe_base64_decode(self.validated_data.get("uid")).decode()
        user = User.objects.get(pk=uid)
        user.set_password(self.validated_data.get("new_password"))
        user.save()
        return user
