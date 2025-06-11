import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { IUser } from "../utils/tableConfiguration";
import { useUpdateUserRoleMutation } from "@/reduxStore/services/user";
import { useAstralAlert } from "@/hooks/useAstralAlert";

interface IEditModalProps {
  user: IUser | null;
  isOpen: boolean;
  onClose: ( refresh?: boolean ) => void;
}

const EditModal: React.FC<IEditModalProps> = ({
  user,
  isOpen,
  onClose
}) => {
  const astralAlert = useAstralAlert();
  const [ updateUser, { isLoading }] = useUpdateUserRoleMutation();
  const [ formData, setFormData ] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: ""
  });

  // Reset form data when modal opens with new user
  useEffect(() => {
    if ( user && isOpen ) {
      setFormData({
        firstName: user.FirstName || "",
        lastName: user.LastName || "",
        email: user.EmailId || "",
        role: user.CurrentRole || ""
      });
    }
  }, [ user, isOpen ]);

  // Clear form data when modal closes
  useEffect(() => {
    if ( !isOpen ) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: ""
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleChange = ( field: string, value: string ) => {
    setFormData( prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if ( !user ) {
      return;
    }

    try {
      const { Message } = await updateUser({
        Role: formData?.role,
        UserId: user?.UserId
      }).unwrap();
      astralAlert.success({
        title: Message
      });
      onClose( true );
    } catch {
      console.error( "Failed to update user" );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Modify user details and permissions
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-firstName" className="text-sm">
                First Name
              </label>
              <Input
                id="edit-firstName"
                value={formData.firstName}
                disabled
                onChange={( e ) => handleChange( "firstName", e.target.value )}
              />
            </div>
            <div>
              <label htmlFor="edit-lastName" className="text-sm">
                Last Name
              </label>
              <Input
                id="edit-lastName"
                value={formData.lastName}
                disabled
                onChange={( e ) => handleChange( "lastName", e.target.value )}
              />
            </div>
          </div>
          <div>
            <label htmlFor="edit-email" className="text-sm">
              Email
            </label>
            <Input
              id="edit-email"
              value={formData.email}
              disabled
              onChange={( e ) => handleChange( "email", e.target.value )}
            />
          </div>
          <div>
            <label htmlFor="edit-role" className="text-sm">
              Role
            </label>
            <Select
              value={formData.role}
              onValueChange={( value ) => handleChange( "role", value )}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="inspector">Inspector</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;