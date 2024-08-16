import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import AppLayout from "./AppLayout";
import Text from "./text"; // Assuming you have a Text component for styled text
import { Button } from "@nextui-org/button"; // Assuming you're using a button component

const OrderConfirmed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Fetching user from Redux
  const {
    bookingId,
    movieTitle,
    totalPrice,
    screeningDate,
    screeningTime,
    theater,
  } = location.state || {};

  // Function to trim the booking ID to half its length
  const trimBookingId = (id) => {
    if (!id) return "N/A";
    const halfLength = Math.ceil(id.length / 2);
    return `${id.slice(0, halfLength)}...`;
  };

  // Function to generate and download the PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Order Confirmed!", 20, 20);

    doc.setFontSize(12);
    doc.text(`Movie Title: ${movieTitle || "N/A"}`, 20, 40);
    doc.text(`Booking ID: ${trimBookingId(bookingId)}`, 20, 50);
    doc.text(`Total Price: Rs. ${parseFloat(totalPrice).toFixed(2)}`, 20, 60);
    doc.text(`Screening Date: ${screeningDate || "N/A"}`, 20, 70);
    doc.text(`Screening Time: ${screeningTime || "N/A"}`, 20, 80);
    doc.text(`Theater: ${theater || "N/A"}`, 20, 90);

    doc.save("order-confirmation.pdf");
  };
  const handleBackToMovies = () => {
    navigate("/explore/movie");
  };

  return (
    <AppLayout>
      <div className="mt-20 w-full mx-auto sm:container px-4 flex flex-col items-center">
        <div className="bg-foreground-800/50 w-full relative sm:w-96 rounded-xl overflow-hidden p-8 text-center">
          <h3 className="text-2xl mb-6 font-semibold font-mono tracking-wide uppercase text-primary-300">
            Order Confirmed!
          </h3>

          <p className="text-lg mb-6">Thank you for your purchase!</p>

          <div className="text-left space-y-4">
            <div className="flex justify-between">
              <Text
                text="Movie Title"
                variant="primary"
                className="font-medium"
              />
              <Text
                text={movieTitle || "N/A"}
                variant="primary"
                className="font-medium"
              />
            </div>

            <div className="flex justify-between">
              <Text
                text="Booking ID"
                variant="primary"
                className="font-medium"
              />
              <Text
                text={trimBookingId(bookingId)}
                variant="primary"
                className="font-medium"
              />
            </div>

            <div className="flex justify-between">
              <Text
                text="Total Price"
                variant="primary"
                className="font-medium"
              />
              <Text
                text={`Rs. ${parseFloat(totalPrice).toFixed(2)}`}
                variant="primary"
                className="font-medium"
              />
            </div>

            <div className="flex justify-between">
              <Text
                text="Screening Date"
                variant="primary"
                className="font-medium"
              />
              <Text
                text={screeningDate || "N/A"}
                variant="primary"
                className="font-medium"
              />
            </div>

            <div className="flex justify-between">
              <Text
                text="Screening Time"
                variant="primary"
                className="font-medium"
              />
              <Text
                text={screeningTime || "N/A"}
                variant="primary"
                className="font-medium"
              />
            </div>

            <div className="flex justify-between">
              <Text text="Theater" variant="primary" className="font-medium" />
              <Text
                text={theater || "N/A"}
                variant="primary"
                className="font-medium"
              />
            </div>
          </div>

          {/* Confirmation Email Sent Message */}
          <p className="mt-6 text-sm text-primary-300">
            Booking confirmation details have been sent successfully to your
            <span style={{ color: "#FF5722" }}> {user?.email} </span>
            email account.
          </p>

          {/* Download Button */}
          <div className="mt-6">
            <Button onClick={handleDownloadPDF} color="primary">
              Download Confirmation as PDF
            </Button>
          </div>
          <div className="mt-4">
            <Button onClick={handleBackToMovies} color="secondary">
              Back to Movies Page
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrderConfirmed;
