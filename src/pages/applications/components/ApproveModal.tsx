import React from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import SignaturePad from "@/components/ui/signature-pad";

import { IApplication } from "../utils/tableConfiguration";
import { useAppSelector } from "@/hooks";
import { useManageApplicationMutation } from "@/reduxStore/services/applications";
import { useUpdateUserMutation } from "@/reduxStore/services/user";
import UploadDocument from "@/pages/documents/UploadDocument";
import { useAstralAlert } from "@/hooks/useAstralAlert";
import { formatDateTime } from "@/utils";

interface IApproveModalProps {
  application: IApplication | null;
  isOpen: boolean;
  onClose: ( refresh?: boolean ) => void;
}

const ApproveModal: React.FC<IApproveModalProps> = ({ application, isOpen, onClose }) => {

  const [ manageApplication, { isLoading }] = useManageApplicationMutation();
  const [ updateUser, { isLoading: isUserUpdating }] = useUpdateUserMutation();
  const { username, UserSignature } = useAppSelector(({ auth, account }) => ({
    username: auth?.username,
    UserSignature: account.UserSignature
  }));
  const astralAlert = useAstralAlert();

  const form = useForm({
    defaultValues: {
      StartDate: new Date(),
      ExpirationDate: new Date( new Date().setDate( new Date().getDate() + 30 )),
      UserSignature: UserSignature,
      PaymentCheck: undefined
    }
  });

  const handleClose = ( refresh = false ) => {
    form.reset();
    onClose( refresh );
  };

  const handleApprove = async ( data: any ) => {
    if ( !application ) {
      return;
    }

    await updateUser({
      requestBody: {
        UserSignature: data.UserSignature
      },
      userId: username
    }).unwrap();

    try {
      const { date: expDate, time: expTime } = formatDateTime( data.ExpirationDate );
      const { date: startDate, time: startTime } = formatDateTime( data.StartDate );
      const { Message } = await manageApplication({
        applicationId: application.ApplicationId,
        body: {
          ...data,
          StartDate: [ startDate, startTime ].join( " " ),
          ExpirationDate: [ expDate, expTime ].join( " " ),
          Action: "approve"
        }
      }).unwrap();
      astralAlert.success({
        title: Message
      });
    } finally {
      handleClose( true );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Application</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this application? This will notify the applicant.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit( handleApprove )}>
            <div className="py-4">
              <FormField
                control={form.control}
                name="UserSignature"
                rules={{ required: "Inspector signature is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inspector Signature</FormLabel>
                    <SignaturePad
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="py-4">
              <FormField
                control={form.control}
                name="StartDate"
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={{ before: new Date() }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ExpirationDate"
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={{ before: new Date() }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="py-4">
              <FormItem>
                <FormLabel>Payment Check</FormLabel>
                <UploadDocument
                  formUtils={form}
                  applicationId={application?.ApplicationId}
                  documents={[{
                    name: "Payment Check",
                    type: "PaymentCheck",
                    description: "Payment check for the application"
                  }]}
                />
                <FormMessage />
              </FormItem>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isUserUpdating }
              >
                {isLoading || isUserUpdating ? "Approving..." : "Approve"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveModal;
