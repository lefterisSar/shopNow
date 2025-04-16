import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function ProductList() {
    const [products, setProducts] = useState([]);
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

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Product Catalog</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                    {products.map((product) => (
                        <div key={product.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "6px" }}>
                            <h4>{product.name}</h4>
                            <p>{product.description}</p>
                            <p><strong>${product.price}</strong></p>
                            <p>In stock: {product.stock}</p>
                            <p>Category: {product.category}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
