import logging
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse

# Set up logging
logger = logging.getLogger(__name__)


class JWTAuthCookieMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Excluded paths that do not require authentication
        excluded_paths = [
            "/api/v1/users/signup/",
            "/api/v1/auth/login/",
            "/api/v1/auth/forgot-password/",
            "/api/v1/auth/reset-password/",
            "/api/v1/auth/logout/",
            # Add more paths as needed
        ]

        # Log the incoming request path
        logger.debug(f"Request path: {request.path}")

        # Return early if the path is in the excluded list
        if request.path in excluded_paths:
            logger.debug("Path is in the excluded paths, no authentication required.")
            return

        # List of paths that require authentication
        protected_paths = [
            "/api/v1/users/userDetails/",
            "/api/v1/users/updateUser/",
            "/api/v1/users/deleteUser/",
            "/ProtectedView/",
            "/api/v1/movies/add/",
            "/api/v1/movie/screenings/grouped/",
            "/api/v1/movies/<uuid:pk>/update/",
            "/api/v1/movies/<uuid:pk>/delete/",
            "/api/v1/movie/screenings/",
            "/api/v1/movie/screenings/<uuid:pk>/",
            "/api/v1/movie/screenings/filter/",
            "/api/v1/screenings/<uuid:screening_id>/seats/",
            "/api/v1/seats/bookings/",
            "/api/v1/my-bookings/",
            
            # Add more paths as needed
        ]

        # Check if the request path requires authentication
        if request.path in protected_paths:
            logger.debug(f"Protected path detected: {request.path}")
            access_token = request.COOKIES.get("accessToken")
            if access_token:
                # Log that the access token was found
                logger.debug("Access token found, setting Authorization header.")
                # Set the Authorization header with the JWT token
                request.META["HTTP_AUTHORIZATION"] = f"Bearer {access_token}"
            else:
                # Log the absence of the token
                logger.warning("Access token not found, returning 401 Unauthorized.")
                # Return 401 Unauthorized if no token is found
                return JsonResponse(
                    {"detail": "Authentication credentials were not provided."},
                    status=401,
                )
        else:
            logger.debug("Path does not require authentication.")
