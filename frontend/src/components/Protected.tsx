import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';
interface Props {
  userRole: string | null | undefined;
  priority: string;
}

const Protected: React.FC<Props> = ({ userRole, priority }) => {
  if (
    (userRole === undefined && priority === '') ||
    (userRole === priority && priority === 'admin') ||
    (priority === 'user' && userRole === 'user') ||
    userRole === 'admin'
  ) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};
export default Protected;
