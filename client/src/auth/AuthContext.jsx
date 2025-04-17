import { createContext, useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

// Queries and Mutations
const LOGGED_IN_USER = gql`
  query IsLoggedIn {
    isLoggedIn
  }
`;

const USER_IS_NURSE = gql`
  query IsNurse {
    isNurse
  }
`;

const LOGGED_OUT_USER = gql`
  mutation LogOut {
    logOut
  }
`;

const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      __typename
      id
    }
  }
`;

const GET_AUTH_USER_ID = gql`
  query AuthUserId {
    authUserId
  }
`;

// Context
const AuthContext = createContext({
  authUser: { id: '' },
  login: async () => false,
  logout: async () => '',
  isLoggedIn: false,
  isNurse: false,
  isAuthReady: false // ✅ Added
});

export const AuthContextProvider = ({ children }) => {
  const [authUser, setUser] = useState({ id: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNurse, setIsNurse] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false); // ✅ Added

  const [logoutUser] = useMutation(LOGGED_OUT_USER);
  const [loginUser] = useMutation(LOGIN_USER);

  const { data: isLoggedInData, refetch: refetchLoggedInData } = useQuery(LOGGED_IN_USER);
  const { data: isNurseData, refetch: refetchNurseData } = useQuery(USER_IS_NURSE);
  const { data: authData, refetch: refetchAuthData } = useQuery(GET_AUTH_USER_ID);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await refetchLoggedInData();
        const isLoggedInVar = isLoggedInData?.isLoggedIn;
        if (isLoggedInVar !== undefined && isLoggedInVar !== isLoggedIn) {
          console.log("Refetched some data in a valid way. ");
          setIsLoggedIn(isLoggedInVar);
        }

        await refetchNurseData();
        const isNurseVar = isNurseData?.isNurse;
        if (isNurseVar !== undefined && isNurseVar !== isNurse) {
          console.log("Sets up isNurse. ");
          setIsNurse(isNurseVar);
        }

        await refetchAuthData();
        const userVar = authData?.authUserId;
        if (userVar !== undefined && authUser.id !== userVar) {
          console.log("Sets up UserId. ");
          setUser({ id: userVar });
        }

        setIsAuthReady(true); // ✅ Mark auth as ready
        console.log(".. Refetched some data... ");
      } catch (e) {
        setIsLoggedIn(false);
        setIsAuthReady(true); // ✅ Even if failed, set it ready
        console.log('error: Error in fetching logged-in information. ', e);
      }
    };

    checkLoginStatus();
  }, [isLoggedInData, refetchLoggedInData, isLoggedIn, isNurse, authUser]);

  const login = async (email, password) => {
    try {
      const { data } = await loginUser({
        variables: { email, password }
      });

      if (data.loginUser !== null && data.loginUser !== undefined) {
        setIsLoggedIn(true);

        await refetchNurseData();
        const isNurseVar = isNurseData?.isNurse;
        if (isNurseVar !== undefined) {
          console.log("Sets up isNurse. ");
          setIsNurse(isNurseVar);
        }

        await refetchAuthData();
        const userVar = authData?.authUserId;
        if (userVar !== undefined) {
          console.log("Sets up UserId. ");
          setUser({ id: userVar });
        }

        return true;
      }

      return false;

    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const isLoggedOutData = await logoutUser();
      const isLoggedOutString = isLoggedOutData?.logOut;
      if (isLoggedOutString !== undefined) {
        console.log(isLoggedOutString);
        return isLoggedOutString;
      }
      setIsLoggedIn(false);
      setUser({ id: '', userName: '', email: '', role: '' });
    } catch (error) {
      console.error('Logout Error:', error);
      return "Error in Logging out";
    }
  };

  const context = {
    authUser,
    login,
    logout,
    isLoggedIn,
    isNurse,
    isAuthReady 
  };

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
