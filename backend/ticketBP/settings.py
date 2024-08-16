"""
Django settings for ticketBP project.

Generated by 'django-admin startproject' using Django 4.1.13.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from datetime import timedelta
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-smz4-#0pb3%969li*jqk14yv+)&&=mcv!e@#mf3j*pr8dyj6of"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "booking_api",
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
]
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",  # Correct way to specify the backend
]
MIDDLEWARE = [
    "booking_api.middleware.JWTAuthCookieMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

RAZORPAY_KEY_ID = "rzp_test_POXnobft8JwK1i"
RAZORPAY_KEY_SECRET = "Z0Ha5vp1Rm1Mv29q9vCwf6RK"
# Allow origins for your development frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite React app URL
    "http://127.0.0.1:3000",  # Alternative localhost URL, if needed
]

# Allow only localhost and 127.0.0.1 in development
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# Ensure CSRF protection is correctly configured for your frontend URLs
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Allow credentials (cookies, authorization headers, etc.)
CORS_ALLOW_CREDENTIALS = True
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
# These settings are fine for development where HTTPS is not enforced
# False for development, cookies can be sent over HTTP
# False for development, cookies can be sent over HTTP

# Optional: If you want to allow all origins in development (less secure)
# CORS_ALLOW_ALL_ORIGINS = True


# If you want to allow all origins, be careful with this in production
# CORS_ALLOW_ALL_ORIGINS = True
ROOT_URLCONF = "ticketBP.urls"


TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "ticketBP.wsgi.application"
FRONTEND_URL = "http://localhost:5173"

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "djongo",
        "NAME": "bookmyshow",
        "ENFORCE_SCHEMA": False,
        "CLIENT": {
            "host": "mongodb+srv://thisisnaman24:rjprivacy24@namanjain.qvaefhl.mongodb.net/",
        },
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Kolkata"


USE_I18N = True

USE_TZ = True
AUTH_USER_MODEL = "booking_api.User"
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        # 'booking_api.authentication.CookieAuthentication',  # Replace with the actual path
        "rest_framework_simplejwt.authentication.JWTAuthentication"
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=15
    ),  # Set the lifetime of the access token
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=1
    ),  # Set the lifetime of the refresh token
    "ROTATE_REFRESH_TOKENS": True,  # Whether to rotate refresh tokens
    # "BLACKLIST_AFTER_ROTATION": True,  # Whether to blacklist the old refresh tokens
    "ALGORITHM": "HS256",  # JWT signing algorithm
    "SIGNING_KEY": SECRET_KEY,  # Signing key (must be set to your SECRET_KEY)
    "VERIFYING_KEY": None,  # Key to verify the signature (optional)
    "AUDIENCE": None,  # Audience claim (optional)
    "ISSUER": None,  # Issuer claim (optional)
    "AUTH_HEADER_TYPES": ("Bearer",),  # Authorization header type
    "USER_ID_FIELD": "id",  # Field to use for the user ID
    "USER_ID_CLAIM": "user_id",  # Claim to use for the user ID
    # 'AUTH_TOKEN_CLASSES': ('access',),              # Token classes to use
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",  # HTTP header to use for the token
}


MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = "static/"

# send email


EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.sendgrid.net"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "Django Email Key"  # This is the string literal 'apikey'
EMAIL_HOST_PASSWORD = "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"  # Replace with your actual API key
DEFAULT_FROM_EMAIL = "thisisnaman24@icloud.com"  # Replace with your email


# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
