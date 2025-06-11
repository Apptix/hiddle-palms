import { CircleCheckBig } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";

import { HAWAII_CONTACT_INFO, HAWAII_MAILING_ADDRESS, HAWAII_PAYMENT_INSTRUCTIONS } from "@/constants";
import { usePermanentPaths } from "@/hooks";
import { useGetApplicationByIdQuery } from "@/reduxStore/services/applications";
import { capitalize, urlBuilder } from "@/utils";

export const SuccessInfo = () => {
  const navigate = useNavigate();
  const { applications: { absolutePath }, root: { absolutePath: dashboardAbsPath } } = usePermanentPaths();
  const { applicationId } = useParams();
  const {
    data: appDetails = {},
    isLoading,
    isFetching
  } = useGetApplicationByIdQuery({ applicationId }, { skip: !applicationId });

  const isPermitPending = appDetails?.ApplicationType === "permit" && appDetails?.ApplicationStatus === "pending";
  const isCountyHonolulu = appDetails.County === "honolulu";

  if ( isLoading || isFetching ) {
    return <Loader />;
  }

  if ( appDetails?.ApplicationStatus === "submitted" || isPermitPending ) {
    return <div className="container max-w-5xl py-10 px-0 mx-0">
      <Card className="bg-green-100 p-6 flex gap-4 place-items-center">
        <CircleCheckBig className="h-12 w-12" /><h6 className="text-2xl font-bold tracking-tight">Application Submitted Successfully</h6>
      </Card>
      <Card className="p-6 text-xl mt-6">
        <div className="text-lg font-medium mb-4">
          Payment – Mail-In Check Instructions:-
        </div>

        <ul className="flex flex-col gap-4 pl-6 list-outside">
          <li className="p-1">
            <b className="text-lg">Prepare Your Check</b>
            <p className="text-sm">Payable To: <span>{HAWAII_PAYMENT_INSTRUCTIONS.payableTo}&nbsp;{capitalize( appDetails.County )}</span></p>
            {appDetails?.ApplicationType === "license" && (
              <p className="text-sm">Amount: $
                <span>
                  {HAWAII_PAYMENT_INSTRUCTIONS?.amount.license?.[appDetails?.ApplicationDetails?.LicenseType]}
                </span>
              </p>
            )}
            {appDetails?.ApplicationType === "permit" && (
              <>
                <p className="text-sm">Permit Fee: $
                  <span>
                    {HAWAII_PAYMENT_INSTRUCTIONS?.amount.permit?.permitFee}
                  </span>
                </p>
                <p className="text-sm">Inspection Fee: $
                  <span>
                    {HAWAII_PAYMENT_INSTRUCTIONS?.amount.permit?.inspectionFee}
                  </span>
                </p>
              </>
            )}
          </li>
          <li className="p-1">
            <b className="text-lg">Mail Your Check To</b>
            <p className="text-sm">{HAWAII_MAILING_ADDRESS[appDetails?.County].line1}</p>
            <p className="text-sm">{HAWAII_MAILING_ADDRESS[appDetails?.County].line2}</p>
            <p className="text-sm">{HAWAII_MAILING_ADDRESS[appDetails?.County].line3}</p>
          </li>
          <li>
            <b className="text-lg">Point of Contact (Email and Phone) for any Questions:<br/></b>
            {isCountyHonolulu ? <>
              <p className="text-sm">
                Ted Muraoka<br/>
                Honolulu Fire Department<br/>
                Fire Prevention Bureau - Administration<br/>
                Fireworks Inspector<br/>
                Office 808-723-7174<br/>
                Cell 808-312-8002<br/>
                Email : tmuraoka@honolulu.gov
              </p>
              <p className="text-sm mt-4">
                You will be notified via email if additional information or documentation is required,
                or once a decision has been made regarding your application.
              </p>
              <p className="text-sm mt-4">
                If you have questions about the status of your application, please contact :-<br/>
                County Inspector : Ted Muraoka<br/>
                Email : tmuraoka@honolulu.gov<br/>
                Office : 808-723-7174<br/>
                Cell : 808-312-8002<br/>
              </p>
              <p className="text-sm mt-4">
                Mahalo,<br/>
                Department of Law Enforcement<br/>
                Permit and License Management System (PALMS)<br/>
              </p>
            </>
              :
              <p className="text-sm">{HAWAII_CONTACT_INFO.email}</p>
            }
          </li>
        </ul>

        <div className="flex place-items-center gap-4 p-8 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate( urlBuilder([absolutePath]))}
          >View All Applications</Button>
          <Button
            variant="outline"
            onClick={() => navigate( urlBuilder([dashboardAbsPath]))}
          >Return to Dashboard</Button>
        </div>
      </Card>
    </div>;
  }

  return <Navigate to={absolutePath} />;
};
