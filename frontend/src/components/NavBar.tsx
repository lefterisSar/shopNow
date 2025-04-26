import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NavBar() {
    return (
        <AppBar position="static" color="primary">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Left side - Logo or App Name */}
                <Typography variant="h6" component={RouterLink} to="/products" sx={{ textDecoration: 'none', color: 'inherit' }}>
                    ShopNow
                </Typography>

                {/* Right side - Navigation Links */}
                <Stack direction="row" spacing={2}>
                    <Button color="inherit" component={RouterLink} to="/products">
                        Products
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/my-orders">
                        My Orders
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/">
                        Login
                    </Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
