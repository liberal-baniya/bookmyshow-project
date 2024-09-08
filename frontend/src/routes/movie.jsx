// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import MovieFilter from "../components/MovieFilter";
// import MovieCard from "../components/movieCard";
// import { Spinner } from "@nextui-org/spinner";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const MoviePage = () => {
//   const [movies, setMovies] = useState([]);
//   const [searchParams] = useSearchParams();
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const query = new URLSearchParams(searchParams).toString();

//     const fetchMovies = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(`/api/v1/movies/?${query}`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch movies");
//         }
//         const data = await response.json();
//         setMovies(data.results);

//         if (data.count === 0) {
//           toast.info("No movies found with the selected filters.", {
//             position: "top-center",
//             autoClose: 3000,
//             hideProgressBar: true,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching movies:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMovies();
//   }, [searchParams]);

//   return (
//     <div className="w-full sm:container mx-auto space-y-4 mb-12">
//       <ToastContainer />
//       <div className="flex w-full justify-between px-2">
//         <h1 className="text-start text-sm sm:text-xl">Recommended Movies</h1>
//         <MovieFilter />
//       </div>
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <Spinner size="lg" />
//         </div>
//       ) : error ? (
//         <p className="text-red-500 text-center">{error}</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 px-3">
//           {movies.map((movie, index) => (
//             <MovieCard key={index} movie={movie} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MoviePage;
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieFilter from "../components/MovieFilter";
import MovieCard from "../components/movieCard";
import { Spinner } from "@nextui-org/spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null); // State for next page URL
  const [prevPage, setPrevPage] = useState(null); // State for previous page URL
  const [currentPage, setCurrentPage] = useState(1); // State for current page number

  // Define fetchMovies outside of useEffect so it's accessible to handlePageChange
  const fetchMovies = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      setMovies(data.results);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setCurrentPage(url.includes("page") ? parseInt(new URL(url).searchParams.get("page")) : 1);

      if (data.count === 0) {
        toast.info("No movies found with the selected filters.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(searchParams).toString();
    fetchMovies(`/api/v1/movies/?${query}`);  // Initial fetch
  }, [searchParams]);

  const handlePageChange = (url) => {
    fetchMovies(url);
  };

  return (
    <div className="w-full sm:container mx-auto space-y-4 mb-12">
      <ToastContainer />
      <div className="flex w-full justify-between px-2">
        <h1 className="text-start text-sm sm:text-xl">Recommended Movies</h1>
        <MovieFilter />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 px-3">
            {movies.map((movie, index) => (
              <MovieCard key={index} movie={movie} />
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 px-3">
            <button
              disabled={!prevPage}
              onClick={() => handlePageChange(prevPage)}
              className="disabled:opacity-50 disabled:cursor-not-allowed bg-primary-500 text-white py-2 px-4 rounded"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {currentPage}
            </span>
            <button
              disabled={!nextPage}
              onClick={() => handlePageChange(nextPage)}
              className="disabled:opacity-50 disabled:cursor-not-allowed bg-primary-500 text-white py-2 px-4 rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MoviePage;

