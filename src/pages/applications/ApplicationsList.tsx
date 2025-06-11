import { FilePlus } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/custom/data-table";
import ApplicationDetails from "./ApplicationDetails";
import DenyModal from "./components/DenyModal";
import ApproveModal from "./components/ApproveModal";
import DeleteModal from "./components/DeleteModal";
import UnderReviewModal from "./components/UnderReviewModal";

import { useGetApplicationsQuery } from "@/reduxStore/services/applications";
import { useUserPermission } from "@/hooks/useUserPermissions";
import { type IApplication, applicationFilters, useApplicationColumns } from "./utils/tableConfiguration";
import { useAppSelector, usePermanentPaths } from "@/hooks";
import { EmptyState } from "@/components/ui/empty-state/empty-state";
import { convertObjectToCustomFormat, urlBuilder } from "@/utils";
import PageHeader from "@/components/pageHeader";

const ApplicationsList = ({
  page = "applications",
  type
}: {
  page?: "dashboard" | "applications";
  type?: "all" | "permit" | "license";
}) => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationType = searchParams.get( "type" ) || "";
  const {
    applications: { absolutePath }
  } = usePermanentPaths();
  const { RoleId, UserId } = useAppSelector(( state ) => state.account );
  const isDashboardPage = page === "dashboard";
  const permissions = useUserPermission( "applications" );
  // Add pagination state
  const [ currentPage, setCurrentPage ] = useState( 1 );
  const [ pageSize, setPageSize ] = useState( 50 );
  const [ activeFilters, setActiveFilters ] = useState<Record<string, string>>({});

  const {
    currentData: { applications: cache = [], total_count: cache_total_count = 0 } = {},
    data: { applications: resourcesList = [], total_count = 0 } = {},
    isFetching,
    isLoading,
    isError,
    refetch
  } = useGetApplicationsQuery(
    {
      requestParams: {
        ...(( type !== "all" || applicationType ) && { application_type: type ?? applicationType }),
        limit: isDashboardPage ? "10" : pageSize.toString(),
        offset: isDashboardPage ? "1" : (( currentPage - 1 ) * pageSize + 1 ).toString(),
        ...( convertObjectToCustomFormat( activeFilters ) && { filterExpression: convertObjectToCustomFormat( activeFilters ) })
      }
    },
    { refetchOnMountOrArgChange: true, skip: !UserId }
  );

  // Add useEffect to refetch when filters or search term change
  useEffect(() => {
    if ( Object.keys( activeFilters )?.length ) {
      setCurrentPage( 1 );
      refetch();
    }
  }, [ activeFilters, refetch ]);

  const [ selectedApp, setSelectedApp ] = useState<IApplication | null>( null );
  const [ isViewOpen, setIsViewOpen ] = useState( false );
  const [ isDeleteOpen, setIsDeleteOpen ] = useState( false );
  const [ isApproveOpen, setIsApproveOpen ] = useState( false );
  const [ isDenyOpen, setIsDenyOpen ] = useState( false );
  const [ isReviewOpen, setIsReviewOpen ] = useState( false );
  const [ refreshTrigger, setRefreshTrigger ] = useState( false );

  const canCreate = permissions.includes( "create" );
  const isRegularUser = RoleId === "user";
  const isAdminOrInspector = RoleId === "admin" || RoleId === "inspector";

  const handleViewDetails = ( app: IApplication ) => {
    setSelectedApp( app );
    setIsViewOpen( true );
  };

  const handleApprove = ( app: IApplication ) => {
    setSelectedApp( app );
    setIsApproveOpen( true );
  };

  const handleDeny = ( app: IApplication ) => {
    setSelectedApp( app );
    setIsDenyOpen( true );
  };

  const handleDelete = ( app: IApplication ) => {
    setSelectedApp( app );
    setIsDeleteOpen( true );
  };

  const columns = useApplicationColumns({
    handleDeny,
    handleApprove,
    handleDelete,
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

  if ( isError ) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <EmptyState
          title="No Applications"
          description="No applications found"
          variant="emptyData"
          buttonText="Try again"
          onAction={refetch}
          imageClassName="h-96 w-96"
        />
      </div>
    );
  }

  return (
    <div className={clsx( isDashboardPage ? "p-0" : "py-10 container", "px-0 mx-0" )}>
      {!isDashboardPage && (
        <PageHeader
          heading="Applications"
          subHeading="Manage and track your applications"
          cta={
            canCreate && (
              <div className="flex gap-2">
                <Button asChild>
                  <Link to={urlBuilder([ absolutePath, "create", "permit" ])}>
                    <FilePlus className="mr-2 h-4 w-4" />
                    New Application
                  </Link>
                </Button>
              </div>
            )
          }
        />
      )}
      <DataTable
        refetch={!isDashboardPage && refetch}
        showSearch={!isDashboardPage}
        showPagination={!isDashboardPage}
        data={cache ?? resourcesList}
        columns={columns}
        filters={( isAdminOrInspector && !isDashboardPage ) ? applicationFilters : []}
        showFilters={isAdminOrInspector}
        loading={isFetching || isLoading}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        totalCount={total_count || cache_total_count}
        onRowClick={handleViewDetails}
        onPageChange={handlePageChange}
        setFilters={setActiveFilters}
        emptyMessage={
          <>
            <p className="mb-6">
              There are no applications to display.
            </p>
            {isRegularUser && (
              <Button onClick={() => navigate( urlBuilder([ absolutePath, "create", "permit" ]))}>
                Submit New Application
              </Button>
            )}
          </>
        }
      />

      <ApplicationDetails
        handleDeny={handleDeny}
        handleApprove={handleApprove}
        application={selectedApp}
        isOpen={isViewOpen}
        refreshTrigger={refreshTrigger}
        onClose={( refresh: boolean = false ) => {
          if ( refresh ) {
            refetch();
          }
          setIsViewOpen( false );
        }}
        refetchAllApplications={refetch}
      />

      <DeleteModal
        application={selectedApp}
        isOpen={isDeleteOpen}
        onClose={( refresh: boolean = false ) => {
          setIsDeleteOpen( false );
          if ( refresh ) {
            refetch();
          }
        }}
      />

      <ApproveModal
        application={selectedApp}
        isOpen={isApproveOpen}
        onClose={( refresh: boolean = false ) => {
          setIsApproveOpen( false );
          if ( refresh ) {
            refetch();
            setRefreshTrigger(( prev ) => !prev ); // Toggle the refresh trigger
          }
        }}
      />

      <UnderReviewModal
        application={selectedApp}
        isOpen={isReviewOpen}
        onClose={( refresh: boolean = false ) => {
          setIsReviewOpen( false );
          if ( refresh ) {
            refetch();
          }
        }}
      />

      <DenyModal
        application={selectedApp}
        isOpen={isDenyOpen}
        onClose={( refresh: boolean = false ) => {
          setIsDenyOpen( false );
          if ( refresh ) {
            refetch();
            setRefreshTrigger(( prev ) => !prev );
          }
        }}
      />
    </div>
  );
};

export default ApplicationsList;
