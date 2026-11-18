import { createContext, useContext, useReducer } from 'react';

type User = {
  name: string;
  email: string;
  password: string;
  avatar: string;
};

const FAKE_USER: User = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

interface StateData {
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextValue extends StateData {
  login: (email: string, password: string) => void;
  logout: () => void;
}

type Action = { type: 'login'; payload: User } | { type: 'logout' };

const AuthContext = createContext<AuthContextValue | null>(null);

const initialState: StateData = {
  isAuthenticated: false,
  user: null,
};

function reducer(state: StateData, action: Action): StateData {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'logout':
      return { ...state, user: null, isAuthenticated: false };
    default:
      const _exhaustive: never = action;
      throw new Error(`Unknown Action: ${JSON.stringify(_exhaustive)}`);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  function login(email: string, password: string) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: 'login', payload: FAKE_USER });
  }
  function logout() {
    if (!isAuthenticated) return;
    dispatch({ type: 'logout' });
  }

  return (
    <AuthContext
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error(`useAuthContext must be used inside a AuthProvider`);
  return context;
}
