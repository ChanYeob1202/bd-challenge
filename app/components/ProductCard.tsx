"use client";

import { motion } from "motion/react";
import Image from "next/image";

// individual card, motion -> whilehover: up down, shadow

interface ProductCardProps {
  id: string;
  handle: string;
  title: string;
  price: string;
  currencyCode: string;
  image?: {
    url: string;
    altText?: string | null; 
  }
  onQuickView: () => void; 
}

export function ProductCard({
  title,
  price,
  currencyCode,
  image,
  onQuickView,
}: ProductCardProps) {
  return (
    <motion.div
      className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-500"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.1 }}
    >
      {/* Product Image   url : alt-text */}  
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || title}
            fill
            className="object-cover"
        
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className = "p-4">
        <h3 className = "text-lg font-semibold line-clamp-2 text-gray-800 mb-2">
          {title}
        </h3>

        <p className = "text-md font-semibold text-gray-800 mb-3">
          {currencyCode} ${parseFloat(price).toFixed(2)}
        </p>

        <motion.div
          onClick = {onQuickView}
          className = "w-1/2 mx-auto  py-2 px-4 rounded-lg border border-gray-200 hover:bg-gray-400 transition-all duration-400 text-md text-center  hover:cursor-pointer"
        >
          Quick View
        </motion.div>
      </div>
    </motion.div>
  );
}
