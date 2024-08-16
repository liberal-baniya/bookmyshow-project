import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";
import { BiShare, BiStar } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import CouraselBody from "../components/scrollCourasel";

const MovieInDetail = () => {
  const { id, name } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`/api/v1/movies/${id}/`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    fetchMovieDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>; // Show a loading state while fetching
  }

  // Prepend the base URL to the poster path
  const posterUrl = `http://localhost:8000${movie.poster}`;

  return (
    <div className="flex w-full h-full flex-col gap-2">
      <div className="relative w-full min-h-80 flex justify-center items-center bg-gradient-to-r from-zinc-700/5 to-accent-800/10 overflow-hidden">
        {/* Background Image */}
        <div className="absolute pointer-events-none top-0 left-0 opacity-20 w-full items-center flex justify-center h-full blur-sm">
          <Image
            isBlurred
            className="object-cover mt-3 w-full h-full"
            src={posterUrl}
          />
        </div>

        {/* Movie Details */}
        <div className="px-1 sm:container mx-auto flex flex-col md:grid md:grid-cols-[auto_1fr_auto] gap-3">
          <div className="flex w-full justify-between relative">
            <Image
              isBlurred
              isZoomed
              className="md:w-[400px] md:h-[350px] w-full h-full"
              src={posterUrl}
            />
            <div className="flex md:hidden absolute right-2 top-2 z-10">
              <Button variant="shadow" color="primary" isIconOnly size="sm">
                <BiShare />
              </Button>
            </div>
          </div>

          <div className="z-10 py-1 flex flex-col justify-start space-y-2 sm:space-y-3">
            <h1 className="text-xl sm:text-3xl font-medium sm:font-semibold">
              {movie.title}
            </h1>

            <div className="flex items-center gap-2 bg-gradient-to-r from-secondary-50/5 to-accent w-fit p-1 sm:px-3 sm:py-2 rounded-xl">
              <p className="flex items-center gap-2 text-xs sm:text-sm">
                <BiStar /> {movie.stars}/10
                <span className="text-xs">{movie.votes} votes</span>
              </p>
              <Button size="sm">Rate Now</Button>
            </div>

            <div className="flex gap-2 items-center justify-center w-fit">
              <Chip size="sm">{movie.runtime}</Chip>
              <Chip size="sm">{movie.language}</Chip>
            </div>

            <p className="text-xs sm:text-sm tracking-wider space-x-2">
              <span>
                {movie.genre} - {movie.rating}
              </span>{" "}
              <span>{movie.year}</span>
            </p>

            <p className="text-xs sm:text-sm tracking-wider">
              Director: {movie.director}
            </p>

            <Button
              variant="shadow"
              color="secondary"
              size="sm"
              className="w-fit"
            >
              <Link to={`/buy_tickets/${name}-location/${id}/${Date.now()}`}>
                Book Tickets
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* About the Movie */}
      <div className="sm:container mx-auto px-1 mb-7">
        <h3 className="text-xl font-semibold py-4">About the movie</h3>
        <p className="text-xs sm:text-sm text-wrap">{movie.description}</p>
      </div>

      {/* Cast */}
      <div className="sm:container mx-auto px-1 font-semibold overflow-hidden">
        <h3 className="text-xl mb-4">Cast</h3>
        <div className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-1">
          <CouraselBody>
            {movie.starring_actors.map((actor) => (
              <div
                key={actor.id}
                className="flex-shrink-0 w-fit h-fit py-2 px-3 flex flex-col items-center justify-center rounded-full snap-start"
              >
                <Image
                  isZoomed
                  src="https://via.placeholder.com/150"
                  alt={actor.name}
                  className="rounded-full w-14 h-14"
                />
                <h4 className="text-xs font-medium">{actor.name}</h4>
              </div>
            ))}
          </CouraselBody>
        </div>
      </div>
    </div>
  );
};

export default MovieInDetail;
