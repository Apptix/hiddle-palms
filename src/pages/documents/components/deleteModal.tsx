// Libraries
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

import { useDeleteDocumentMutation } from "@/reduxStore/services/documents";
import { useAstralAlert } from "@/hooks/useAstralAlert";

interface IDeleteConfirmationProps {
  resourceId?: string;
  showDeleteModal: boolean;
  setShowDeleteModal: ( value: boolean ) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const DeleteConfirmation: React.FC<IDeleteConfirmationProps> = ({
  resourceId,
  showDeleteModal,
  setShowDeleteModal,
  onConfirm,
  onCancel
}) => {
  const [ deleteResourceAPI, { isLoading }] = useDeleteDocumentMutation();
  const astralAlert = useAstralAlert();

  if ( !resourceId ) {
    return null;
  }

  const handleDelete = async () => {
    try {
      const response = await deleteResourceAPI({ DocumentType: resourceId }).unwrap();
      if ( response.Message ) {
        astralAlert.success({
          title: response.Message
        });
        onConfirm?.();
      }
    } finally {
      setShowDeleteModal( false );
    }
  };

  const handleClose = ( value: boolean ) => {
    if ( !value ) {
      onCancel?.();
      setShowDeleteModal( false );
    }
  };

  return (
    <AlertDialog open={showDeleteModal} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Document</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this document? This action cannot be undone.
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

export default DeleteConfirmation;