import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Define the user object type
interface User {
  id: number;
  username: string;
}

// Define the context type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  saveUser: (user: User | null) => void;
}

// Create the context
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  login: async () => {},
  logout: () => {},
  saveUser: () => {},
});

// Custom hook to consume the user context
export const useUser = () => useContext(UserContext);

// User provider component
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      // Your login logic here
      console.log("submit");

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { username, password }
      );

      await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/setToken?access=${res.data.accessToken}&refresh=${res.data.refreshToken}`,
        { withCredentials: true }
      );

      toast.success("Logged in!");
      const loggedInUser = { id: res.data.user.id, username };

      setUser(loggedInUser);
      saveUser(loggedInUser);
        navigate("/");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getUser = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/getUser`,
        { withCredentials: true }
      );

      const { user: userData } = res.data;

      setUser({ id: userData.id, username: userData.username });
      saveUser({ id: userData.id, username: userData.username });
      console.log(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      navigate("/login");
    }
  }, [navigate, user]);

  const saveUser = (user: User | null) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  const logout = () => {
    // Your logout logic here
    setUser(null);
  };

  // Refresh user token
  useEffect(() => {
    console.log(user);

    const refreshToken = async () => {
      try {
        const refresh = setInterval(async () => {
          await axios.get(
            `${process.env.REACT_APP_API_URL}/auth/refreshToken`,
            {
              withCredentials: false,
            }
          );
        }, 30 * 60 * 1000 /* half an hour */);

        // Clean-up function (optional)
        return () => clearInterval(refresh);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        navigate("/login");
      }
    };

    refreshToken();
    getUser();
  }, [navigate]); // Empty dependency array means the effect runs only once when the component mounts

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, saveUser }}>
      {children}
    </UserContext.Provider>
  );
};
