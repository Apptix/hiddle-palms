import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import DataTable from "@/components/custom/data-table";
import EditModal from "./components/EditModal";
import DeleteModal from "./components/DeleteModal";
import { EmptyState } from "@/components/ui/empty-state/empty-state";
import PageHeader from "@/components/pageHeader";

import { useGetUsersQuery } from "@/reduxStore/services/user";
import { useUserPermission } from "@/hooks/useUserPermissions";
import {
  type IUser,
  userFilters,
  getUserColumns
} from "./utils/tableConfiguration";
import { usePermanentPaths } from "@/hooks";
import { convertObjectToCustomFormat, urlBuilder } from "@/utils";
import UserDetails from "./UserDetails";

const UsersList = () => {
  const navigate = useNavigate();
  const { root: { absolutePath } } = usePermanentPaths();
  const permissions = useUserPermission( "users" );
  const hasAccess = permissions.includes( "*" );
  const [ isViewOpen, setIsViewOpen ] = useState( false );
  // Add pagination state
  const [ currentPage, setCurrentPage ] = useState( 1 );
  const [ pageSize, setPageSize ] = useState( 50 );
  const [ activeFilters, setActiveFilters ] = useState<Record<string, string>>({});

  const {
    data: { users = [], total_count = 0 } = {},
    isFetching,
    isLoading,
    refetch,
    isError
  } = useGetUsersQuery(
    {
      requestParams: {
        limit: pageSize.toString(),
        offset: (( currentPage - 1 ) * pageSize + 1 ).toString(),
        ...( convertObjectToCustomFormat( activeFilters ) && { filterExpression: convertObjectToCustomFormat( activeFilters ) })
      }
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if ( Object.keys( activeFilters )?.length ) {
      setCurrentPage( 1 );
      refetch();
    }
  }, [ activeFilters, refetch ]);

  const [ selectedUser, setSelectedUser ] = useState<IUser | null>( null );
  const [ isEditOpen, setIsEditOpen ] = useState( false );
  const [ isDeleteOpen, setIsDeleteOpen ] = useState( false );

  const handleEdit = ( user: IUser ) => {
    setSelectedUser( user );
    setIsEditOpen( true );
  };

  const handleEditClose = ( refresh?: boolean ) => {
    setIsEditOpen( false );
    setSelectedUser( null );
    if ( refresh ) {
      refetch();
    }
  };

  const handleDelete = ( user: IUser ) => {
    setSelectedUser( user );
    setIsDeleteOpen( true );
  };

  const handleDeleteClose = ( refresh?: boolean ) => {
    setIsDeleteOpen( false );
    setSelectedUser( null );
    if ( refresh ) {
      refetch();
    }
  };

  const columns = getUserColumns({
    handleDelete,
    handleEdit,
    permissions
  });

  // Handle page change
  const handlePageChange = ( pageNumber: number ) => {
    setCurrentPage( pageNumber );
  };

  // Add handler for page size change
  const handlePageSizeChange = ( size: number ) => {
    setPageSize( size );
    // Reset to first page when changing page size
    setCurrentPage( 1 );
  };

  const handleViewDetails = ( user: IUser ) => {
    setSelectedUser( user );
    setIsViewOpen( true );
  };

  if ( !hasAccess ) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <EmptyState
          title="No Access"
          description="You don't have access to view users"
          variant="noAccess"
          buttonText="Back to Dashboard"
          onAction={() => navigate( urlBuilder( absolutePath ))}
        />
      </div>
    );
  }

  if ( isError ) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <EmptyState
          title="No Users"
          description="No user found"
          variant="emptyData"
          buttonText="Try again"
          onAction={refetch}
          imageClassName="h-96 w-96"
        />
      </div>
    );
  }

  return (
    <div className="container py-10 mx-0 px-0">
      <PageHeader
        heading="Users"
        subHeading="Manage all the users"
      />
      <DataTable
        onRowClick={handleViewDetails}
        refetch={refetch}
        data={users}
        columns={columns}
        filters={userFilters}
        showFilters={true}
        loading={isFetching || isLoading}
        pageSize={pageSize}
        totalCount={total_count}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
        setFilters={setActiveFilters}
        emptyMessage={
          <p className="mb-6">No users found.</p>
        }
      />
      <UserDetails
        user={selectedUser}
        isOpen={isViewOpen}
        onClose={( refresh: boolean = false ) => {
          if ( refresh ) {
            refetch();
          }
          setIsViewOpen( false );
        }}
      />

      <EditModal
        user={selectedUser}
        isOpen={isEditOpen}
        onClose={handleEditClose}
      />

      <DeleteModal
        user={selectedUser}
        isOpen={isDeleteOpen}
        onClose={handleDeleteClose}
      />
    </div>
  );
};

export default UsersList;