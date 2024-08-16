import React, { useEffect, useState } from "react";
import { Chip } from "@nextui-org/chip";
import { Radio, RadioGroup } from "@nextui-org/radio";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { CgArrowRight, CgClose } from "react-icons/cg";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Spinner } from "@nextui-org/spinner"; // Import Spinner
import { ToastContainer, toast } from "react-toastify"; // Import Toasts
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS
import MovieInHalls from "../components/MovieInHalls";
import AppLayout from "../components/AppLayout";
import Nav from "../components/nav";
import CouraselBody from "../components/scrollCourasel";

const TIME_CHOICES = [
  { value: "09:00", label: "09:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "18:00", label: "06:00 PM" },
  { value: "21:00", label: "09:00 PM" },
];

const DATE_CHOICES = [
  { value: "2024-08-17", label: "17 August 2024" },
  { value: "2024-08-18", label: "18 August 2024" },
  { value: "2024-08-19", label: "19 August 2024" },
];

const BuyTickets = () => {
  const { movie_id, name } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [screenings, setScreenings] = useState([]);
  const [movieTitle, setmovieTitle] = useState("");
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const handleFilter = (value) => {
    const updatedFilters = filters.map((filter) =>
      filter.label === value.label ? value : filter
    );

    if (!updatedFilters.find((filter) => filter.label === value.label)) {
      updatedFilters.push(value);
    }

    setFilters(updatedFilters);

    if (value.label === "Time") {
      searchParams.set("screening_time", value.value);
    }
    setSearchParams(searchParams); // Update the query params in the URL
  };

  const changeTimings = (date) => {
    searchParams.set("screening_date", date);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const fetchScreenings = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryString = new URLSearchParams(searchParams).toString();
        const response = await fetch(
          `/api/v1/movie/screenings/grouped/?movie_id=${movie_id}&${queryString}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch screenings");
        }
        const data = await response.json();
        setScreenings(data.theaters || []);
        setmovieTitle(data.movie_title);

        if (data.theaters.length === 0) {
          toast.info("No screenings available for the selected filters.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error("Failed to fetch screenings:", error);
        setError(error.message);
        toast.error("Failed to fetch screenings. Please try again later.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScreenings();
  }, [movie_id, searchParams]);

  return (
    <AppLayout>
      <ToastContainer /> {/* Toast container for notifications */}
      <div className="w-full min-h-[100dvh] flex flex-col gap-2 mb-32">
        <Nav />
        <div className="sm:container mx-auto">
          <h1 className="text-xl sm:text-2xl font-semibold mb-2">{name}</h1>

          <div>
            <Chip className="bg-transparent text-accent border-1 text-xs">
              Action
            </Chip>
          </div>

          {/* Filters and Date Selection */}
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center p-3 gap-2 w-44 sm:w-[20em]">
              <CouraselBody amount={100}>
                {DATE_CHOICES.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => changeTimings(d.value)}
                    className={`${
                      searchParams.get("screening_date") === d.value &&
                      "bg-secondary-700"
                    } text-xs px-2 text-center border-1 border-secondary-500 p-1 rounded-lg cursor-pointer`}
                  >
                    {d.label}
                  </button>
                ))}
              </CouraselBody>
            </div>

            <div className="flex items-center gap-2 p-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center outline-none focus:outline-0">
                  filters <CgArrowRight />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer text-xs p-2 rounded-lg outline-none focus:outline-none">
                      <Chip>Time</Chip>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-background">
                      <div className="bg-background">
                        <RadioGroup color="primary" className="space-y-2 p-2">
                          {TIME_CHOICES.map((t) => (
                            <Radio
                              onClick={() =>
                                handleFilter({
                                  label: "Time",
                                  value: t.value,
                                })
                              }
                              value={t.value}
                              key={t.value}
                            >
                              {t.label}
                            </Radio>
                          ))}
                        </RadioGroup>
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Applied Filters */}
          <div className="flex items-center justify-between gap-2">
            <CouraselBody>
              {filters.length > 0 &&
                filters.map((f) => (
                  <div
                    key={f.label}
                    className="w-fit rounded-lg p-1 flex h-fit items-start gap-2 border-1 border-foreground-200"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-xs sm:text-medium">{f.label}</p>
                      <span className="text-xs">{f.value}</span>
                    </div>
                    <CgClose
                      cursor={"pointer"}
                      onClick={() => {
                        setFilters((p) => p.filter((v) => v.label !== f.label));
                        if (f.label === "Time") {
                          searchParams.delete("screening_time");
                        }
                        setSearchParams(searchParams);
                      }}
                    />
                  </div>
                ))}
            </CouraselBody>
          </div>

          {/* Display Screenings */}
          <main>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="lg" /> {/* Show spinner while loading */}
              </div>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : (
              <MovieInHalls
                screenings={screenings}
                movieTitle={movieTitle}
                movie_id={movie_id}
              />
            )}
          </main>
        </div>
      </div>
    </AppLayout>
  );
};

export default BuyTickets;
