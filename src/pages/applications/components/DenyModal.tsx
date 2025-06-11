import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { IApplication } from "../utils/tableConfiguration";
import { useManageApplicationMutation } from "@/reduxStore/services/applications";
import { useAstralAlert } from "@/hooks/useAstralAlert";

interface IDenyModalProps {
  application: IApplication | null;
  isOpen: boolean;
  onClose: ( refresh?: boolean ) => void;
}

const DenyModal: React.FC<IDenyModalProps> = ({
  application,
  isOpen,
  onClose
}) => {
  const [ rejectionReason, setRejectionReason ] = useState( "" );
  const [ manageApplication, { isLoading }] = useManageApplicationMutation();
  const astralAlert = useAstralAlert();

  const handleDeny = async () => {
    if ( !application || !rejectionReason.trim()) {
      return;
    }

    try {
      const { Message } = await manageApplication({
        applicationId: application.ApplicationId,
        body: {
          Action: "reject",
          Remarks: rejectionReason
        }
      }).unwrap();
      astralAlert.error({
        title: Message
      });
    } finally {
      onClose( true );
      setRejectionReason( "" );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deny Application</DialogTitle>
          <DialogDescription>
            Please provide a reason for denying this application. This reason will be shown to the applicant.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="rejection-reason">Rejection Reason</Label>
          <Input
            id="rejection-reason"
            value={rejectionReason}
            onChange={( e ) => setRejectionReason( e.target.value )}
            placeholder="Enter reason for rejection..."
            className="mt-2"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onClose( false )} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeny}
            disabled={isLoading || !rejectionReason.trim()}
          >
            {isLoading ? "Denying..." : "Deny Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DenyModal;