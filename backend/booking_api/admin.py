from django.contrib import admin
from .models import Booking, User, Movie, Screening, Seat, Theater, Actor
from .utils import create_seats_for_screening
from django.utils.safestring import mark_safe


from .models import Booking, Seat


class UserAdmin(admin.ModelAdmin):
    list_display = (
        "username",
        "email",
        "name",
        "is_staff",
        "is_superuser",
        "is_active",
        "date_joined",
    )
    search_fields = ("username", "email", "name")
    readonly_fields = ("date_joined",)


class MovieAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "director",
        "genre",
        "language",
        "rating",
        "votes",
        "stars",
    )
    search_fields = ("title", "director", "genre", "language")
    list_filter = ("genre", "language", "rating")
    filter_horizontal = ("starring_actors",)
    fieldsets = (
        (None, {"fields": ("title", "description", "poster")}),
        (
            "Details",
            {"fields": ("runtime", "director", "starring_actors", "votes", "stars")},
        ),
        ("Classification", {"fields": ("genre", "language", "rating")}),
    )
    readonly_fields = ("poster_preview",)

    def poster_preview(self, obj):
        if obj.poster:
            return mark_safe(
                '<img src="{}" width="150" height="200" />'.format(obj.poster.url)
            )
        return "No Image"

    poster_preview.short_description = "Poster Preview"


class ActorAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


class ScreeningAdmin(admin.ModelAdmin):
    list_display = ["movie", "screening_date", "screening_time", "theater"]
    list_filter = ("movie", "screening_date", "theater", "screening_time")
    actions = ["generate_seats"]

    def generate_seats(self, request, queryset):
        for screening in queryset:
            theater = screening.theater
            create_seats_for_screening(
                screening, theater.total_rows, theater.seats_per_row
            )
        self.message_user(request, "Seats generated successfully.")

    generate_seats.short_description = "Generate seats for selected screenings"


class SeatAdmin(admin.ModelAdmin):
    list_display = [
        "seat_id",
        "seat_type",
        "price",
        "row",
        "number",
        "screening",
        "is_available",
    ]
    search_fields = ("seat_id", "row", "number", "screening__movie__title")
    list_filter = ("seat_type", "screening", "screening__theater", "is_available")


class BookingAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "screening", "status", "total_price", "created_at")
    search_fields = ("user__username", "screening__movie__title", "status")
    list_filter = ("status", "screening__movie", "created_at")
    ordering = ("-created_at",)
    filter_horizontal = ("seats",)

    def get_user(self, obj):
        return obj.user.username

    get_user.admin_order_field = "user"  # Allows column to be sortable by user
    get_user.short_description = "User"  # Renames column head

    def get_screening(self, obj):
        return f"{obj.screening.movie.title} on {obj.screening.screening_date} at {obj.screening.screening_time}"

    get_screening.admin_order_field = (
        "screening"  # Allows column to be sortable by screening
    )
    get_screening.short_description = "Screening"  # Renames column head

    def get_seats(self, obj):
        return ", ".join([f"{seat.row}-{seat.number}" for seat in obj.seats.all()])

    get_seats.short_description = "Seats"  # Renames column head


class TheaterAdmin(admin.ModelAdmin):
    list_display = ["name", "total_rows", "seats_per_row", "location"]


admin.site.register(User, UserAdmin)
admin.site.register(Movie, MovieAdmin)
admin.site.register(Screening, ScreeningAdmin)
admin.site.register(Seat, SeatAdmin)
admin.site.register(Booking, BookingAdmin)
admin.site.register(Theater, TheaterAdmin)
admin.site.register(Actor, ActorAdmin)
