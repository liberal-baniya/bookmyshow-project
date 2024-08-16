
import React, { useEffect, useState } from 'react';
import { GiTicket } from "react-icons/gi";
import { Spinner } from '@nextui-org/react';

const Orders = () => {
   const [upcomingOrders, setUpcomingOrders] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchBookings = async () => {
         try {
            const response = await fetch('/api/v1/my-bookings/', {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
               },
               credentials: "include",
            });
            if (response.ok) {
               const data = await response.json();
               setUpcomingOrders(data.bookings);
            } else {
               console.error('Failed to fetch bookings');
            }
         } catch (error) {
            console.error('Error fetching bookings:', error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchBookings();
   }, []);

   if (isLoading) {
      return (
         <div className="flex justify-center items-center h-full">
            <Spinner size="lg" />
         </div>
      );
   }

   const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return isNaN(date) ? "Invalid date" : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
   };

   return (
      <div className="w-full flex-col flex items-center mx-auto px-2">
         <div className="w-full sm:container flex flex-col items-center">
            <ul className="space-y-3 w-full sm:w-1/2">
               {upcomingOrders.map(o => (
                  <li key={o.razorpay_order_id} className="border-b-1 border-foreground-800/20 bg-foreground-800/20 shadow-sm shadow-foreground-800 p-2 rounded-lg text-sm">
                     
                     <div className="w-full flex items-center justify-between">
                        <p className="uppercase font-mono font-medium text-[1em] tracking-wider text-foreground-400">Razorpay Order Id</p>
                        <p className="font-semibold">{o.razorpay_order_id}</p>
                     </div>

                     <div className="w-full flex items-center justify-between">
                        <p className="font-semibold text-lg">{o.movie_title}</p>
                        <p className="flex items-center text-[0.9em] gap-1">
                           {o.seats.length} Tickets <GiTicket />
                        </p>
                     </div>

                     <p className="text-sm sm:text-[0.9em]">
                        Screening Date: {formatDate(o.screening_date)}
                     </p>
                     <p className="text-sm sm:text-[0.9em]">
                        Screening Time: {o.screening_time || "N/A"}
                     </p>
                     <p className="text-sm sm:text-[0.9em]">
                        Theater: {o.theater || "N/A"}
                     </p>
                     <p className="text-sm sm:text-[0.9em]">
                        Status: {o.status}
                     </p>
                     <p className="text-sm sm:text-[0.9em]">
                        Total Price: ${o.total_price}
                     </p>
                     <p className="text-sm sm:text-[0.9em]">
                        Booking Created At: {formatDate(o.created_at)}
                     </p>
                  </li>
               ))}
            </ul>
         </div>
      </div>
   );
}

export default Orders;


