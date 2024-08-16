import { Button } from "@nextui-org/button";
import { ModalContent, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Modal, ModalHeader } from "@nextui-org/modal";
import { GoSignOut } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const AccountSettings = () => {
  const navigate = useNavigate();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/v1/users/deleteUser/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        // Handle successful deletion, such as navigating to a different page
        navigate("/sign_up"); // Replace with appropriate path
      } else {
        console.error("Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <button
        onClick={() => setDeleteModalOpen(true)}
        className="w-full max-w-xs flex items-center justify-center text-lg font-bold py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
      >
        Delete My Account <GoSignOut className="ml-2" />
      </button>

      <Modal isOpen={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent className="bg-background">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to delete your account?
              </ModalHeader>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  No, Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleDeleteAccount();
                    onClose();
                  }}
                >
                  Yes, Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AccountSettings;
