import React from 'react'
import { Navigate, Route } from "react-router-dom";

export type ProtectedRouteProps = {
    isAuth: boolean;
    authPath: string;
    outlet: JSX.Element;
}

function ProtectedRoute({ isAuth, authPath, outlet}: ProtectedRouteProps)
{
  if (isAuth)
  {
      return outlet;
  }
  else
  {
    return <Navigate to={{pathname: authPath }} />
  }
}

export default ProtectedRoute;