"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function CartButton() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const reduce = useReducedMotion();

  return (
    <>
      <motion.button
        type="button"
        className="cart-button"
        onClick={() => setOpen(true)}
        aria-label={`Open cart, ${itemCount} items`}
        whileTap={reduce ? undefined : { scale: 0.97 }}
      >
        <ShoppingBag size={16} aria-hidden="true" />
        <span className="cart-label">Cart</span>
        <motion.span
          key={itemCount}
          className="cart-count"
          initial={reduce ? false : { scale: 0.7, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {itemCount}
        </motion.span>
      </motion.button>
      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
