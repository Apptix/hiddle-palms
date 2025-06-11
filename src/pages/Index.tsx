import { Navigate } from "react-router";

const Index = () => {
  // Simply redirect to the root route where our landing page is
  return <Navigate to="/" replace />;
};

export default Index;
