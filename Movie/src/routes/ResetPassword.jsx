// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Input } from '@nextui-org/input';
// import { Button } from '@nextui-org/button';
// import { Card, CardBody, CardHeader } from '@nextui-org/card';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import AppLayout from '../components/AppLayout'; // Adjust the import path if needed

// const ResetPassword = () => {
//   const { uid, token } = useParams();
//   const [newPassword, setNewPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('/api/v1/auth/reset-password/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ uid, token, new_password: newPassword }),
//       });
//       if (response.ok) {
//         toast.success('Password reset successful!', {
//           position: 'top-center',
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         });
//       } else {
//         toast.error('Failed to reset password.', {
//           position: 'top-center',
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         });
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('An error occurred. Please try again.', {
//         position: 'top-center',
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//   };

//   return (
//     <AppLayout>
//       <div className="flex justify-center items-center min-h-screen bg-black">
//         <Card className="max-w-md w-full bg-transparent">
//           <CardHeader className="text-center">
//             <h2 className="text-2xl font-bold text-white">Reset Password</h2>
//           </CardHeader>
//           <CardBody>
//             <form onSubmit={handleSubmit} className="flex flex-col gap-6">
//               <Input
//                 type="password"
//                 label="New Password"
//                 placeholder="Enter your new password"
//                 fullWidth
//                 required
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 classNames={{
//                   input: "bg-black text-white",
//                   label: "text-white"
//                 }}
//               />
//               <Button
//                 type="submit"
//                 color="primary"
//                 className="w-full bg-primary-500 text-white"
//               >
//                 Reset Password
//               </Button>
//             </form>
//           </CardBody>
//         </Card>
//       </div>
//     </AppLayout>
//   );
// };

// export default ResetPassword;



import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppLayout from '../components/AppLayout'; // Adjust the import path if needed

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      const response = await fetch('/api/v1/auth/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, token, new_password: newPassword }),
      });
      if (response.ok) {
        toast.success('Password reset successful!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate('/sign_in'); // Redirect to login page
      } else {
        toast.error('Failed to reset password.', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.', {
        position: 'top-center',
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
            <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Input
                type="password"
                label="New Password"
                placeholder="Enter your new password"
                fullWidth
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                classNames={{
                  input: "bg-black text-white",
                  label: "text-white"
                }}
              />
              <Input
                type="password"
                label="Confirm New Password"
                placeholder="Confirm your new password"
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                classNames={{
                  input: "bg-black text-white",
                  label: "text-white"
                }}
              />
              <Button
                type="submit"
                color="primary"
                className="w-full bg-primary-500 text-white"
              >
                Reset Password
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ResetPassword;
