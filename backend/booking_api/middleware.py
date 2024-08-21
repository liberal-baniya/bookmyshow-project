
import re
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
import logging

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

        logger.debug(f"Request path: {request.path}")

        # Return early if the path is in the excluded list
        if request.path in excluded_paths:
            logger.debug("Path is in the excluded paths, no authentication required.")
            return

        # List of regex patterns for paths that require authentication
        protected_path_patterns = [
            r"^/api/v1/users/userDetails/$",
            r"^/api/v1/users/updateUser/$",
            r"^/api/v1/users/deleteUser/$",
            r"^/ProtectedView/$",
            r"^/api/v1/movies/add/$",
            r"^/api/v1/movie/screenings/grouped/$",
            r"^/api/v1/movies/[a-fA-F0-9\-]{36}/update/$",  # UUID pattern for update
            r"^/api/v1/movies/[a-fA-F0-9\-]{36}/delete/$",  # UUID pattern for delete
            r"^/api/v1/movie/screenings/$",
            r"^/api/v1/movie/screenings/[a-fA-F0-9\-]{36}/$",  # UUID pattern for screenings
            r"^/api/v1/movie/screenings/filter/$",
            r"^/api/v1/screenings/[a-fA-F0-9\-]{36}/seats/$",  # UUID pattern for seats
            r"^/api/v1/seats/bookings/$",
            r"^/api/v1/my-bookings/$",
            # Add more patterns as needed
        ]

        # Check if the request path matches any protected patterns
        if any(re.match(pattern, request.path) for pattern in protected_path_patterns):
            logger.debug(f"Protected path detected: {request.path}")
            access_token = request.COOKIES.get("accessToken")
            if access_token:
                logger.debug("Access token found, setting Authorization header.")
                request.META["HTTP_AUTHORIZATION"] = f"Bearer {access_token}"
            else:
                logger.warning("Access token not found, returning 401 Unauthorized.")
                return JsonResponse(
                    {"detail": "Authentication credentials were not provided."},
                    status=401,
                )
        else:
            logger.debug("Path does not require authentication.")
