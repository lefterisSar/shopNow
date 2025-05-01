import {AppBar, Toolbar, Button, Box, Typography} from "@mui/material";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // your token + role helper

const NavBar = () => {
    const {user, logout} = useAuth(); // get user.role from JWT

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
                            Role: {user.role}
                        </Typography>
                    )}
                    {user ? (
                        <Button color="inherit" onClick={logout}>Logout</Button>
                    ) : (
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                    )}
                </Box>
            </Toolbar>
            
        </AppBar>
    );
};

export default NavBar;
