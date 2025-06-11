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

import { IApplication } from "../utils/tableConfiguration";
import { useDeleteApplicationMutation } from "@/reduxStore/services/applications";
import { useAstralAlert } from "@/hooks/useAstralAlert";

interface IDeleteModalProps {
  application: IApplication | null;
  isOpen: boolean;
  onClose: ( refresh?: boolean ) => void;
}

const DeleteModal: React.FC<IDeleteModalProps> = ({
  application,
  isOpen,
  onClose
}) => {
  const [ deleteApplication, { isLoading }] = useDeleteApplicationMutation();
  const astralAlert = useAstralAlert();

  const handleDelete = async () => {
    if ( !application ) {
      return;
    }

    try {
      const { Message } = await deleteApplication({ applicationId: application.ApplicationId }).unwrap();
      astralAlert.error({
        title: Message
      });
    } finally {
      onClose( true );
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Application</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this application? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;