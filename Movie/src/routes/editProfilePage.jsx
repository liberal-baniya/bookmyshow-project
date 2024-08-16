
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { CiEdit } from "react-icons/ci";
import { TbCameraPin } from "react-icons/tb";
import Text from "../components/text.tsx";
import { Link } from "react-router-dom";

const EditProfilepage = () => {
   const [email, setEmail] = useState("");
   const [fullName, setFullName] = useState("");
   const [username, setUsername] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [message, setMessage] = useState("");

   // Fetch user data on component mount
   useEffect(() => {
      const fetchUserData = async () => {
         try {
            const response = await fetch('/api/v1/users/userDetails/', {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
               },
               credentials: "include",
            });

            if (response.ok) {
               const data = await response.json();
               setEmail(data.email);
               setFullName(data.name);
               setUsername(data.username);
            } else {
               console.error('Failed to fetch user data');
            }
         } catch (error) {
            console.error('Error fetching user data:', error);
         }
      };

      fetchUserData();
   }, []);

   // Handle update profile
   const handleUpdateProfile = async () => {
      setIsLoading(true);
      setMessage("");

      const requestData = {
         ...(email && { email }),
         ...(fullName && { name: fullName })
      };

      try {
         const response = await fetch('/api/v1/users/updateUser/', {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
            credentials: "include",
         });

         if (response.ok) {
            const data = await response.json();
            setEmail(data.email);
            setFullName(data.name);
            setMessage("Profile updated successfully!");
         } else {
            setMessage("Failed to update profile.");
         }
      } catch (error) {
         console.error('Error updating profile:', error);
         setMessage("An error occurred. Please try again.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="w-full sm:container p-1 h-full items-center flex flex-col">
         <Card className="bg-background relative w-full sm:w-[70%] md:w-1/2 px-4 border-1 border-foreground-700">
            <div className="absolute bg-gradient-to-r from-secondary-600/20 to-primary-50/0 top-0 left-0 w-full h-16"></div>
            <CardHeader className="gap-3">
               <TbCameraPin
                  fill="black"
                  className="bg-foreground-200 rounded-full p-2 w-20 h-20"
               />
               {username}
            </CardHeader>
            <CardBody>
               <ul className="space-y-7">
                  <li className="text-xs">
                     <h3 className="font-semibold py-4 text-sm sm:text-lg">Account Details</h3>
                     <div className="w-full grid grid-cols-[0.5fr_1fr_auto]">
                        <Text text={"Email Address"} variant="primary" />
                        <Input
                           size="sm"
                           variant="flat"
                           color="default"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                        />
                        <Link to={"/my_profile/verify/email"}>
                           <button>
                              <CiEdit />
                           </button>
                        </Link>
                     </div>
                  </li>
                  <li className="text-xs space-y-1">
                     <h3 className="font-semibold text-sm sm:text-lg">Personal Details</h3>
                     <div
                        className="w-full grid grid-cols-[0.5fr_1fr] items-center"
                     >
                        <Text text={"Full Name"} variant="primary" />
                        <Input
                           size="sm"
                           variant="flat"
                           color="default"
                           value={fullName}
                           onChange={(e) => setFullName(e.target.value)}
                        />
                     </div>
                  </li>
               </ul>
               <div className="flex justify-center mt-4">
                  <button
                     onClick={handleUpdateProfile}
                     disabled={isLoading}
                     className="px-4 py-2 bg-primary-600 text-white rounded-lg"
                  >
                     {isLoading ? "Updating..." : "Update Profile"}
                  </button>
               </div>
               {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
            </CardBody>
         </Card>
      </div>
   );
};

export default EditProfilepage;
