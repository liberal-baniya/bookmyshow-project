from decimal import Decimal
from email.mime.text import MIMEText
import json
import logging
import smtplib


from django.template.loader import render_to_string
from rest_framework.views import APIView

from rest_framework.permissions import IsAuthenticated, BasePermission, IsAdminUser
from rest_framework import permissions

import razorpay
from bson.decimal128 import Decimal128
from django.conf import settings
from django.shortcuts import get_object_or_404


from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from .send_password_reset_email import send_password_reset_email
from .models import Booking, Movie, Screening, Seat, User

from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.decorators import api_view

from django.http import Http404, JsonResponse
from .serializers import (
    BookingSerializer,
    BookingSummarySerializer,
    MovieDetailsSerializer,
    MovieSerializer,
    ResetPasswordSerializer,
    ScreeningSerializer,
    SeatSerializer,
    UpdateUserSerializer,
    UserDetailSerializer,
    UserSerializer,
    LoginSerializer,
)  # Assuming you have these serializers defined


class IsAuthenticatedOrAdminCreateUpdateDelete(BasePermission):
    def has_permission(self, request, view):
        if request.method in ["GET"]:
            return request.user and request.user.is_authenticated
        else:
            return request.user and request.user.is_staff


class SignUpView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            # Generate refresh and access tokens
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            # Save the refresh token in the user model
            user.refresh_token = str(refresh)
            user.save()

            # Set cookies
            response = JsonResponse(
                {
                    "username": user.username,
                    "email": user.email,
                    "name": user.name,
                    "id": user.id,
                    "is_superuser": user.is_superuser,
                    "is_staff": user.is_staff,
                    "message": "Signup successful. User authenticated.",
                },
                status=status.HTTP_201_CREATED,
            )

            # Set cookies in the response
            response.set_cookie(
                "accessToken",
                str(access),
                httponly=True,
                secure=False,  # Set secure=True in production
                samesite="Lax",  # Adjust based on your security needs
            )
            response.set_cookie(
                "refreshToken",
                str(refresh),
                httponly=True,
                secure=False,  # Set secure=True in production
                samesite="Lax",  # Adjust based on your security needs
            )

            return response

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignInView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data  # This is the User instance directly

            # Generate refresh and access tokens
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            # Save the refresh token to the user model
            user.refresh_token = str(refresh)
            user.save()

            # Prepare the response data
            response_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "name": user.name,
                "is_staff": user.is_staff,  # Include is_staff to indicate admin privileges
                "is_superuser": user.is_superuser,
                "refresh": str(refresh),  # Convert to string
                "access": str(access),  # Convert to string
            }

            # Create the response object
            response = JsonResponse(response_data, status=status.HTTP_200_OK)

            # Set cookies in the response
            response.set_cookie(
                "accessToken",
                str(access),
                httponly=True,
                secure=False,  # Set secure=True in production
                samesite="Lax",
                path="/",  # Adjust based on your security needs
            )
            response.set_cookie(
                "refreshToken",
                str(refresh),
                httponly=True,
                secure=False,  # Set secure=True in production
                samesite="Lax",
                path="/",  # Adjust based on your security needs
            )

            return response

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if email:
            try:
                user = User.objects.get(email=email)
                send_password_reset_email(user)
                return Response(
                    {"message": "Password reset email sent."}, status=status.HTTP_200_OK
                )
            except User.DoesNotExist:
                return Response(
                    {"error": "User with this email does not exist."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        return Response(
            {"error": "Email field is required."}, status=status.HTTP_400_BAD_REQUEST
        )


class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Password reset successfully."}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        user = request.user  # Get the currently authenticated user
        serializer = UserDetailSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def put(self, request):
        user = request.user  # Get the currently authenticated user
        serializer = UpdateUserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def delete(self, request):
        user = request.user  # Get the currently authenticated user
        user.delete()  # Delete the user from the database
        return Response(
            {"detail": "User account deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


logger = logging.getLogger(__name__)


class LogoutView(APIView):
    def post(self, request):
        # Get the refresh token from cookies
        refresh_token = request.COOKIES.get("refreshToken")

        logger.info("Logout request received.")
        logger.debug(f"Refresh token received: {refresh_token}")

        if not refresh_token:
            logger.warning("No refresh token provided.")
            return JsonResponse(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Find the user by the refresh token
            user = User.objects.filter(refresh_token=refresh_token).first()

            if not user:
                logger.warning("Invalid refresh token provided.")
                return JsonResponse(
                    {"detail": "Invalid refresh token."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Clear the refresh token field
            user.refresh_token = ""  # Or use None if preferred
            user.save()

            # Clear cookies
            response = JsonResponse(
                {"detail": "Successfully logged out."},
                status=status.HTTP_200_OK,
            )
            response.delete_cookie("accessToken")
            response.delete_cookie("refreshToken")

            logger.info("User successfully logged out and cookies cleared.")

            return response

        except Exception as e:
            logger.error(f"Error during logout: {str(e)}")
            return JsonResponse(
                {"detail": "An error occurred during logout."},
                status=status.HTTP_400_BAD_REQUEST,
            )


# class IsAdminUser(permissions.BasePermission):
#     """
#     Custom permission to only allow admin users to access the view.
#     """

#     def has_permission(self, request, view):
#         return request.user and request.user.is_staff


class MovieListView(generics.ListAPIView):
    serializer_class = MovieSerializer

    def get_queryset(self):
        queryset = Movie.objects.all()
        genre = self.request.GET.get("genre")
        language = self.request.GET.get("language")
        location = self.request.GET.get("location")
        rating = self.request.GET.get("rating")

        if genre:
            queryset = queryset.filter(genre__icontains=genre)
        if language:
            queryset = queryset.filter(language__icontains=language)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if rating:

            queryset = queryset.filter(rating__icontains=rating)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        response_data = {
            "status": "success",
            "count": queryset.count(),
            "results": serializer.data,
        }
        return Response(response_data, status=status.HTTP_200_OK)


@api_view(["GET"])
def MovieDetailView(request, movie_id):
    movie = get_object_or_404(Movie, pk=movie_id)
    serializer = MovieDetailsSerializer(movie)
    return Response(serializer.data)


class TopMovieListView(generics.ListAPIView):
    serializer_class = MovieSerializer

    def get_queryset(self):
        # Fetch all movies and then limit the results to the first 4 manually
        queryset = list(Movie.objects.all())[:4]
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        response_data = {
            "status": "success",
            "count": len(queryset),  # Count after limiting the queryset
            "results": serializer.data,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class MovieCreateView(generics.CreateAPIView):

    serializer_class = MovieSerializer
    permission_classes = [IsAdminUser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # headers = self.get_success_headers(serializer.data)
        return Response(
            {
                "status": "success",
                "message": "Movie added successfully",
                "movie": serializer.data,
            },
            status=status.HTTP_201_CREATED,
            # headers=headers,
        )


class MovieUpdateView(generics.UpdateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAdminUser]

    def update(self, request, *args, **kwargs):
        # Fetch the movie instance
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Save the updated movie
        self.perform_update(serializer)

        # Prepare the response data
        response_data = {
            "status": "success",
            "message": "Movie updated successfully",
            "movie": serializer.data,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class MovieDeleteView(generics.DestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAdminUser]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        # Prepare the custom response data
        response_data = {"status": "success", "message": "Movie deleted successfully"}

        return Response(response_data, status=status.HTTP_204_NO_CONTENT)


class ScreeningListCreateView(generics.ListCreateAPIView):
    queryset = Screening.objects.all()
    serializer_class = ScreeningSerializer
    permission_classes = [IsAuthenticatedOrAdminCreateUpdateDelete]

    def perform_create(self, serializer):
        serializer.save()


class ScreeningDetailView(APIView):
    permission_classes = [IsAuthenticatedOrAdminCreateUpdateDelete]

    def get_object(self, pk):
        try:
            return Screening.objects.get(pk=pk)
        except Screening.DoesNotExist:
            return None

    def get(self, request, pk, format=None):
        screening = self.get_object(pk)
        if screening is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ScreeningSerializer(screening)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        screening = self.get_object(pk)
        if screening is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ScreeningSerializer(screening, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        screening = self.get_object(pk)
        if screening is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        screening.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ScreeningFilterView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ScreeningSerializer

    def get_queryset(self):
        queryset = Screening.objects.all()
        screening_date = self.request.query_params.get("screening_date")
        screening_time = self.request.query_params.get("screening_time")
        theater = self.request.query_params.get("theater")

        if screening_date:
            queryset = queryset.filter(screening_date=screening_date)
        if screening_time:
            queryset = queryset.filter(screening_time=screening_time)
        if theater:
            queryset = queryset.filter(theater__icontains=theater)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        response_data = {
            "status": "success",
            "count": queryset.count(),
            "results": serializer.data,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class GroupedScreeningsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        # Get the movie ID from query parameters
        movie_id = request.query_params.get("movie_id")
        screening_date = request.query_params.get("screening_date")
        screening_time = request.query_params.get("screening_time")

        if movie_id:
            # Validate if the movie ID exists
            try:
                movie = Movie.objects.get(id=movie_id)
            except Movie.DoesNotExist:
                return Response(
                    {"detail": "Movie not found."}, status=status.HTTP_404_NOT_FOUND
                )

            # Filter screenings by the specified movie ID, date, and time, including theater name and location
            screenings = Screening.objects.filter(movie_id=movie_id)

            if screening_date:
                screenings = screenings.filter(screening_date=screening_date)
            if screening_time:
                screenings = screenings.filter(screening_time=screening_time)

            screenings = screenings.values(
                "id",
                "screening_date",
                "screening_time",
                "theater__id",
                "theater__name",
                "theater__location",  # Assuming you have a location field in your Theater model
            ).order_by("theater__name", "screening_time")

            # Organize data in the desired structure
            grouped_data = {}
            for screening in screenings:
                theater_id = screening["theater__id"]
                theater_name = screening["theater__name"]
                theater_location = screening["theater__location"]
                screening_info = {
                    "screening_id": screening["id"],
                    "screening_date": screening["screening_date"],
                    "screening_time": screening["screening_time"],
                }

                if theater_id not in grouped_data:
                    grouped_data[theater_id] = {
                        "theater_name": theater_name,
                        "theater_location": theater_location,
                        "screenings": [],
                    }

                grouped_data[theater_id]["screenings"].append(screening_info)

            # Structure the response
            theaters_data = [
                {
                    "theater_id": theater_id,
                    "theater_name": data["theater_name"],
                    "theater_location": data["theater_location"],
                    "screenings": data["screenings"],
                }
                for theater_id, data in grouped_data.items()
            ]

            result = {"movie_title": movie.title, "theaters": theaters_data}

            return Response(result)

        else:
            return Response(
                {"detail": "movie_id query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class SeatListView(generics.ListAPIView):

    serializer_class = SeatSerializer

    def get_queryset(self):
        screening_id = self.kwargs["screening_id"]
        return Seat.objects.filter(screening_id=screening_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        for seat in queryset:
            print(
                f"Seat ID: {seat.id}, Price Type: {type(seat.price)}, Price Value: {seat.price}"
            )
        return Response(
            {"screening_id": self.kwargs["screening_id"], "seats": serializer.data}
        )


class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        response_data = {
            "movie_title": booking.screening.movie.title,
            "booking_id": booking.id,
            "status": booking.status,
            "total_price": booking.total_price,
            "seats": [
                {
                    "seat_type": seat.seat_type,
                    "seat_id": seat.id,
                    "row": seat.row,
                    "number": seat.number,
                }
                for seat in booking.seats.all()
            ],
            "screening_date": booking.screening.screening_date,  # Add screening date
            "screening_time": booking.screening.screening_time,  # Add screening time
            "theater": booking.screening.theater.name,  # Add theater name
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class UserBookingListView(generics.ListAPIView):
    serializer_class = BookingSummarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Replace "confirmed" with the actual value representing confirmed status in your model
        return Booking.objects.filter(
            user=self.request.user, status="Confirmed"
        ).order_by("-created_at")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Create a custom response data
        response_data = {
            "user": request.user.username,
            "total_bookings": queryset.count(),
            "bookings": serializer.data,
        }

        return Response(response_data, status=status.HTTP_200_OK)


client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


@csrf_exempt
def create_order(request, booking_id):
    try:
        # Fetch the booking using booking_id
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        raise Http404("Booking not found")

    # Convert the total price from Decimal128 to Decimal
    total_price = (
        Decimal(booking.total_price.to_decimal())
        if isinstance(booking.total_price, Decimal128)
        else Decimal(booking.total_price)
    )

    # Convert total price to paise (assuming total_price is in USD and converting to INR and then to paise)
    amount_in_paise = int(
        total_price * 100 * 75
    )  # Adjust the conversion rate as necessary

    # Generate a shorter receipt ID
    receipt_id = str(booking_id)[
        :40
    ]  # Truncate to ensure it's no more than 40 characters

    # Create the Razorpay order
    razorpay_order = client.order.create(
        {
            "amount": amount_in_paise,  # Amount in paise
            "currency": "INR",
            "receipt": receipt_id,
            "notes": {
                "Booking ID": str(booking_id),
                "Movie": booking.screening.movie.title,
                "Seats": ", ".join(
                    [f"{seat.row}-{seat.number}" for seat in booking.seats.all()]
                ),
            },
        }
    )

    # Store the Razorpay order ID in the booking
    booking.razorpay_order_id = razorpay_order["id"]
    booking.total_price = total_price
    booking.save()

    # Return the order details to the frontend
    return JsonResponse(
        {
            "order_id": razorpay_order["id"],
            "amount": amount_in_paise,
            "currency": "INR",
            "razorpay_key": settings.RAZORPAY_KEY_ID,
            "name": "Your Company Name",
            "description": f"Payment for booking {booking_id}",
            "image": "https://your-logo-url",
            "prefill": {
                "name": "naman jain",
                "email": "thisisnaman24@gmail.com",
                "contact": "9999999999",  # Replace with user's contact number if available
            },
            "notes": {
                "Booking ID": str(booking_id),
                "Movie": booking.screening.movie.title,
                "Seats": ", ".join(
                    [f"{seat.row}-{seat.number}" for seat in booking.seats.all()]
                ),
            },
            "theme": {"color": "#F37254"},
        }
    )


def send_confirmation_email(booking, seat_objects, payment_id, order_id, amount):
    # Prepare the data to be included in the email
    merge_data = {
        "booking": booking,
        "order_items": seat_objects,
        "payment_id": payment_id,
        "order_id": order_id,
        "amount": amount,
    }
    subject = "CONGRATS !!! Your Payment has been successfull"

    # Render the HTML body using a template
    html_body = render_to_string("email/customer_order_confirmation.html", merge_data)

    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = booking.user.email

    # Create the email message
    msg = MIMEText(html_body, "html")
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to_email

    try:
        # Connect to the SendGrid SMTP server
        server = smtplib.SMTP("smtp.sendgrid.net", 587)
        server.starttls()
        server.login("apikey", settings.EMAIL_HOST_PASSWORD)
        server.sendmail(from_email, [to_email], msg.as_string())
        server.quit()
        logger.info("Booking confirmation email sent successfully!")
    except Exception as e:
        logger.error(f"Error: {e}")


@csrf_exempt
def verify_payment(request):
    try:
        data = json.loads(request.body)  # Parse JSON data
        payment_id = data.get("payment_id")
        order_id = data.get("order_id")
        razorpay_signature = data.get("razorpay_signature")

        # Log the received values to ensure they're coming through correctly
        print("Received Payment ID:", payment_id)
        print("Received Order ID:", order_id)
        print("Received Razorpay Signature:", razorpay_signature)

        if not payment_id or not order_id or not razorpay_signature:
            return JsonResponse({"status": "Missing required fields!"}, status=400)

        # Verify the payment signature
        client.utility.verify_payment_signature(
            {
                "razorpay_order_id": order_id,
                "razorpay_payment_id": payment_id,
                "razorpay_signature": razorpay_signature,
            }
        )

        # Update booking status to 'Confirmed'
        booking = Booking.objects.get(razorpay_order_id=order_id)
        booking.status = "Confirmed"
        booking_total_price = Decimal(booking.total_price.to_decimal())
        booking.total_price = booking_total_price
        booking.save()

        # Send booking confirmation email
        email_sent = False
        try:
            send_confirmation_email(
                booking, booking.seats.all(), payment_id, order_id, booking.total_price
            )
            email_sent = True
        except Exception as email_error:
            print(f"Failed to send confirmation email: {email_error}")

        return JsonResponse(
            {
                "status": "Payment verified and booking confirmed!",
                "email_sent": email_sent,
            }
        )
    except razorpay.errors.SignatureVerificationError as e:
        print(f"Signature verification failed: {e}")
        return JsonResponse({"status": "Payment verification failed!"}, status=400)
    except Exception as e:
        print(f"Unexpected error: {e}")
        return JsonResponse({"status": "An error occurred on the server."}, status=500)
