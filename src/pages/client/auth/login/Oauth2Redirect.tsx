import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Oauth2Redirect = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        console.log("URL Params: ", location.search); //CHÍNH XÁC HƠN window.location.search

        const accessToken = params.get("accessToken");
        const userStr = params.get("user");

        console.log("accessToken:", accessToken);
        console.log("userStr:", userStr);

        if (accessToken && userStr && accessToken !== "null" && userStr !== "null") {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                console.log("Parsed user:", user);

                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("user", JSON.stringify(user));

                navigate("/", { replace: true }); // Điều hướng về home
            } catch (e) {
                console.error("Parse user error:", e);
                navigate("/login");
            }
        } else {
            console.warn("accessToken hoặc userStr không hợp lệ");
            navigate("/login");
        }
    }, [navigate, location]);

    return <div>Đang đăng nhập...</div>;
};

export default Oauth2Redirect;
