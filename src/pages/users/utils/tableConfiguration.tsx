import { Pencil, ShieldX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IColumn } from "@/components/custom/data-table";

export interface IUser {
  UserId: string;
  EmailId: string;
  FirstName: string;
  LastName: string;
  CurrentRole: string;
  LastModifiedTime: string;
  UserStatus: string;
}

interface ITableConfigProps {
  handleDelete: ( user: IUser ) => void;
  handleEdit: ( user: IUser ) => void;
  permissions: string[];
}

const getRoleBadge = ( role: string ) => {
  switch ( role?.toLowerCase()) {
    case "admin":
      return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
    case "inspector":
      return <Badge className="bg-blue-100 text-blue-800">Inspector</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">User</Badge>;
  }
};

const getStatusBadge = ( status: string ) => {
  switch ( status?.toLowerCase()) {
    case "inactive":
      return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
    case "active":
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">-</Badge>;
  }
};

export const getUserColumns = ({ handleDelete, handleEdit }: ITableConfigProps ): IColumn<IUser>[] => {

  return [
    {
      key: "Name",
      header: "Name",
      render: ( _, row: IUser ) => `${row.FirstName} ${row.LastName}`
    },
    {
      key: "EmailId",
      header: "Email"
    },
    {
      key: "UserStatus",
      header: "User Status",
      render: ( val: string ) => getStatusBadge( val )
    },
    {
      key: "CurrentRole",
      header: "Role",
      render: ( val: string ) => getRoleBadge( val )
    },
    {
      key: "actions",
      header: "Actions",
      render: ( _, row: IUser ) => {
        return row.UserStatus === "Active" && (
          <div className="flex justify-start space-x-2" onClick={( e ) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit( row )}
            >
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete( row )}
            >
              <ShieldX className="mr-1 h-4 w-4" />
              Deactivate
            </Button>
          </div>
        );
      }
    }
  ];
};

export const userFilters = [
  {
    key: "CurrentRole",
    label: "Role",
    options: [
      { value: "admin", label: "Admin" },
      { value: "user", label: "User" },
      { value: "inspector", label: "Inspector" }
    ]
  }
];

export const sortColumnMapping = {
  Name: "FirstName",
  Email: "EmailId",
  Role: "CurrentRole",
  LastLogin: "LastLogin",
  CreatedAt: "CreatedAt"
};
