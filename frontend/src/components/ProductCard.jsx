import { Card, CardContent, Typography, Box } from "@mui/material";
import AddToCartButton from "./buttons/AddToCartButton.jsx";

export default function ProductCard({ product, quantity, increment, decrement, showAddToCart = true }) {
    return (
        <Card sx={{ width: 250, margin: 1, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6" component="div">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                <Typography variant="body1">💵 ${product.price}</Typography>
                <Typography variant="body2">📦 {product.stock} in stock</Typography>
                <Typography variant="caption" color="text.secondary">🏷 {product.category}</Typography>

                {showAddToCart && product.stock > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <AddToCartButton
                            product={product}
                            quantity={quantity}
                            increment={increment}
                            decrement={decrement}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
