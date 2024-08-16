import { Card } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Link } from "react-router-dom";

const MovieBooking = ({ screenings, movieTitle, movie_id }) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-3">
      {screenings.map((theater, i) => (
        <Card
          key={i}
          className="p-2 bg-background/40 w-full border-1"
          radius="sm"
        >
          <div className="flex w-full justify-between flex-col gap-1 sm:flex-row">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm max-w-[20ch]">
                {theater.theater_name}, {theater.theater_location}
              </h3>

              <Chip className="bg-transparent text-xs text-foreground-300">
                M-Ticket
              </Chip>
            </div>

            <div className="w-full flex gap-2 items-center flex-wrap">
              {theater.screenings.map((screening) => {
                // console.log("movieTitle:", movieTitle);
                // console.log("movie_id:", movie_id);
                // console.log("theaterName:", theater.theater_name);
                // console.log("theaterLocation:", theater.theater_location);
                // console.log("screeningDate:", screening.screening_date);
                // console.log("screeningTime:", screening.screening_time);
                // console.log("screening_id:", screening.screening_id);

                return (
                  <Link
                    key={screening.screening_id}
                    to={`/seat_layout/${
                      theater.theater_location
                    }?movie_id=${movie_id}&screening_id=${
                      screening.screening_id
                    }&movieTitle=${encodeURIComponent(
                      movieTitle
                    )}&theaterName=${encodeURIComponent(
                      theater.theater_name
                    )}&theaterLocation=${encodeURIComponent(
                      theater.theater_location
                    )}&screeningDate=${
                      screening.screening_date
                    }&screeningTime=${screening.screening_time}`}
                  >
                    <Chip
                      variant="bordered"
                      color="primary"
                      radius="sm"
                      size="sm"
                      className="cursor-pointer text-xs border-1"
                    >
                      {screening.screening_time}
                    </Chip>
                  </Link>
                );
              })}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MovieBooking;
