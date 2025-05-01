import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import AddToCartButton from "./buttons/AddToCartButton"; // optionally convert to .tsx too
import { Product } from "../types/Product"; // adjust the path as needed
import React from "react";

interface ProductCardProps {
    product: Product;
    quantity: number;
    increment: (product: Product) => void;
    decrement: (product: Product) => void;
    showAddToCart?: boolean;
    handlePlaceOrder: () => void;
}

export default function ProductCard({
                                        product,
                                        quantity,
                                        increment,
                                        decrement,
                                        showAddToCart = true,
                                        handlePlaceOrder,
                                    }: ProductCardProps) {
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

                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        fullWidth
                        disabled={quantity === 0}
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
