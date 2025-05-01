
import { useState, useEffect } from "react";
import {jwtDecode, JwtPayload} from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
    roles: string[];
}

interface User {
    email: string;
    role: string;
}

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode<CustomJwtPayload>(token);
                setUser({
                    email: decoded.sub!,
                    role: decoded.roles?.[0] || "USER",
                });
            } catch (err) {
                console.error("Invalid token", err);
                localStorage.removeItem("token");
                setUser(null);
            }
        }
    }, []);

    return { user };
};

export default useAuth;
