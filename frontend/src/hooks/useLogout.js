import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../redux/authSlice.js"; // Adjust the path as necessary

const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch

  const logout = async () => {
    try {
      const response = await axios.post(
        "/api/v1/auth/logout/",
        {}, // Assuming the body is empty for a logout request
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Still include credentials for cookies
        }
      );

      if (response.status !== 200) {
        console.error("Logout failed:", response.data);
        toast.error("Logout failed. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        // Dispatch the logout action to update the Redux store
        dispatch(logoutAction());

        toast.success("Logout successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Redirect to the sign-in page after logout
        navigate("/sign_in");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return logout;
};

export default useLogout;
