import { Suspense } from "react";
import { Route, Routes } from "react-router";

import ForgotPassword from "@/pages/auth/ForgotPassword";
import LandingPage from "@/pages/landing/LandingPage";
import { Loader } from "@/components/ui/loader";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ResetPassword from "@/pages/auth/ResetPassword";
import { TPermanentPathObject } from "@/types";
import VerifyAccount from "@/pages/auth/VerifyAccount";

interface IAuthDynamicImports {
  permanentPaths: TPermanentPathObject;
}

const AuthRoutes = ({ permanentPaths }: IAuthDynamicImports ): JSX.Element =>
  <Suspense fallback={<Loader/>}>
    <Routes>
      <Route index element={<LandingPage />}/>
      <Route path={permanentPaths?.login?.path} element={<Login />}/>
      <Route path={permanentPaths?.register?.path} element={<Register />}/>
      <Route path={permanentPaths?.verify?.path} element={<VerifyAccount />}/>
      <Route path={permanentPaths?.forgotPassword?.path} element={<ForgotPassword />}/>
      <Route path={permanentPaths?.resetPassword?.path} element={<ResetPassword />}/>
      <Route path="*" element={<LandingPage />}/>
    </Routes>
  </Suspense>;

export default AuthRoutes;