import { Button, Stack } from "@mui/material";

export default function AddToCartButton({ product, quantity, increment, decrement }) {
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="outlined" onClick={() => decrement(product)} disabled={quantity === 0}>−</Button>
            <span>{quantity}</span>
            <Button variant="contained" onClick={() => increment(product)} disabled={product.stock <= quantity}>＋</Button>
        </Stack>
    );
}
