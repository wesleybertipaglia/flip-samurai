'use client';

import { useEffect } from 'react';
import { Card } from '@progress/kendo-react-layout';
import { useToast, dispatch, TOAST_DURATION } from '@/hooks/use-toast';

const TRANSITION_BUFFER = TOAST_DURATION + 100;

const ToastItem = ({ toast }: any) => {
  useEffect(() => {
    const dismissTimer = setTimeout(() => {
      dispatch({ type: 'DISMISS_TOAST', toastId: toast.id });
    }, TOAST_DURATION);

    const removeTimer = setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', toastId: toast.id });
    }, TOAST_DURATION + TRANSITION_BUFFER);

    return () => {
      clearTimeout(dismissTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id]);

  if (!toast.open && (TOAST_DURATION + TRANSITION_BUFFER) < 0) return null;

  return (
    <Card
      key={toast.id}
      className={`shadow-sm transition-opacity duration-500 ease-out ${toast.open ? 'opacity-100' : 'opacity-0'}`}
      style={{
        marginBottom: 10,
        padding: '1rem',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        width: 300,
        background: '#fff',
      }}
    >
      {toast.title && <div style={{ fontWeight: 'bold' }}>{toast.title}</div>}
      {toast.description && <div>{toast.description}</div>}
      {toast.action && <div style={{ marginTop: 10 }}>{toast.action}</div>}
    </Card>
  );
};


const Toaster = () => {
  const { toasts } = useToast();

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default Toaster;