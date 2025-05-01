import {AppBar, Toolbar, Button, Box, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth"; // your token + role helper
import React from "react";

const NavBar = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload();
    };

    return (
        <AppBar position="static">
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', gap: 2}}>
                    <Button color="inherit" component={Link} to="/products">Products</Button>
                    <Button color="inherit" component={Link} to="/orders">My Orders</Button>
                    {user?.role === "ADMIN" && (
                        <Button color="inherit" component={Link} to="/admin/orders">All Orders</Button>
                    )}
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    {user && (
                        <Typography color="inherit">
                            Role: {user.role} Email: {user.email}
                        </Typography>

                    )}
                    {user ? (
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    ) : (
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                    )}
                </Box>
            </Toolbar>
            
        </AppBar>
    );
};

export default NavBar;
