import { Outlet, Navigate } from 'react-router-dom'


export function PrivateRoutes ({isAuth})  {
    return(
        isAuth ? <Outlet/> : <Navigate to="/login"/>
    );
}

  
export function PrivateCate({colId}) {
    return (
        colId ? <Outlet/> : <Navigate to="/"/>
    );
}


export function PrivateArte ({catId}) {
    return (
      catId ? <Outlet/> : <Navigate to="/categoria"/>
    );
  }