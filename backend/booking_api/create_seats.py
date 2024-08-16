from django.core.management.base import BaseCommand
from .models import Screening, Theater, Seat
from booking_api.utils import create_seats_for_screening 


class Command(BaseCommand):
    help = "Create seats for a specific screening"

    def add_arguments(self, parser):
        parser.add_argument(
            "screening_id", type=str, help="Screening ID for which to create seats"
        )

    def handle(self, *args, **kwargs):
        screening_id = kwargs["screening_id"]
        screening = Screening.objects.get(id=screening_id)
        theater = screening.theater

        create_seats_for_screening(
            screening, theater.total_rows, theater.seats_per_row
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created seats for screening {screening_id}"
            )
        )