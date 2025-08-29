import * as React from 'react';
import { ToastProps } from './toast';

type Toast = Omit<ToastProps, 'id'>;

type ToastWithId = Toast & { id: string };

type Action =
  | { type: 'ADD_TOAST'; toast: ToastWithId }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToastWithId> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId: string }
  | { type: 'REMOVE_TOAST'; toastId: string };

interface State {
  toasts: ToastWithId[];
}

const toastTimeouts = new Map<string, NodeJS.Timeout>();

const toastReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts],
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;
      
      // Clear the timeout if it exists
      if (toastTimeouts.has(toastId)) {
        clearTimeout(toastTimeouts.get(toastId));
        toastTimeouts.delete(toastId);
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      };
    }

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = toastReducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const DEFAULT_DURATION = 5000;

function toast(props: Toast) {
  const id = genId();
  const duration = props.duration ?? DEFAULT_DURATION;

  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });
  const remove = () => dispatch({ type: 'REMOVE_TOAST', toastId: id });

  // Auto-dismiss after duration
  if (duration !== 0) {
    const timeout = setTimeout(() => {
      dismiss();
      // Remove from state after animation
      setTimeout(remove, 300);
    }, duration);
    
    toastTimeouts.set(id, timeout);
  }

  const toastProps: ToastWithId = {
    ...props,
    id,
    onDismiss: () => {
      props.onDismiss?.();
      dismiss();
      // Remove from state after animation
      setTimeout(remove, 300);
    },
  };

  dispatch({
    type: 'ADD_TOAST',
    toast: toastProps,
  });

  return {
    id,
    dismiss,
    update: (props: Partial<Toast>) =>
      dispatch({
        type: 'UPDATE_TOAST',
        toast: { ...props, id },
      }),
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { useToast, toast };

