import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCurrentUser, getUserByEmail } from "../AuthService";
import { IUser, IUserInfo } from "../Type";

interface IUserProviderValues {
  user: IUser | null;
  userInfo: IUserInfo | null;
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  setUserInfo: Dispatch<SetStateAction<IUserInfo | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<IUserProviderValues | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);

      if (currentUser?.email) {
        const dbUser = await getUserByEmail(currentUser.email);
        setUserInfo(dbUser);
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      setUser(null);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ run only once (not dependent on isLoading)
  useEffect(() => {
    handleUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        userInfo,
        isLoading,
        setUser,
        setUserInfo,
        setIsLoading,
        refetchUser: handleUser, // ✅ to manually refetch after login/logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within the UserProvider Context");
  }
  return context;
};

export default UserProvider;
