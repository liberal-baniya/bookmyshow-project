# utils.py
from .models import Seat


from decimal import Decimal


def create_seats_for_screening(screening, total_rows, seats_per_row):
    seat_type_prices = {
        "Standard": Decimal("10.00"),
        "VIP": Decimal("20.00"),
        "Premium": Decimal("30.00"),
    }

    seat_type_distribution = {
        "Standard": (1, int(total_rows * 0.6)),
        "VIP": (int(total_rows * 0.6) + 1, int(total_rows * 0.8)),
        "Premium": (int(total_rows * 0.8) + 1, total_rows),
    }

    row_labels = []
    for i in range(total_rows):
        row_label = ""
        while i >= 0:
            row_label = chr(65 + (i % 26)) + row_label
            i = i // 26 - 1
        row_labels.append(row_label)

    for i in range(total_rows):
        for number in range(1, seats_per_row + 1):
            row_label = row_labels[i]
            if (
                seat_type_distribution["Standard"][0]
                <= i + 1
                <= seat_type_distribution["Standard"][1]
            ):
                seat_type = "Standard"
            elif (
                seat_type_distribution["VIP"][0]
                <= i + 1
                <= seat_type_distribution["VIP"][1]
            ):
                seat_type = "VIP"
            else:
                seat_type = "Premium"

            price = seat_type_prices[seat_type]
            seat_id = f"{screening.id}_{row_label}_{number}"
            Seat.objects.create(
                seat_id=seat_id,
                seat_type=seat_type,
                price=price,  # Convert Decimal to Decimal128
                row=row_label,
                number=number,
                screening=screening,
            )
