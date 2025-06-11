import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { Suspense, useCallback, useEffect } from "react";
// Routes
import Applications from "@/routes/applications";
import AuthRoutes from "@/routes/auth";
import ProfileAndSetting from "@/routes/profileAndSettings";
import Users from "@/routes/users";
import Documents from "@/routes/documents";
// Pages
import Callback from "@/pages/auth/Callback";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
// Components
import Layout from "@/components/layout/Layout";
import { Loader } from "@/components/ui/loader";
// Constants
import { configureDayJSLocale } from "@/utils";
import { loadUserAccount } from "@/reduxStore/modules/account/actions";
import { roles } from "@/constants";
import { useAppDispatch, useAppSelector, usePermanentPaths } from "../../hooks";
import { useCreateUserMutation } from "@/reduxStore/services/user";

const AppRoutes = () => {
  const { i18n: reactI18n } = useTranslation();
  const permanentPaths = usePermanentPaths();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [createUser] = useCreateUserMutation();

  const {
    sessionActive = false,
    validSession = false,
    username,
    UserId = "",
    RoleId = "",
    county,
    fetchingUserError,
    fetchingRole
  } = useAppSelector(( state ) => {
    return {
      globalConfig: state.globalConfig,
      sessionActive: state.auth?.sessionActive,
      validSession: state.auth?.validSession,
      mfaEnabled: state.auth?.mfaEnabled,
      UserId: state.account?.UserId,
      RoleId: state.account?.RoleId,
      username: state.auth?.username,
      county: state.account?.County,
      fetchingUserError: state.account.fetchingUserError,
      fetchingRole: state.account.fetchingRole
    };
  });

  // Create user account if it doesn't exist -
  const fetchUser = useCallback(() => {
    if ( username && !RoleId ) {
      dispatch( loadUserAccount( username, true, true, 1 ));
    }
  }, [ username, RoleId, dispatch ]);

  const createNewUser = useCallback( async () => {
    const { Message } = await createUser({}).unwrap();
    if ( Message ) {
      fetchUser();
    }
  }, [ createUser, fetchUser ]);

  useEffect(() => {
    configureDayJSLocale( reactI18n.language );
  }, [reactI18n.language]);

  useEffect(() => {
    fetchUser();
  }, [ location.pathname, fetchUser ]);

  useEffect(() => {
    if ( !fetchingRole && !UserId && fetchingUserError === "notFound" ) {
      createNewUser();
    }
  }, [ createNewUser, fetchingRole, UserId, fetchingUserError ]);

  if ( !sessionActive ) {
    /**
     * This is the initial state of the app when the user is not logged in.
     * This is the only state where the user can access the un-authenticated routes.
     * TODO: add component that fetches customConfig.json here
     */
    return (
      <Suspense fallback={<Loader/>}>
        {/* <DisasterRecoveryBanner /> */}
        <Routes>
          <Route index element={<AuthRoutes permanentPaths={permanentPaths} />} />
          <Route path={permanentPaths.callback?.path} element={<Callback />} />
          <Route
            path={`${permanentPaths?.auth?.path ?? "/auth"}/*`}
            element={<AuthRoutes permanentPaths={permanentPaths} />}
          />
          {/* {commonRoutes()} */}
          <Route path="*" element={<AuthRoutes permanentPaths={permanentPaths} />} />
        </Routes>
      </Suspense>
    );
  }

  if ( sessionActive && !validSession && !UserId ) {
    /**
     * This is a special case where the user is logged in but the session is not valid.
     * This can happen in multiple scenarios:
     * when the user is logged in from multiple devices and the session is invalidated on one of the devices
     * or
     * when the user authentication token is expired along with refresh token
     * or
     * when a token from a different cognito is used to access the application.
     *
     * In all these cases, the user must be forced to login again without which the application state
     * cannot be guaranteed to be consistent.
     */
    return (
      <Suspense fallback={<Loader/>}>
        {/* <DisasterRecoveryBanner /> */}
        <Routes>
          {/* {commonRoutes()} */}
          <Route path="*" element={<Layout>Session expired ...</Layout>} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Layout>
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route
            index={RoleId === roles.inspector && !county ? true : false}
            element={
              <Navigate
                to={
                  // If no county set by inspector, navigate them to Profile to set it.
                  ( RoleId === roles.inspector && !county ) && permanentPaths?.profile?.path
                }
              />
            }
          />
          <Route path={"/"} element={<Dashboard />} />
          <Route path={"/dashboard"} element={<Dashboard />} />
          <Route path={`${permanentPaths?.applications?.path}/*`} element={<Applications />} />
          <Route path={`${permanentPaths?.users?.path}/*`} element={<Users />} />
          <Route path={`${permanentPaths?.profile?.path}/*`} element={<ProfileAndSetting />} />
          <Route path={`${permanentPaths?.documents?.path}/*`} element={<Documents />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default AppRoutes;
