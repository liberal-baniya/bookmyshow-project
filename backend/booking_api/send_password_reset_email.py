from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
from django.contrib.auth.tokens import default_token_generator

from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

from django.conf import settings

import logging


logger = logging.getLogger(__name__)


def send_password_reset_email(user):
    # Generate the token and UID
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    # Generate the reset link
    reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

    # Email subject and recipient
    subject = "Password Reset Request"
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = user.email

    # Simplified HTML content
    html_message = f"""
    <html>
    <body>
        <p>Hi {user.username},</p>
        <p>You're receiving this email because you requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="{reset_link}">{reset_link}</a></p>
        <p>If you didn't request this, you can ignore this email.</p>
    </body>
    </html>
    """

    # Create a multipart email message
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to_email

    # Attach the HTML message
    msg.attach(MIMEText(html_message, "html"))

    try:
        # Connect to the SendGrid SMTP server
        server = smtplib.SMTP("smtp.sendgrid.net", 587)
        server.starttls()
        server.login("apikey", settings.EMAIL_HOST_PASSWORD)
        server.sendmail(from_email, [to_email], msg.as_string())
        server.quit()
        logger.info("Password reset email sent successfully!")
    except Exception as e:
        logger.error(f"Error sending email: {e}")
