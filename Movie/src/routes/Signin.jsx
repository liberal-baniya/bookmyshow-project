import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "@nextui-org/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import lines from "../assets/lines.svg";
import Brand from "../components/brand";
import AppLayout from "../components/AppLayout";

// Import useDispatch from react-redux and the setAuthenticated action
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../redux/authSlice.js"; // Adjust the path as necessary

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShow, setShow] = useState(false);
  const navigate = useNavigate(); // Use useNavigate for navigation
  const dispatch = useDispatch(); // Initialize useDispatch

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username,
      password,
    };

    try {
      const response = await fetch("/api/v1/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // Important for including cookies in requests
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.non_field_errors) {
          toast.error(errorData.non_field_errors[0], {
            position: "top-center",
            theme: "colored",
          });
        } else {
          toast.error(
            "Login failed. Please check your username and password.",
            {
              position: "top-center",
              theme: "colored",
            }
          );
        }
      } else {
        const result = await response.json();
        

        // Dispatch the setAuthenticated action with the user data
        dispatch(setAuthenticated(result));

        toast.success("Login successful!", {
          position: "top-center",
          theme: "colored",
        });

        navigate("/explore"); // Use navigate to redirect to a protected route
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred during login. Please try again.", {
        position: "top-center",
        theme: "colored",
      });
    }
  };

  const handleAdminLogin = () => {
    window.open("http://127.0.0.1:8000/admin/", "_blank");
    navigate("/sign_in"); // Or any other route you want the user to remain on
  };

  return (
    <AppLayout>
      <div className="relative w-full mx-auto h-[100dvh] flex justify-center items-center px-5 overflow-hidden">
        <div className="fixed top-0 left-0 p-4">
          <Brand />
        </div>
        <div className="border-opacity-10 fixed top-0 left-0 h-[100dvh] w-screen">
          {/* <Image
            src={lines}
            isBlurred
            className="h-[100dvh] w-screen object-cover"
          /> */}
        </div>
        <Card
          isBlurred
          className="bg-transparent backdrop-blur-lg h-fit px-8 py-6"
          radius="lg"
        >
          <CardHeader className="flex flex-col items-start mb-4">
            <span className="text-lg text-gray-200">Hello</span>
            <h1 className="font-bold text-3xl uppercase tracking-wide text-white">
              Welcome Back
            </h1>
          </CardHeader>
          <CardBody className="space-y-6">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 w-full">
                <Input
                  size="sm"
                  type="text"
                  label="Username"
                  radius="lg"
                  color="default"
                  variant="bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <Input
                  size="sm"
                  type={isShow ? "text" : "password"}
                  label="Password"
                  radius="lg"
                  variant="bordered"
                  color="default"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <Checkbox
                    onChange={() => setShow((e) => !e)}
                    defaultChecked={isShow}
                    size="sm"
                    className="text-xs text-gray-300"
                  >
                    Show Password
                  </Checkbox>
                  <Link
                    to="/forgot-password"
                    className="text-primary-400 hover:underline transition-all duration-150 text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="flex justify-center items-center w-full">
                <Button
                  type="submit"
                  color="primary"
                  className="text-white bg-primary-500 py-3 px-8 rounded-lg hover:bg-primary-600 transition-all duration-200"
                >
                  Sign In
                </Button>
              </div>

              <div className="flex justify-center items-center w-full mt-4">
                <Button
                  type="button"
                  color="secondary"
                  className="text-white bg-secondary-500 py-3 px-8 rounded-lg hover:bg-secondary-600 transition-all duration-200"
                  onClick={handleAdminLogin}
                >
                  Login as Admin
                </Button>
              </div>

              <p className="text-sm text-gray-300 text-center mt-4">
                Don't have an account?{" "}
                <Link
                  to={"/sign_up"}
                  className="text-primary-500 hover:underline duration-150 transition-all"
                >
                  Signup now
                </Link>
              </p>
            </form>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SignIn;





// import React, { useState } from "react";
// import { Card, CardBody, CardHeader } from "@nextui-org/card";
// import { Input } from "@nextui-org/input";
// import { Checkbox } from "@nextui-org/checkbox";
// import { Button } from "@nextui-org/button";
// import { Link, useNavigate } from "react-router-dom";
// import { Image } from "@nextui-org/image";
// import { toast } from "react-toastify"; // Import toast functions
// import "react-toastify/dist/ReactToastify.css"; // Import toast styles
// import lines from "../assets/lines.svg";
// import Brand from "../components/brand";
// import AppLayout from "../components/AppLayout";

// const SignIn = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isShow, setShow] = useState(false);
//   const navigate = useNavigate(); // Use useNavigate for navigation

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = {
//       username,
//       password,
//     };

//     try {
//       const response = await fetch("/api/v1/auth/login/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//         credentials: "include", // Important for including cookies in requests
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (errorData.non_field_errors) {
//           toast.error(errorData.non_field_errors[0], {
//             position: "top-center",
//             theme: "colored",
//           });
//         } else {
//           toast.error(
//             "Login failed. Please check your username and password.",
//             {
//               position: "top-center",
//               theme: "colored",
//             }
//           );
//         }
//       } else {
//         toast.success("Login successful!", {
//           position: "top-center",
//           theme: "colored",
//         });
//         navigate("/explore"); // Use navigate to redirect to a protected route
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       toast.error("An error occurred during login. Please try again.", {
//         position: "top-center",
//         theme: "colored",
//       });
//     }
//   };

//   const handleAdminLogin = () => {
//     // window.location.href = "http://127.0.0.1:8000/admin/login/?next=/admin/"
//     window.open("http://127.0.0.1:8000/admin/", "_blank");
//     navigate("/sign_in"); // Or any other route you want the user to remain on
//   };

//   return (
//     <AppLayout>
//       <div className="relative w-full mx-auto h-[100dvh] flex justify-center items-center px-5 overflow-hidden">
//         <div className="fixed top-0 left-0 p-4">
//           <Brand />
//         </div>
//         <div className="border-opacity-10 fixed top-0 left-0 h-[100dvh] w-screen">
//           <Image
//             src={lines}
//             isBlurred
//             className="h-[100dvh] w-screen object-cover"
//           />
//         </div>
//         <Card
//           isBlurred
//           className="bg-transparent backdrop-blur-lg h-fit px-8 py-6"
//           radius="lg"
//         >
//           <CardHeader className="flex flex-col items-start mb-4">
//             <span className="text-lg text-gray-200">Hello</span>
//             <h1 className="font-bold text-3xl uppercase tracking-wide text-white">
//               Welcome Back
//             </h1>
//           </CardHeader>
//           <CardBody className="space-y-6">
//             <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
//               <div className="flex flex-col gap-4 w-full">
//                 <Input
//                   size="sm"
//                   type="text"
//                   label="Username"
//                   radius="lg"
//                   color="default"
//                   variant="bordered"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                 />

//                 <Input
//                   size="sm"
//                   type={isShow ? "text" : "password"}
//                   label="Password"
//                   radius="lg"
//                   variant="bordered"
//                   color="default"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//                   <Checkbox
//                     onChange={() => setShow((e) => !e)}
//                     defaultChecked={isShow}
//                     size="sm"
//                     className="text-xs text-gray-300"
//                   >
//                     Show Password
//                   </Checkbox>
//                   <Link
//                     to="/forgot-password"
//                     className="text-primary-400 hover:underline transition-all duration-150 text-sm"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//               </div>

//               <div className="flex justify-center items-center w-full">
//                 <Button
//                   type="submit"
//                   color="primary"
//                   className="text-white bg-primary-500 py-3 px-8 rounded-lg hover:bg-primary-600 transition-all duration-200"
//                 >
//                   Sign In
//                 </Button>
//               </div>

//               <div className="flex justify-center items-center w-full mt-4">
//                 <Button
//                   type="button"
//                   color="secondary"
//                   className="text-white bg-secondary-500 py-3 px-8 rounded-lg hover:bg-secondary-600 transition-all duration-200"
//                   onClick={handleAdminLogin}
//                 >
//                   Login as Admin
//                 </Button>
//               </div>

//               <p className="text-sm text-gray-300 text-center mt-4">
//                 Don't have an account?{" "}
//                 <Link
//                   to={"/sign_up"}
//                   className="text-primary-500 hover:underline duration-150 transition-all"
//                 >
//                   Signup now
//                 </Link>
//               </p>
//             </form>
//           </CardBody>
//         </Card>
//       </div>
//     </AppLayout>
//   );
// };

// export default SignIn;

// import React, { useState } from "react";
// import { Card, CardBody, CardHeader } from "@nextui-org/card";
// import { Input } from "@nextui-org/input";
// import { Checkbox } from "@nextui-org/checkbox";
// import { Button } from "@nextui-org/button";
// import { Link, useNavigate } from "react-router-dom";
// import { Image } from "@nextui-org/image";
// import { toast } from "react-toastify"; // Import toast functions
// import "react-toastify/dist/ReactToastify.css"; // Import toast styles
// import lines from "../assets/lines.svg";
// import Brand from "../components/brand";
// import AppLayout from "../components/AppLayout";

// const SignIn = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isShow, setShow] = useState(false);
//   const navigate = useNavigate(); // Use useNavigate for navigation

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = {
//       username,
//       password,
//     };

//     try {
//       const response = await fetch("/api/v1/auth/login/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//         credentials: "include", // Important for including cookies in requests
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (errorData.non_field_errors) {
//           toast.error(errorData.non_field_errors[0], {
//             position: "top-center",
//             theme: "colored",
//           });
//         } else {
//           toast.error(
//             "Login failed. Please check your username and password.",
//             {
//               position: "top-center",
//               theme: "colored",
//             }
//           );
//         }
//       } else {
//         const result = await response.json();
//         if (result.is_staff || result.is_superuser) {
//           toast.success("Admin login successful! Redirecting to admin panel...", {
//             position: "top-center",
//             theme: "colored",
//           });
//           window.location.href = "http://127.0.0.1:8000/admin/login/?next=/admin/";
//         } else {
//           toast.success("Login successful!", {
//             position: "top-center",
//             theme: "colored",
//           });
//           navigate("/explore"); // Use navigate to redirect to a protected route
//         }
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       toast.error("An error occurred during login. Please try again.", {
//         position: "top-center",
//         theme: "colored",
//       });
//     }
//   };

//   return (
//     <AppLayout>
//       <div className="relative w-full mx-auto h-[100dvh] flex justify-center items-center px-5 overflow-hidden">
//         <div className="fixed top-0 left-0 p-4">
//           <Brand />
//         </div>
//         <div className="border-opacity-10 fixed top-0 left-0 h-[100dvh] w-screen">
//           <Image
//             src={lines}
//             isBlurred
//             className="h-[100dvh] w-screen object-cover"
//           />
//         </div>
//         <Card
//           isBlurred
//           className="bg-transparent backdrop-blur-lg h-fit px-8 py-6"
//           radius="lg"
//         >
//           <CardHeader className="flex flex-col items-start mb-4">
//             <span className="text-lg text-gray-200">Hello</span>
//             <h1 className="font-bold text-3xl uppercase tracking-wide text-white">
//               Welcome Back
//             </h1>
//           </CardHeader>
//           <CardBody className="space-y-6">
//             <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
//               <div className="flex flex-col gap-4 w-full">
//                 <Input
//                   size="sm"
//                   type="text"
//                   label="Username"
//                   radius="lg"
//                   color="default"
//                   variant="bordered"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                 />

//                 <Input
//                   size="sm"
//                   type={isShow ? "text" : "password"}
//                   label="Password"
//                   radius="lg"
//                   variant="bordered"
//                   color="default"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//                   <Checkbox
//                     onChange={() => setShow((e) => !e)}
//                     defaultChecked={isShow}
//                     size="sm"
//                     className="text-xs text-gray-300"
//                   >
//                     Show Password
//                   </Checkbox>
//                   <Link
//                     to="/forgot-password"
//                     className="text-primary-400 hover:underline transition-all duration-150 text-sm"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//               </div>

//               <div className="flex justify-center items-center w-full">
//                 <Button
//                   type="submit"
//                   color="primary"
//                   className="text-white bg-primary-500 py-3 px-8 rounded-lg hover:bg-primary-600 transition-all duration-200"
//                 >
//                   Sign In
//                 </Button>
//               </div>

//               <div className="flex justify-center items-center w-full mt-4">
//                 <p className="text-sm text-gray-300">
//                   Don't have an account?{" "}
//                   <Link
//                     to="/sign_up"
//                     className="text-primary-500 hover:underline duration-150 transition-all"
//                   >
//                     Sign up
//                   </Link>
//                 </p>
//               </div>
//             </form>
//           </CardBody>
//         </Card>
//       </div>
//     </AppLayout>
//   );
// };

// export default SignIn;
