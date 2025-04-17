import React from "react";

export default function AddToCartButton({ product, quantity, increment, decrement }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
            <button onClick={() => decrement(product)} disabled={quantity === 0}>−</button>
            <span>{quantity}</span>
            <button onClick={() => increment(product)} disabled={product.stock <= quantity}>＋</button>
        </div>
    );
}
