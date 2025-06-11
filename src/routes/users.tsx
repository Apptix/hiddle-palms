import { Route, Routes } from "react-router";

import UsersList from "@/pages/users/UsersList";
import NotFound from "@/pages/NotFound";

const Users = () => {
  return ( <Routes>
    <Route index element={<UsersList />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
  );
};

export default Users;