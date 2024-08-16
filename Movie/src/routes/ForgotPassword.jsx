import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLayout from "../components/AppLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/v1/auth/forgot-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        toast.success("Password reset email sent!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Failed to send password reset email.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <AppLayout>
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Card className="max-w-md w-full bg-transparent">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-bold text-white">Forgot Password</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                classNames={{
                  input: "bg-black text-white",
                  label: "text-white",
                }}
              />
              <Button
                type="submit"
                color="primary"
                className="w-full bg-primary-500 text-white"
              >
                Send Reset Link
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ForgotPassword;
