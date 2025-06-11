import clsx from "clsx";
import { Link, useNavigate } from "react-router";
import { FileText, FilePlus, CheckCircle2, Clock, AlertCircle, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state/empty-state";
import ApplicationsList from "./applications/ApplicationsList";
import PageHeader from "@/components/pageHeader";

import { useGetApplicationMetricsQuery } from "@/reduxStore/services/applications";
import { useAppSelector, usePermanentPaths } from "@/hooks";
import { capitalize, urlBuilder } from "@/utils";
import { useUserPermission } from "@/hooks/useUserPermissions";

interface IMetricsData {
  total: number;
  approved: number;
  "in-review": number;
  pending: number;
  submitted: number;
  rejected: number;
  draft: number;
}

interface IMetricCard {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  metric: ( metrics: IMetricsData | undefined ) => number;
  description: string;
}

const metricCards: IMetricCard[] = [
  {
    title: "Total Applications",
    icon: FileText,
    iconColor: "text-muted-foreground",
    metric: ( metrics ) => metrics?.total ?? 0,
    description: "Permits and Licenses"
  },
  {
    title: "Approved",
    icon: CheckCircle2,
    iconColor: "text-green-500",
    metric: ( metrics ) => metrics?.approved ?? 0,
    description: "Ready for use"
  },
  {
    title: "In Review",
    icon: Clock,
    iconColor: "text-yellow-500",
    metric: ( metrics ) => metrics?.["in-review"] ?? 0,
    description: "Awaiting decision"
  },
  {
    title: "Drafts",
    icon: AlertCircle,
    iconColor: "text-muted-foreground",
    metric: ( metrics ) => metrics?.draft ?? 0,
    description: "Draft"
  }
];

const LoadingSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[...Array( 4 )].map(( _, i ) => (
      <Card key={i}>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-12 mb-2" />
          <Skeleton className="h-3 w-3/4" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const Dashboard = () => {
  const { FirstName, RoleId, UserId } = useAppSelector(( state ) => state.account );
  const navigate = useNavigate();
  const { applications: { absolutePath } } = usePermanentPaths();
  const permissions = useUserPermission( "applications" );
  const canCreate = permissions.includes( "create" );
  const isNotUser = [ "inspector", "admin" ].includes( RoleId );
  const { data: metrics, isFetching, isLoading, isError, refetch } = useGetApplicationMetricsQuery({}, { skip: !UserId });

  if ( isError ) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <EmptyState
          title="No Data"
          description="No data available"
          variant="emptyData"
          buttonText="Try again"
          onAction={refetch}
          imageClassName="h-96 w-96"
        />
      </div>
    );
  }

  if ( isFetching || isLoading || !UserId ) {
    return (
      <div className="container py-10 px-0 mx-0">
        <PageHeader
          heading="Loading dashboard..."
          subHeading="Please wait while we fetch your data"
        />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="container py-10 px-0 mx-0">
      <PageHeader
        heading={`Welcome, ${FirstName ? capitalize( FirstName ) : "User"} !`}
        subHeading="Manage your firework permits and licenses in one place"
        cta={
          canCreate && <div className="flex gap-2">
            <Button asChild>
              <Link to={urlBuilder([ absolutePath, "create", "permit" ])}>
                <FilePlus className="mr-2 h-4 w-4" />
                New Application
              </Link>
            </Button>
          </div>
        }
      />
      <div className={clsx( "grid gap-4 md:grid-cols-2", isNotUser ? "lg:grid-cols-3" : "lg:grid-cols-4" )}>
        {metricCards.map(( card, index ) => {
          const Icon = card.icon;
          if ( isNotUser && card?.title === "Drafts" ) {
            return null;
          }
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className={`h-8 w-8 ${card.iconColor}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.metric( metrics )}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="all" className="space-y-4 mt-4">
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="permits">Permits</TabsTrigger>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 px-0">
          <h2 className="text-lg font-bold">Recent Applications</h2>
          <span className="text-muted-foreground">View and manage all your submitted applications</span>
          <ApplicationsList page="dashboard" type="all" />
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => navigate( urlBuilder( absolutePath ))}>View All Applications</Button>
          </div>
        </TabsContent>
        <TabsContent value="permits" className="space-y-4 px-0">
          <h2 className="text-lg font-bold">Permit Applications</h2>
          <span className="text-muted-foreground">Applications for public display of fireworks</span>
          <ApplicationsList page="dashboard" type="permit" />
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => navigate( urlBuilder( absolutePath, { type: "permit" }))}>View All Permits</Button>
          </div>
        </TabsContent>
        <TabsContent value="licenses" className="space-y-4 px-0">
          <h2 className="text-lg font-bold">License Applications</h2>
          <span className="text-muted-foreground">Applications for storage, sale, or importation of fireworks</span>
          <ApplicationsList page="dashboard" type="license" />
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => navigate( urlBuilder( absolutePath, { type: "license" }))}>View All Licenses</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
