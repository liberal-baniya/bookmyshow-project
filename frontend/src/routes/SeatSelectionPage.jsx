// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Button } from "@nextui-org/button";
// import { Spinner } from "@nextui-org/spinner";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import "./seatselection.css"; // Import the CSS file

// const SeatSelection = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search);

//   const movieTitle = query.get("movieTitle");
//   const theaterName = query.get("theaterName");
//   const theaterLocation = query.get("theaterLocation");
//   const screeningDate = query.get("screeningDate");
//   const screeningTime = query.get("screeningTime");
//   const screening_id = query.get("screening_id");

//   const [bookId, setBookId] = useState([]);
//   const [cinemaSeats, setCinemaSeats] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchSeats = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `/api/v1/screenings/${screening_id}/seats/`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch seats");
//         }
//         const data = await response.json();
//         setCinemaSeats(data.seats || []);
//       } catch (error) {
//         toast.error("Error fetching seats. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSeats();
//   }, [screening_id]);

//   const handleClick = (seat) => {
//     if (seat.is_available) {
//       setBookId((prevId) => {
//         if (prevId.includes(seat)) {
//           return prevId.filter((s) => s !== seat);
//         } else {
//           return [...prevId, seat];
//         }
//       });
//     }
//   };

//   const calculateTotalPrice = () => {
//     return bookId.reduce((total, seat) => total + parseFloat(seat.price), 0).toFixed(2);
//   };

//   const groupedSeats = cinemaSeats.reduce((acc, seat) => {
//     if (!acc[seat.row]) {
//       acc[seat.row] = [];
//     }
//     acc[seat.row].push(seat);
//     return acc;
//   }, {});

//   return (
//     <div className="h-screen w-full bg-background flex flex-col gap-4 overflow-x-hidden text-white">
//       <ToastContainer />

//       {/* Header with Date and Time */}
//       <div className="flex justify-between items-center p-4 bg-dark-blue text-light-gray">
//         <h3>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(new Date(screeningDate))}</h3>
//         <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg px-3 py-2">
//           {screeningTime}
//         </div>
//       </div>

//       {/* Screen and Theater Name */}
//       <div className="text-center my-4">
//         <h1 className="text-2xl font-bold">{movieTitle}</h1>
//         <h2 className="text-2xl font-bold">SCREEN</h2>
//         <div className="w-full h-12 bg-gray-700 rounded-lg mt-4 mx-auto max-w-md"></div>
//         <h3 className="mt-6 text-xl">{theaterName}</h3>
//       </div>

//       {/* Seat Layout */}
//       <div className="flex flex-col items-center flex-grow">
//         {loading ? (
//           <Spinner size="lg" />
//         ) : (
//           <div className="w-full max-w-3xl px-4 flex flex-col gap-4">
//             {Object.keys(groupedSeats).map((row, rowIndex) => (
//               <div key={rowIndex} className="flex justify-center">
//                 {groupedSeats[row].map((seat) => (
//                   <button
//                     key={seat.id}
//                     onClick={() => handleClick(seat)}
//                     disabled={!seat.is_available}
//                     aria-label={`Row ${seat.row}, Seat ${seat.number}`}
//                     className={`seat-btn ${
//                       seat.is_available
//                         ? bookId.includes(seat)
//                           ? "selected-seat"
//                           : "available-seat"
//                         : "sold-seat"
//                     } text-white m-1 p-2 rounded-md`}
//                   >
//                     {seat.row}{seat.number}
//                   </button>
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Footer with Selected Seats and Total Price */}
//       <div className="p-4 bg-dark-blue text-white">
//         <div className="flex justify-between items-center">
//           <div>
//             <p>You Have Chosen Seats: {bookId.map(seat => `${seat.row}${seat.number} (${seat.seat_type})`).join(', ')}</p>
//           </div>
//           <div>
//             <p>Total Price: {calculateTotalPrice()}</p>
//           </div>
//         </div>
//         <div className="flex justify-center mt-4">
//           <Button
//             onClick={() => {
//               navigate(`/order_summary/${screening_id}`, {
//                 replace: true,
//                 state: {
//                   movieTitle,
//                   theaterName,
//                   theaterLocation,
//                   screeningDate,
//                   screeningTime,
//                   selectedSeats: bookId,
//                 },
//               });
//             }}
//             disabled={bookId.length === 0}
//             className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-4 py-2"
//           >
//             PROCEED
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeatSelection;
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector from react-redux
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./seatselection.css"; // Import the CSS file

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const movieTitle = query.get("movieTitle");
  const theaterName = query.get("theaterName");
  const theaterLocation = query.get("theaterLocation");
  const screeningDate = query.get("screeningDate");
  const screeningTime = query.get("screeningTime");
  const screening_id = query.get("screening_id");
  // Access the user ID from the Redux state
  const user_id = useSelector((state) => state.auth.user.id);

  // Log the user ID to ensure it's being accessed correctly
  useEffect(() => {
    console.log("User ID:", user_id);
  }, [user_id]);
  const [bookId, setBookId] = useState([]);
  const [cinemaSeats, setCinemaSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/v1/screenings/${screening_id}/seats/`,
          {
            method: "GET",
            credentials: "include",  // Include credentials (cookies, etc.)
          }
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch seats");
        }
        const data = await response.json();
        setCinemaSeats(data.seats || []);
      } catch (error) {
        toast.error("Error fetching seats. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [screening_id]);

  const handleClick = (seat) => {
    if (seat.is_available) {
      setBookId((prevId) => {
        if (prevId.includes(seat)) {
          return prevId.filter((s) => s !== seat);
        } else {
          return [...prevId, seat];
        }
      });
    }
  };

  const handleBooking = async () => {
    try {
      const response = await fetch(
        "/api/v1/seats/bookings/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",  // Include credentials (cookies, etc.)
          body: JSON.stringify({
            user: user_id,
            screening: screening_id,
            seats: bookId.map((seat) => seat.id), // Sending array of seat IDs
          }),
        }
      );
      

      if (!response.ok) {
        throw new Error("Failed to book seats");
      }

      const bookingData = await response.json();

      // Navigate to Order Summary with API response data
      navigate(`/order_summary/${screening_id}`, {
        replace: true,
        state: bookingData, // Send the entire booking data to OrderSummary
      });
    } catch (error) {
      toast.error("Booking failed. Please try again.");
    }
  };
  const calculateTotalPrice = () => {
    return bookId
      .reduce((total, seat) => total + parseFloat(seat.price), 0)
      .toFixed(2);
  };
  const groupedSeats = cinemaSeats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <div className="h-screen w-full bg-background flex flex-col gap-4 overflow-x-hidden text-white">
      <ToastContainer />

      {/* Header with Date and Time */}
      <div className="flex justify-between items-center p-4 bg-dark-blue text-light-gray">
        <h3>
          {new Intl.DateTimeFormat("en-GB", { dateStyle: "full" }).format(
            new Date(screeningDate)
          )}
        </h3>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg px-3 py-2">
          {screeningTime}
        </div>
      </div>

      {/* Screen and Theater Name */}
      <div className="text-center my-4">
        <h1 className="text-2xl font-bold">{movieTitle}</h1>
        <h2 className="text-2xl font-bold">SCREEN</h2>
        <div className="w-full h-12 bg-gray-700 rounded-lg mt-4 mx-auto max-w-md"></div>
        <h3 className="mt-6 text-xl">{theaterName}</h3>
      </div>

      {/* Seat Layout */}
      <div className="flex flex-col items-center flex-grow">
        {loading ? (
          <Spinner size="lg" />
        ) : (
          <div className="w-full max-w-3xl px-4 flex flex-col gap-4">
            {Object.keys(groupedSeats).map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center">
                {groupedSeats[row].map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => handleClick(seat)}
                    disabled={!seat.is_available}
                    aria-label={`Row ${seat.row}, Seat ${seat.number}`}
                    className={`seat-btn ${
                      seat.is_available
                        ? bookId.includes(seat)
                          ? "selected-seat"
                          : "available-seat"
                        : "sold-seat"
                    } text-white m-1 p-2 rounded-md`}
                  >
                    {seat.row}
                    {seat.number}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Selected Seats and Total Price */}
      <div className="p-4 bg-dark-blue text-white">
        <div className="flex justify-between items-center">
          <div>
            {" "}
            <p>
              You Have Chosen Seats:{" "}
              {bookId
                .map((seat) => `${seat.row}${seat.number} (${seat.seat_type})`)
                .join(", ")}
            </p>
          </div>
          <div>
            <p>Total Price: {calculateTotalPrice()}</p>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleBooking} // Send booking data to API and navigate to OrderSummary
            disabled={bookId.length === 0}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-4 py-2"
          >
            PROCEED
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;

{
  /* Footer with Selected Seats and Total Price */
}
//       <div className="p-4 bg-dark-blue text-white">
//         <div className="flex justify-between items-center">
//           <div>
//             <p>You Have Chosen Seats: {bookId.map(seat => `${seat.row}${seat.number} (${seat.seat_type})`).join(', ')}</p>
//           </div>
//           <div>
//             <p>Total Price: {calculateTotalPrice()}</p>
//           </div>
//         </div>
//         <div className="flex justify-center mt-4">
//           <Button
//             onClick={() => {
//               navigate(`/order_summary/${screening_id}`, {
//                 replace: true,
//                 state: {
//                   movieTitle,
//                   theaterName,
//                   theaterLocation,
//                   screeningDate,
//                   screeningTime,
//                   selectedSeats: bookId,
//                 },
//               });
//             }}
//             disabled={bookId.length === 0}
//             className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-4 py-2"
//           >
//             PROCEED
//           </Button>
//         </div>
//       </div>
//     </div>
