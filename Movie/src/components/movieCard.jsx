
import { Image } from "@nextui-org/image";
import { ImageOff } from "lucide-react";
import { BiStar } from "react-icons/bi";
import { Link } from "react-router-dom";


const MovieCard = ({ movie }) => {
   const encodedTitle = encodeURIComponent(movie.title);

   return (
      <Link
         className="w-full flex items-center flex-col"
         to={`/explore/movies/${encodedTitle}/${movie.id}`}
      >
         <div className="w-full place-items-center min-h-80 grid grid-rows-[1fr_auto_auto] relative bg-background">
            <div className="sm:px-2 flex justify-center w-full relative">
               {movie.poster ? (
                  <Image
                     width={350}
                     height={400}
                     alt={movie.title}
                     loading="lazy"
                     src={movie.poster}
                  />
               ) : (
                  <ImageOff size={250} />
               )}
            </div>
            <div className="w-full flex items-center justify-between z-10 p-2 bg-background">
               <p className="flex text-xs gap-3 items-center justify-center">
                  <BiStar /> {movie.stars} / 10
               </p>
               <p className="text-xs font-normal">
                  {new Intl.NumberFormat("en-Us", {
                     localeMatcher: "best fit",
                     compactDisplay: "short",
                  }).format(movie.votes)}{" "}
                  votes
               </p>
            </div>
            <h4 className="">{movie.title}</h4>
            <p className="text-xs text-foreground-400">
               {movie.language}
            </p>
         </div>
      </Link>
   );
};

export default MovieCard;
