import { useEffect, useState } from "react";
import axios from "../api/axios";
import ProductCard from "../components/ProductCard";
import {Box, Button} from "@mui/material";


export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [, setError] = useState("");

    const getCartTotal = () => {
        return Object.values(cart).reduce((sum, item) => {
            return sum + item.quantity * item.price;
        }, 0);
    };


    const handlePlaceOrder = async () => {
        const total = getCartTotal();

        if (total <= 0) {
            alert("Cart is empty!");
            return;
        }

        try {
            const response = await axios.post("/api/orders", {
                total,
            });

            console.log("✅ Order placed:", response.data);
            alert("Order placed successfully!");
            setCart({}); // clear cart
        } catch (err) {
            console.error("❌ Failed to place order:", err);
            alert("Failed to place order. Are you logged in?");
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("/api/products");
                setProducts(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load products.");
            }
        };
        fetchProducts();
    }, []);

    const increment = (product) => {
        setCart((prev) => ({
            ...prev,
            [product.id]: {
                ...product,
                quantity: (prev[product.id]?.quantity || 0) + 1,
            },
        }));
    };

    const decrement = (product) => {
        setCart((prev) => {
            const currentQty = prev[product.id]?.quantity || 0;
            if (currentQty <= 1) {
                const { [product.id]: _, ...rest } = prev;
                return rest;
            } else {
                return {
                    ...prev,
                    [product.id]: {
                        ...product,
                        quantity: currentQty - 1,
                    },
                };
            }
        });
    };
    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    quantity={cart[product.id]?.quantity || 0}
                    increment={increment}
                    decrement={decrement}
                    showAddToCart={product.stock > 0}
                />
            ))}
            <Button
                variant="contained"
                color="primary"
                onClick={handlePlaceOrder}
                sx={{ mt: 2 }}
            >
                Place Order
            </Button>

        </Box>

    );
}
