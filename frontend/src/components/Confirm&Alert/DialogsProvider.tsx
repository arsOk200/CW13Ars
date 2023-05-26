import React from 'react';
import ConfirmProvider from './ConfirmProvider';
import AlertProvider from './AlertProvider';

const DialogsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ConfirmProvider>
      <AlertProvider>{children}</AlertProvider>
    </ConfirmProvider>
  );
};

export default DialogsProvider;
