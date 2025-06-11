import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

import { IUser } from "../utils/tableConfiguration";
import { useDeleteUserMutation } from "@/reduxStore/services/user";
import { useAstralAlert } from "@/hooks/useAstralAlert";

interface IDeleteModalProps {
  user: IUser | null;
  isOpen: boolean;
  onClose: ( refresh?: boolean ) => void;
}

const DeleteModal: React.FC<IDeleteModalProps> = ({
  user,
  isOpen,
  onClose
}) => {
  const [ deleteUser, { isLoading }] = useDeleteUserMutation();
  const astralAlert = useAstralAlert();

  const handleDelete = async ( e: React.MouseEvent ) => {
    e.preventDefault(); // Prevent default form submission
    if ( !user ) {
      return;
    }

    try {
      const { Message } = await deleteUser({ userId: user.UserId }).unwrap();
      astralAlert.success({
        title: Message
      });
      onClose( true );
    } catch {
      console.error( "Failed to delete user" );
    }
  };

  const handleOpenChange = () => {
    // Only allow closing if we're not in the middle of deleting
    if ( !isLoading ) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to deactivate this user? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deactivating..." : "Deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;