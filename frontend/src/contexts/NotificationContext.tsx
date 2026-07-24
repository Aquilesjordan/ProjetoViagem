import { createContext, useMemo, useState } from 'react';

type NotificationType = 'success' | 'error' | 'info';

type NotificationContextType = {
  message: string;
  severity: NotificationType;
  open: boolean;
  showNotification: (message: string, severity?: NotificationType) => void;
  closeNotification: () => void;
};

export const NotificationContext = createContext<NotificationContextType>({
  message: '',
  severity: 'info',
  open: false,
  showNotification: () => {},
  closeNotification: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<NotificationType>('info');
  const [open, setOpen] = useState(false);

  const showNotification = (newMessage: string, newSeverity: NotificationType = 'info') => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setOpen(true);
  };

  const closeNotification = () => setOpen(false);

  const value = useMemo(
    () => ({ message, severity, open, showNotification, closeNotification }),
    [message, severity, open]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
