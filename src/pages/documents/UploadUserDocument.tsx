import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/pageHeader";
import UploadDocument from "./UploadDocument";

import { useAppSelector } from "@/hooks/storeHooks";
import { useGetUserDocumentsQuery } from "@/reduxStore/services/user";
import { MandatoryDocuments } from "@/constants";

export const UploadUserDocument = () => {
  const formUtils = useForm();
  const { username } = useAppSelector(( state ) => state.auth );
  const { data, isLoading, isFetching } = useGetUserDocumentsQuery({ userName: username });

  useEffect(() => {
    formUtils.reset({
      ...data
    });
  }, [ data, formUtils ]);

  return (
    <div className="py-10 container px-0 mx-0">
      <PageHeader heading="Upload Document" showBackButton={true} />
      {isLoading || isFetching ? (
        <div className="flex flex-col gap-4">
          {[...Array( 4 )].map(( _, i ) => (
            <Skeleton className="h-20 w-full" key={i} />
          ))}
        </div>
      ) : <UploadDocument documents={MandatoryDocuments} formUtils={formUtils}/>
      }
    </div>
  );
};
