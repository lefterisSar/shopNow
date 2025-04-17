import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product, quantity, increment, decrement, showAddToCart = true }) {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                padding: "1rem",
                width: "220px",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
        >
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>💵 ${product.price}</p>
            <p>📦 {product.stock} in stock</p>
            <p>🏷 Category: {product.category}</p>

            {showAddToCart && product.stock > 0 && (
                <AddToCartButton
                    product={product}
                    quantity={quantity}
                    increment={increment}
                    decrement={decrement}
                />
            )}
        </div>
    );
}
