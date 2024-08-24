import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/button";
import axios from "axios";
import AppLayout from "../components/AppLayout";
import Text from "../components/text";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const bookingData = location.state;
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded successfully");
    script.onerror = () => console.log("Failed to load the Razorpay script");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async () => {
    if (bookingData && bookingData.booking_id) {
      setLoading(true);
      try {
        const response = await axios.post(
          `/api/v1/create_order/${bookingData.booking_id}/`
        );
        setOrderDetails(response.data);
        openRazorpay(response.data);
        toast.success("Order created successfully!");
      } catch (err) {
        setError("Failed to create order.");
        toast.error("Failed to create order.");
        console.error("Order creation error:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Booking data is missing.");
      toast.error("Booking data is missing.");
    }
  };

  const openRazorpay = (orderDetails) => {
    if (!orderDetails) return;

    const options = {
      key: orderDetails.razorpay_key,
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      name: "FilmFlare",
      description: "Booking Transaction",
      order_id: orderDetails.order_id,
      handler: async function (response) {
        toast.success(
          `Payment successful! Payment ID: ${response.razorpay_payment_id}`
        );
        try {
          const verificationResponse = await axios.post(
            "/api/v1/verify_payment/",
            {
              payment_id: response.razorpay_payment_id,
              order_id: orderDetails.order_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (
            verificationResponse.data.status ===
              "Payment verified and booking confirmed!" &&
            verificationResponse.data.email_sent
          ) {
            toast.success(
              "Payment verified successfully, and your booking is confirmed!"
            );
            navigate("/order_confirmed", {
              state: {
                bookingId: bookingData.booking_id,
                movieTitle: bookingData.movie_title,
                totalPrice: bookingData.total_price,
                screeningDate: bookingData.screening_date,
                screeningTime: bookingData.screening_time,
                theater: bookingData.theater,
              },
            });
          } else {
            toast.error(
              "Payment verification succeeded, but email was not sent successfully."
            );
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          toast.error("An error occurred during payment verification.");
        }
      },
      prefill: {
        name: user.username,
        email: user.email,
        contact: "9999999999",
      },
      notes: {
        address: "FilmFlare , Head Corporate Office Delhi",
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const trimmedBookingId = bookingData?.booking_id?.slice(0, 12) + "...";

  return (
    <AppLayout>
      <div className="mt-20 w-full mx-auto sm:container px-4 flex flex-col items-center">
        <div className="bg-foreground-800/50 w-full relative sm:w-96 rounded-xl overflow-hidden p-6">
          <div className="absolute top-1/2 -left-4 w-7 h-7 bg-background rounded-full" />
          <div className="absolute top-1/2 -right-4 w-7 h-7 bg-background rounded-full" />

          <h3 className="text-xl mb-6 font-semibold font-mono tracking-wide uppercase text-primary-300 text-center">
            Booking Summary
          </h3>

          <div className="px-4 space-y-6">
            <div className="flex items-center justify-between">
              <Text
                text="Movie Title"
                variant="primary"
                className="font-medium"
              />
              <Text
                text={bookingData?.movie_title || "N/A"}
                variant="primary"
                className="font-medium"
              />
            </div>

            <div className="flex items-center justify-between">
              <Text
                text="Booking ID"
                variant="primary"
                className="font-medium"
              />
              <Text
                text={trimmedBookingId || "N/A"}
                variant="primary"
                className="font-medium"
              />
            </div>

            <div className="flex items-center justify-between">
              <Text text="Status" variant="primary" className="font-medium" />
              <Text
                text={bookingData?.status || "N/A"}
                variant="primary"
                className="font-medium"
              />
            </div>

            <div>
              <Text
                text="Seats"
                variant="primary"
                className="font-medium mb-2"
              />
              <ul className="space-y-3 pl-4">
                {bookingData?.seats?.map((seat, index) => (
                  <li key={index} className="flex justify-between">
                    <Text
                      text={`Row ${seat.row}, Seat ${seat.number} (${seat.seat_type})`}
                      variant="primary"
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between border-t-2 pt-4">
              <Text
                text="Total Price"
                variant="primary"
                className="font-semibold text-lg"
              />
              <Text
                text={`Rs. ${parseFloat(bookingData?.total_price || 0).toFixed(
                  2
                )}`}
                variant="primary"
                className="font-semibold text-lg"
              />
            </div>

            {/* New Section for Screening Details */}
            <div className="border-t-2 pt-4">
              <div className="flex items-center justify-between">
                <Text
                  text="Screening Date"
                  variant="primary"
                  className="font-medium"
                />
                <Text
                  text={bookingData?.screening_date || "N/A"}
                  variant="primary"
                  className="font-medium"
                />
              </div>

              <div className="flex items-center justify-between">
                <Text
                  text="Screening Time"
                  variant="primary"
                  className="font-medium"
                />
                <Text
                  text={bookingData?.screening_time || "N/A"}
                  variant="primary"
                  className="font-medium"
                />
              </div>

              <div className="flex items-center justify-between">
                <Text
                  text="Theater"
                  variant="primary"
                  className="font-medium"
                />
                <Text
                  text={bookingData?.theater || "N/A"}
                  variant="primary"
                  className="font-medium"
                />
              </div>
            </div>
            {/* End of New Section */}
          </div>
        </div>

        <div className="mt-8 w-full sm:w-96">
          <Button
            onClick={handleCheckout}
            className="w-full"
            color="success"
            size="lg"
            radius="sm"
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
            {loading && (
              <span className="ml-2 spinner-border spinner-border-sm"></span>
            )}
          </Button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </AppLayout>
  );
};

export default OrderSummary;
