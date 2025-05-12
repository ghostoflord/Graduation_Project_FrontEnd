import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context"; // nhớ import

const Oauth2Redirect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsAuthenticated, setUser } = useCurrentApp(); // Lấy context ra

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get("accessToken");
        const userStr = params.get("user");

        if (accessToken && userStr && accessToken !== "null" && userStr !== "null") {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));

                // Lưu vào localStorage
                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("user", JSON.stringify(user));

                // Cập nhật context
                setIsAuthenticated(true);
                setUser(user);

                navigate("/", { replace: true });
            } catch (e) {
                console.error("Parse user error:", e);
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate, location, setIsAuthenticated, setUser]);

    return <div>Đang đăng nhập...</div>;
};

export default Oauth2Redirect;