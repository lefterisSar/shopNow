import { Button, Stack } from "@mui/material";
import { Product } from "../../types/Product"; // adjust path if needed
import React from "react";

interface AddToCartButtonProps {
    product: Product;
    quantity: number;
    increment: (product: Product) => void;
    decrement: (product: Product) => void;
}

export default function AddToCartButton({
                                            product,
                                            quantity,
                                            increment,
                                            decrement,
                                        }: AddToCartButtonProps) {
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Button
                variant="outlined"
                onClick={() => decrement(product)}
                disabled={quantity === 0}
            >
                −
            </Button>
            <span>{quantity}</span>
            <Button
                variant="contained"
                onClick={() => increment(product)}
                disabled={product.stock <= quantity}
            >
                ＋
            </Button>
        </Stack>
    );
}
