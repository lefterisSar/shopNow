import { useEffect, useState } from "react";
import axios from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [error, setError] = useState("");

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

    const getCartTotal = () => {
        return Object.values(cart).reduce((sum, item) => {
            return sum + item.quantity * item.price;
        }, 0);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>🛍 Product Catalog</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
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
            </div>

            {Object.keys(cart).length > 0 && (
                <div style={{ marginTop: "2rem" }}>
                    <h3>🧺 Cart</h3>
                    <ul>
                        {Object.values(cart).map((item) => (
                            <li key={item.id}>
                                {item.name} × {item.quantity} = ${item.quantity * item.price}
                            </li>
                        ))}
                    </ul>
                    <p><strong>Total: ${getCartTotal().toFixed(2)}</strong></p>
                </div>
            )}
        </div>
    );
}
