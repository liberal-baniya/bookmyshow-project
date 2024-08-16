// import { useState } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
// import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
// import lines from "../assets/lines.svg";
// import Brand from "../components/brand";
// import AppLayout from "../components/AppLayout";
// import { Input } from "@nextui-org/input";
// import { Button } from "@nextui-org/button";
// import { Link } from "react-router-dom";
// import { Image } from "@nextui-org/image";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const SignUp = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const navigate = useNavigate(); // Initialize useNavigate

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match", {
//         position: "top-center",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "colored",
//       });
//       return;
//     }

//     const data = {
//       username,
//       email,
//       password,
//     };

//     try {
//       const response = await fetch("/api/v1/users/signup/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//         credentials: "include",
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.log(errorData);

//         if (errorData.username) {
//           toast.error(errorData.username[0], {
//             position: "top-center",
//             theme: "colored",
//           });
//         }
//         if (errorData.email) {
//           toast.error(errorData.email[0], {
//             position: "top-center",
//             theme: "colored",
//           });
//         }
//         if (errorData.password) {
//           toast.error(errorData.password[0], {
//             position: "top-center",
//             theme: "colored",
//           });
//         }
//       } else {
//         toast.success("Signup successful! Redirecting to Explore...", {
//           position: "top-center",
//           theme: "colored",
//         });

//         // Wait for a moment before redirecting to let the user see the success message
//         setTimeout(() => {
//           navigate("/explore"); // Redirect to the explore page after successful signup
//         }, 2000); // Adjust the delay as needed
//       }
//     } catch (error) {
//       console.error("Error during signup:", error);
//       toast.error("Signup failed. Please try again.", {
//         position: "top-center",
//         theme: "colored",
//       });
//     }
//   };

//   return (
//     <AppLayout>
//       <div className="flex w-full h-[100dvh] justify-center items-center overflow-hidden">
//         <div className="border-opacity-10 fixed top-0 left-0 h-[100dvh] w-screen">
//           <Image
//             src={lines}
//             isBlurred
//             className="h-[100dvh] w-screen object-cover"
//           />
//         </div>

//         <div className="fixed top-0 left-0 p-2">
//           <Brand />
//         </div>

//         <Card isBlurred className="bg-transparent h-fit px-5 py-2" radius="sm">
//           <CardHeader>
//             <div>
//               <span>Welcome</span>
//               <h1 className="font-semibold text-xl tracking-wider">
//                 To BOLETO
//               </h1>
//             </div>
//           </CardHeader>

//           <CardBody>
//             <form
//               className="flex flex-col w-full gap-4"
//               onSubmit={handleSubmit}
//             >
//               <div className="flex flex-col items-center justify-center gap-2 w-full">
//                 <Input
//                   label="Username"
//                   type="text"
//                   variant="underlined"
//                   size="sm"
//                   placeholder="Enter your username"
//                   labelPlacement="outside"
//                   className="text-xs"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                 />
//                 <Input
//                   label="Email"
//                   type="email"
//                   variant="underlined"
//                   size="sm"
//                   placeholder="Enter your email"
//                   labelPlacement="outside"
//                   className="text-xs"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <Input
//                   label="Password"
//                   type="password"
//                   variant="underlined"
//                   size="sm"
//                   placeholder="Enter password"
//                   labelPlacement="outside"
//                   className="text-xs"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <Input
//                   label="Confirm Password"
//                   type="password"
//                   variant="underlined"
//                   size="sm"
//                   placeholder="Confirm password"
//                   labelPlacement="outside"
//                   className="text-xs"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//               </div>
//               <div className="w-full flex justify-center items-center">
//                 <Button
//                   type="submit"
//                   color="primary"
//                   variant="shadow"
//                   className="text-primary-900"
//                 >
//                   Sign Up
//                 </Button>
//               </div>
//             </form>
//           </CardBody>
//           <CardFooter>
//             <p className="text-sm font-sans">
//               Already have an account?{" "}
//               <Link
//                 to={"/sign_in"}
//                 className="text-sm text-primary-400 hover:underline transition-all"
//               >
//                 Sign In
//               </Link>
//             </p>
//           </CardFooter>
//         </Card>
//       </div>
//     </AppLayout>
//   );
// };

// export default SignUp;
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
// import lines from "../assets/lines.svg";
import Brand from "../components/brand";
import AppLayout from "../components/AppLayout";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Link } from "react-router-dom";
import { Image } from "@nextui-org/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import useDispatch from react-redux and the setAuthenticated action
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../redux/authSlice.js"; // Adjust the path as necessary

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch(); // Initialize useDispatch

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    const data = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch("/api/v1/users/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);

        if (errorData.username) {
          toast.error(errorData.username[0], {
            position: "top-center",
            theme: "colored",
          });
        }
        if (errorData.email) {
          toast.error(errorData.email[0], {
            position: "top-center",
            theme: "colored",
          });
        }
        if (errorData.password) {
          toast.error(errorData.password[0], {
            position: "top-center",
            theme: "colored",
          });
        }
      } else {
        const result = await response.json();

        // Dispatch the setAuthenticated action with the user data
        dispatch(setAuthenticated(result));

        toast.success("Signup successful! Redirecting to Explore...", {
          position: "top-center",
          theme: "colored",
        });

        // Wait for a moment before redirecting to let the user see the success message
        setTimeout(() => {
          navigate("/explore"); // Redirect to the explore page after successful signup
        }, 2000); // Adjust the delay as needed
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Signup failed. Please try again.", {
        position: "top-center",
        theme: "colored",
      });
    }
  };

  return (
    <AppLayout>
      <div className="flex w-full h-[100dvh] justify-center items-center overflow-hidden">
        <div className="border-opacity-10 fixed top-0 left-0 h-[100dvh] w-screen">
          {/* <Image
            src={lines}
            isBlurred
            className="h-[100dvh] w-screen object-cover"
          /> */}
        </div>

        <div className="fixed top-0 left-0 p-2">
          <Brand />
        </div>

        <Card isBlurred className="bg-transparent h-fit px-5 py-2" radius="sm">
          <CardHeader>
            <div>
              <span>Welcome</span>
              <h1 className="font-semibold text-xl tracking-wider">
              FilmFlare
              </h1>
            </div>
          </CardHeader>

          <CardBody>
            <form
              className="flex flex-col w-full gap-4"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col items-center justify-center gap-2 w-full">
                <Input
                  label="Username"
                  type="text"
                  variant="underlined"
                  size="sm"
                  placeholder="Enter your username"
                  labelPlacement="outside"
                  className="text-xs"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  variant="underlined"
                  size="sm"
                  placeholder="Enter your email"
                  labelPlacement="outside"
                  className="text-xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Password"
                  type="password"
                  variant="underlined"
                  size="sm"
                  placeholder="Enter password"
                  labelPlacement="outside"
                  className="text-xs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  variant="underlined"
                  size="sm"
                  placeholder="Confirm password"
                  labelPlacement="outside"
                  className="text-xs"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="w-full flex justify-center items-center">
                <Button
                  type="submit"
                  color="primary"
                  variant="shadow"
                  className="text-primary-900"
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </CardBody>
          <CardFooter>
            <p className="text-sm font-sans">
              Already have an account?{" "}
              <Link
                to={"/sign_in"}
                className="text-sm text-primary-400 hover:underline transition-all"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <ToastContainer />
    </AppLayout>
  );
};

export default SignUp;
