import { fetchAccountAPI } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";

interface IAppContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IUser | null) => void;
    user: IUser | null;
    isAppLoading: boolean;
    setIsAppLoading: (v: boolean) => void;
    carts: ICart[];
    setCarts: (v: ICart[]) => void;
    cartSummary: { sum: number } | null;
    setCartSummary: (v: { sum: number } | null) => void;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
    children: React.ReactNode;
};

export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
    const [carts, setCarts] = useState<ICart[]>([]);
    const [cartSummary, setCartSummary] = useState<{ sum: number }>({ sum: 0 });

    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem("access_token");
            const savedUser = localStorage.getItem("user");

            if (token && savedUser) {
                setUser(JSON.parse(savedUser));
                setIsAuthenticated(true);
            }

            if (token) {
                try {
                    const res = await fetchAccountAPI();
                    if (res.data) {
                        setUser(res.data.user);
                        localStorage.setItem("user", JSON.stringify(res.data.user));
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error(error);
                    setUser(null);
                    setIsAuthenticated(false);
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                }
            }

            const carts = localStorage.getItem("carts");
            if (carts) {
                setCarts(JSON.parse(carts));
            }

            setIsAppLoading(false);
        };

        fetchAccount();
    }, []);

    return (
        <>
            {isAppLoading === false ? (
                <CurrentAppContext.Provider
                    value={{
                        isAuthenticated,
                        user,
                        setIsAuthenticated,
                        setUser,
                        isAppLoading,
                        setIsAppLoading,
                        carts,
                        setCarts,
                        cartSummary,
                        setCartSummary,
                    }}
                >
                    {props.children}
                </CurrentAppContext.Provider>
            ) : (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <PropagateLoader size={30} color="#36d6b4" />
                </div>
            )}
        </>
    );
};

export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);

    if (!currentAppContext) {
        throw new Error("useCurrentApp has to be used within <CurrentAppContext.Provider>");
    }

    return currentAppContext;
};
