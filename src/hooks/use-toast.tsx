'use client';

import React from 'react';

type ToastActionElement = React.ReactNode;

interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TOAST_LIMIT = 1;

export const TOAST_DURATION = 3000;

type Variant = 'success' | 'error' | 'info' | 'warning';

type ToasterToast = Props & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: Variant;
};

type Action =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> }
  | { type: 'DISMISS_TOAST'; toastId?: ToasterToast['id'] }
  | { type: 'REMOVE_TOAST'; toastId?: ToasterToast['id'] };

interface State {
  toasts: ToasterToast[];
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined ? { ...t, open: false } : t
        ),
      };
    }

    case 'REMOVE_TOAST':
      if (!action.toastId) return { ...state, toasts: [] };
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];
const initialState: State = { toasts: [] };
export let memoryState = initialState;

export function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Toast = Omit<ToasterToast, 'id'>;

function toast({ variant = 'info', ...props }: Toast) {
  const id = genId();

  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });
  const update = (props: ToasterToast) =>
    dispatch({ type: 'UPDATE_TOAST', toast: { ...props, id } });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      variant,
    },
  });

  return { id, dismiss, update };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

const ToastComponent = ({ toast }: { toast: ToasterToast }) => {
  let toastClass = 'bg-gray-800 text-white';
  switch (toast.variant) {
    case 'success':
      toastClass = 'bg-green-500 text-white';
      break;
    case 'error':
      toastClass = 'bg-red-500 text-white';
      break;
    case 'info':
      toastClass = 'bg-blue-500 text-white';
      break;
    case 'warning':
      toastClass = 'bg-yellow-500 text-black';
      break;
    default:
      toastClass = 'bg-gray-800 text-white';
      break;
  }

  return (
    <div className={`${toastClass} p-4 rounded-md`}>
      <div className="font-semibold">{toast.title}</div>
      <div>{toast.description}</div>
    </div>
  );
};

export { useToast, toast, ToastComponent };