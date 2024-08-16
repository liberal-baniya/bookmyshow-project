import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy } from "react";
import "./index.css";
import BuyTickets from "./routes/buyTickets";
import SeatSelection from "./routes/SeatSelectionPage";
import AuthGuard from "./components/AuthGuard";
import store from "./redux/store";
import { NextUIProvider } from "@nextui-org/react";
import { Navigate } from "react-router-dom";
import { Suspense } from "react";

import { Provider } from "react-redux";

// Lazy loading components
const EditProfilepage = lazy(() => import("./routes/editProfilePage"));
const ExplorePage = lazy(() => import("./routes/explorePage"));
const LandingPage = lazy(() => import("./routes/LandingPage"));

const MoviePage = lazy(() => import("./routes/movie"));
const SignUp = lazy(() => import("./routes/Signup"));
const ForgotPassword = lazy(() => import("./routes/ForgotPassword"));
const ResetPassword = lazy(() => import("./routes/ResetPassword"));
const SignIn = lazy(() => import("./routes/Signin"));
const UserProfilePage = lazy(() => import("./routes/userProfile"));
const MovieInDetail = lazy(() => import("./routes/movieInDetail"));
const OrderSummary = lazy(() => import("./routes/order_summary"));
const OrderConfirmedPage = lazy(() => import("./components/OrderConfirmed"));
const Orders = lazy(() => import("./routes/orders"));


const AccountSettings = lazy(() => import("./routes/accountSettings"));

const LoadingPage = lazy(() => import("./routes/loadingPage"));
const PageNotFound = lazy(() => import("./routes/pagenotFound"));

const router = createBrowserRouter([
  { element: <LandingPage />, path: "/", children: [] },
  { element: <SignIn />, path: "/sign_in", children: [] },
  { element: <SignUp />, path: "/sign_up", children: [] },
  { element: <ForgotPassword />, path: "/forgot-password", children: [] },
  {
    element: <ResetPassword />,
    path: "/reset-password/:uid/:token",
    children: [],
  },
  {
    element: <ExplorePage />,
    path: "/explore",
    children: [
      { element: <Navigate to="/explore/movie" />, index: true },
      {
        element: <MoviePage />,
        path: "movie",
        children: [],
      },
      { element: <MovieInDetail />, path: "movies/:name/:id" },
    ],
  },
  {
    element: (
      <AuthGuard>
        <BuyTickets />
      </AuthGuard>
    ),
    path: "/buy_tickets/:movie_name-location/:movie_id/:extra_details",
    children: [],
  },
  {
    element: (
      <AuthGuard>
        <SeatSelection />
      </AuthGuard>
    ),
    path: "/seat_layout/:location",
  },

  {
    element: (
      <AuthGuard>
        <OrderSummary />
      </AuthGuard>
    ),
    path: "/order_summary/:screening_id",
  },
  {
    element: (
      <AuthGuard>
        <OrderConfirmedPage />
      </AuthGuard>
    ),
    path: "/order_confirmed",
  },
  {
    element: (
      
        <UserProfilePage />
      
    ),
    path: "/my_profile",
    children: [
      { element: <Navigate to="/my_profile/edit" />, index: true },
      { element: <EditProfilepage />, path: "edit" },
      { element: <Orders />, path: "orders" },

      { element: <AccountSettings />, path: "settings" },
    ],
  },

  

  { path: "*", element: <PageNotFound /> },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <Suspense fallback={<LoadingPage />}>
          <RouterProvider router={router} />
        </Suspense>
      </NextUIProvider>
    </Provider>
  </React.StrictMode>
);
