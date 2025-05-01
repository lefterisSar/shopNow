import { useEffect, useState } from "react";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
} from "@mui/x-data-grid";
import {
    Container,
    Typography,
    Box,
    TextField,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import orderAxios from "../api/orderAxios";
import useAuth from "../hooks/useAuth";
import React from "react";



export interface Order {
    id: string;
    userEmail: string;
    status: "PENDING" | "COMPLETED" | "CANCELLED";
    total: number;
    createdAt: string;
}

const AllOrdersPage = () => {
    const [orders, setOrders] = useState < Order[] > ([]);
    const [filtered, setFiltered] = useState < Order[] > ([]);
    const [search, setSearch] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role === "ADMIN") {
            orderAxios
                .get("/api/orders/admin")
                .then((res:any) => {
                    console.log(res.data); // Check here
                    setOrders(res.data);
                    setFiltered(res.data);
                })
                .catch((err:any) => console.error("Failed to load orders", err));
        }
    }, [user]);

    useEffect(() => {
        const lower = search.toLowerCase();
        setFiltered(
            orders.filter(
                (order) =>
                    order.userEmail?.toLowerCase().includes(lower) ||
                    order.status?.toLowerCase().includes(lower)
            )
        );
    }, [search, orders]);

    if (user?.role !== "ADMIN") {
        return <Typography variant="h6" color="error">Access denied</Typography>;
    }

    const columns = [
        { field: "id", headerName: "Order ID", flex: 1 },
        { field: "userEmail", headerName: "User Email", flex: 1 },
        { field: "status", headerName: "Status", flex: 1 },
        { field: "total", headerName: "Total (€)", flex: 0.7 },
        {
            field: "createdAt",
            headerName: "Created At",
            flex: 1,
            valueGetter: (params:any) => params.row?.createdAt ? new Date(params.row.createdAt).toLocaleString() : 'N/A',
        }
    ];

    const CustomToolbar = () => (
        <GridToolbarContainer>
            <GridToolbarExport />
        </GridToolbarContainer>
    );

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                All Orders
            </Typography>

            <TextField
                placeholder="Search by email or status"
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <Box sx={{ height: 600, width: "100%" }}>
                <DataGrid
                    rows={filtered}
                    columns={columns}
                    getRowId={(row) => row.id}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10, page: 0 } },
                    }}
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                />
            </Box>
        </Container>
    );
};

export default AllOrdersPage;
