import { Route, Routes } from "react-router";

// libraries
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const ProfileAndSettings = () => {

  return <Routes>
    <Route index element={<Profile />} />
    <Route path="*" element={<NotFound />} />
  </Routes>;
};

export default ProfileAndSettings;