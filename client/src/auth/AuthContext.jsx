import { createContext, useState, useEffect } from 'react'
import { ApolloProvider } from '@apollo/client';
import { gql, useQuery, useMutation } from '@apollo/client';

// query for checking if user is logged in
const LOGGED_IN_USER = gql`
  query IsLoggedIn {
    isLoggedIn
  }
`;

// query for checking if user is logged in
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
// mutation for user login
const LOGIN_USER = gql`
    mutation LoginUser( $email: String!, $password: String!) {
        loginUser( email: $email, password: $password)
        {
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
const AuthContext = createContext(
    {
        authUser: { id: '' },
        login: async (email, password) => {
            console.log("Called Login default context.")
            return false;
        },
        logout: async () => {
            console.log("Called Logout default context.")
            return "";
        },
        isLoggedIn: false,
        isNurse: false
    }
)

export const AuthContextProvider = ({ children }) => {
    const [authUser, setUser] = useState({ id: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isNurse, setIsNurse] = useState(false);
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
                    console.log("Refetched some data in a valid way. ")
                    setIsLoggedIn(isLoggedInVar);
                }
                await refetchNurseData();
                const isNurseVar = isNurseData?.isNurse;
                if (isNurseVar !== undefined && isNurseVar !== isNurse) {
                    console.log("Sets up isNurse. ")
                    setIsNurse(isNurseVar);
                }
                await refetchAuthData();
                const userVar = authData?.authUserId;
                if (userVar !== undefined && authUser.id !== userVar) {
                    console.log("Sets up UserId. ")
                    setUser({ id: userVar });
                }
                console.log(".. Refetched some data... ")
            } catch (e) {
                setIsLoggedIn(false);
                console.log('error: Error in fetching logged-in information. ', e);
            }
        };
        checkLoginStatus();
    }, [isLoggedInData, refetchLoggedInData, isLoggedIn, isNurse, authUser]); // Include refetchLoggedInData in the dependency array
    //returns -> if Login was succesfull (boolean).
    const login = async (email, password) => {
        try {
            const { data } = await loginUser({
                variables: { email, password }
            });
            if (data.loginUser !== null || data.loginUser !== undefined) {
                setIsLoggedIn(true);
                await refetchNurseData();
                const isNurseVar = isNurseData?.isNurse;
                if (isNurseVar !== undefined) {
                    console.log("Sets up isNurse. ")
                    setIsNurse(isNurseVar);
                }
                await refetchAuthData();
                const userVar = authData?.authUserId;
                if (userVar !== undefined) {
                    console.log("Sets up UserId. ")
                    setUser({ id: userVar });
                }
                return true;
            }
            return false;

        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    const logout = async () => {
        try {
            const isLoggedOutData = await logoutUser();
            const isLoggedOutString = isLoggedOutData?.logOut;
            if (isLoggedOutString !== undefined) {
                console.log(isLoggedOutString);
                return (isLoggedOutString)
            }
            setIsLoggedIn(false);
            setUser({ id: '', userName: '', email: '', role: '' });
        }
        catch (error) {
            console.error('Logout Error:', error);
            return ("Error in Logging out")
        }
    }
    //authUser es el ID de el que esta logged in, si lo necesitan usar.
    const context = { authUser, login, logout, isLoggedIn, isNurse }

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContext;