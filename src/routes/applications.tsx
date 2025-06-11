// libraries
import { Route, Routes } from "react-router";

// components
import ApplicationsList from "@/pages/applications/ApplicationsList";
import NewApplication from "@/pages/applications/NewApplication";
import PDFGenerator from "@/components/pdfGenerator";
import { UploadApplicationDocuments } from "@/pages/applications/commonForms/UploadApplicationDocuments";
import EditApplication from "@/pages/applications/EditApplication";
import { SuccessInfo } from "@/pages/applications/commonForms/SuccessInfo";

import { routeActions } from "@/constants";
import NotFound from "@/pages/NotFound";

const Applications = () => {
  return ( <Routes>
    <Route index element={<ApplicationsList />} />
    <Route path={`/${routeActions.create}/:type`} element={<NewApplication />} />
    <Route path={`/:applicationId/${routeActions.edit}`} element={<EditApplication />} />
    <Route path={"/:applicationId/upload-documents"} element={<UploadApplicationDocuments />} />
    <Route path={"/:applicationId/success"} element={<SuccessInfo />} />
    <Route path="/:applicationId" element={<PDFGenerator />} />
    <Route path={"*"} element={<NotFound />} />

  </Routes>
  );
};

export default Applications;