import { useEffect, useState } from "react";
import axios from "../api/axios";
import ProductCard from "../components/ProductCard";
import {Box} from "@mui/material";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:8082/api/products");
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
        </Box>
    );
}
