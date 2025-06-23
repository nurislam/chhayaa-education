"use client";
import { Button, Snackbar } from "@mui/material";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: any }) {
  const [isAdding, setIsAdding] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Function to add the product to the cart in localStorage
  const handleAddToCart = () => {
    setIsAdding(true);
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if the product already exists in the cart
    const existingProductIndex = existingCart.findIndex((item: any) => item.id === product.id);

    if (existingProductIndex !== -1) {
      // Update quantity if the product is already in the cart
      existingCart[existingProductIndex].quantity += 1;
    } else {
      // Add new product to cart with quantity 1
      const newProduct = { ...product, quantity: 1 };
      existingCart.push(newProduct);
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Update cart count
    const totalItems = existingCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setCartCount(totalItems);

    setIsAdding(false);
    setOpen(true);
  };

  return (
    <>
      {/* Snackbar Message */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message={`Added to cart`}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        action={
          <Button color="inherit" size="small" href="/shop/cart">
            View Cart ({cartCount})
          </Button>
        }
      />

      {/* Add to Cart Button */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleAddToCart}
        disabled={isAdding} 
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </Button>
    </>
  );
}
