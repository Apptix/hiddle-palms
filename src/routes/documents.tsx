// libraries
import { Route, Routes } from "react-router";

// components
import Listing from "@/pages/documents/DocumentsList";
import { UploadUserDocument } from "@/pages/documents/UploadUserDocument";
import NotFound from "@/pages/NotFound";

const DocumentRoutes = () => {
  return ( <Routes>
    <Route index element={<Listing />} />
    <Route path="/upload-document" element={<UploadUserDocument />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
  );
};

export default DocumentRoutes;