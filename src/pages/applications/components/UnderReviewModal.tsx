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
import { useManageApplicationMutation } from "@/reduxStore/services/applications";
import { useAstralAlert } from "@/hooks/useAstralAlert";

interface IUnderReviewModalProps {
  application: IApplication | null;
  isOpen: boolean;
  onClose: ( refresh?: boolean ) => void;
}

const UnderReviewModal: React.FC<IUnderReviewModalProps> = ({
  application,
  isOpen,
  onClose
}) => {
  const [ manageApplication, { isLoading }] = useManageApplicationMutation();
  const astralAlert = useAstralAlert();

  const handleMarkAsReview = async () => {
    if ( !application ) {
      return;
    }

    try {
      const { Message } = await manageApplication({
        applicationId: application.ApplicationId,
        body: {
          Action: "in-review",
          Remarks: ""
        }
      }).unwrap();
      astralAlert.success({
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
          <AlertDialogTitle>Mark as Under Review</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark this application as under review?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleMarkAsReview} disabled={isLoading}>
            {isLoading ? "Updating..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnderReviewModal;