import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Chip } from "@nextui-org/chip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { CiFilter } from "react-icons/ci";
import { useSearchParams } from "react-router-dom";

const genreChoices = [
  { value: "ACTION", label: "Action" },
  { value: "COMEDY", label: "Comedy" },
  { value: "DRAMA", label: "Drama" },
  { value: "FANTASY", label: "Fantasy" },
  { value: "HORROR", label: "Horror" },
  { value: "ROMANCE", label: "Romance" },
  { value: "THRILLER", label: "Thriller" },
];

const languageChoices = [
  { value: "EN", label: "English" },
  { value: "ES", label: "Spanish" },
  { value: "FR", label: "French" },
  { value: "DE", label: "German" },
  { value: "IT", label: "Italian" },
  { value: "CN", label: "Chinese" },
  { value: "JP", label: "Japanese" },
  { value: "KR", label: "Korean" },
];

const ratingChoices = [
  { value: "G", label: "General Audience" },
  { value: "PG", label: "Parental Guidance" },
  { value: "PG-13", label: "Parents Strongly Cautioned" },
  { value: "R", label: "Restricted" },
  { value: "NC-17", label: "Adults Only" },
];

const filters = [
  { f: "genre", values: genreChoices },
  { f: "language", values: languageChoices },
  { f: "rating", values: ratingChoices },
];

const MovieFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = (key, param) => {
    const v = searchParams.get(key);
    if (v === param) return;
    searchParams.set(key, param);
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    // Clear all search parameters
    setSearchParams({});
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1">
        <CiFilter />
        Filter
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-50 bg-zinc-950 rounded-xl p-4 w-[15em] sm:w-[18em]">
        <Accordion>
          {filters.map((f, i) => (
            <AccordionItem
              key={i}
              aria-label={f.f}
              title={f.f.charAt(0).toUpperCase() + f.f.slice(1)}
            >
              <div className="w-full flex flex-wrap items-center gap-1">
                {f.values.map((v) => (
                  <Chip
                    key={v.value}
                    onClick={() => setParams(f.f, v.value)}
                    color="danger"
                    variant={`${
                      searchParams.get(f.f) === v.value ? "solid" : "flat"
                    }`}
                    className="cursor-pointer text-xs"
                  >
                    {v.label}
                  </Chip>
                ))}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
        <button
          onClick={clearAllFilters}
          className="mt-4 w-full text-xs text-center text-white bg-red-500 rounded-lg p-2"
        >
          Clear All Filters
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MovieFilter;
