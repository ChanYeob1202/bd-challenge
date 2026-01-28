"use client";

import { useState } from "react";
import { motion } from "motion/react";

// Add to Cart button with loading and success states
// States: disabled -> idle -> loading -> success

type Variant = {
  id: string;
  availableForSale: boolean;
};

type AddToCartButtonProps = {
  variant?: Variant;
  onSuccess: () => void;
};

type ButtonState = "idle" | "loading" | "success";

export function AddToCartButton({ variant, onSuccess }: AddToCartButtonProps) {
  const [buttonState, setButtonState] = useState<ButtonState>("idle");

  const isDisabled = !variant || !variant.availableForSale || buttonState !== "idle";

  const handleAddToCart = async () => {
    if (isDisabled) return;

    // Loading state
    setButtonState("loading");

    // Simulate API call (800-1200ms delay as required)
    const delay = 800 + Math.random() * 400;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Success state
    setButtonState("success");

    // Close modal after 1.5 seconds
    setTimeout(() => {
      onSuccess();
      setButtonState("idle");
    }, 1500);
  };

  const getButtonStyles = () => {
    if (!variant || !variant.availableForSale) {
      return "bg-gray-200 text-gray-400 cursor-not-allowed";
    }
    if (buttonState === "success") return "bg-green-500 text-white";
    if (buttonState === "loading") return "bg-black text-white";
    return "bg-black text-white hover:bg-gray-800";
  };

  return (
    <motion.button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`w-full py-4 px-8 rounded-lg font-semibold text-lg transition-all ${getButtonStyles()}`}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
    >
      <div className="flex items-center justify-center gap-2">
        {buttonState === "idle" && <span>Add to Bag</span>}

        {buttonState === "loading" && (
          <>
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            <span>Adding...</span>
          </>
        )}

        {buttonState === "success" && (
          <>
            <motion.svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <path d="M5 13l4 4L19 7" />
            </motion.svg>
            <span>Added!</span>
          </>
        )}
      </div>
    </motion.button>
  );
}
