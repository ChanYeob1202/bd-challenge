"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { AddToCartButton } from "./AddToCartButton";
// The actual product details inside the modal
// Handles variant selection (size, color, etc.) and image gallery
interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
};

interface SelectedOption {
  name: string;
  value: string;
};

interface Variant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: {
    amount: string;
    currencyCode: string;
  };
  image?: ProductImage | null;
};

interface Option {
  id: string;
  name: string;
  values: string[];
};

interface Product {
  id: string;
  title: string;
  description: string;
  images: { edges: {node: ProductImage}[] };
  options: Option[];
  variants: { edges: { node: Variant }[] };
};

interface QuickViewModalContentProps {
  product: Product;
  onClose: () => void;
};

export function QuickViewModalContent({
  product,
  onClose,
}: QuickViewModalContentProps) {
  const images = product.images.edges.map((edge) => edge.node);
  const variants = product.variants.edges.map((edge) => edge.node);

  // State: selected options (e.g., { Size: "M", Color: "Blue" })
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Find the variant that matches the selected options

  const selectedVariant = variants.find((variant) => {
    return variant.selectedOptions.every((option) => {
      return selectedOptions[option.name] === option.value; 
    });
  });

  // get current img and display on the main
  const currentImage = selectedVariant?.image 
    ? selectedVariant.image 
    : (images[currentImageIndex] || images[0]);

  // Check if an option value is available based on current selections
  const getAvailableValues = (optionName: string, optionValues: string[]) => {
    return optionValues.map((value) => {
      const hasAvailableVariant = variants.some((variant) => {
        const matchesValue = variant.selectedOptions.some(
          (opt) => opt.name === optionName && opt.value === value
        );
        const matchesOtherSelections = variant.selectedOptions.every((opt) => {
          if (opt.name === optionName) return true;
          return !selectedOptions[opt.name] || selectedOptions[opt.name] === opt.value;
        });
        return matchesValue && matchesOtherSelections && variant.availableForSale;
      });

      return { value, isAvailable: hasAvailableVariant };
    });
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const price = selectedVariant?.price || variants[0]?.price;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 p-0 md:p-8">
      {/* Left: Product Images */}
      <div className="space-y-4">
        {/* Main Image with crossfade animation */}
        <div className="relative aspect-square bg-gray-100 rounded-none md:rounded-xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={currentImage.url}
                alt={currentImage.altText || product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail Gallery setcurrentImage -> index */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto px-6 md:px-0 pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === index
                    ? "border-black scale-105"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.altText || `${product.title} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Details */}
      <div className="p-6 md:p-0 flex flex-col gap-6">
        {/* Title */}
        <div>
          <h2 id="modal-title" className="text-3xl font-bold text-gray-900">
            {product.title}
          </h2>
          {selectedVariant && (
            <p className="text-sm text-gray-500 mt-1">{selectedVariant.title}</p>
          )}
        </div>

        {/* Price with animation when it changes */}
        {price && (
          <motion.div
            key={price.amount}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            {price.currencyCode} ${parseFloat(price.amount).toFixed(2)}
          </motion.div>
        )}

        {/* Description */}
        {product.description && (
          <div className="prose prose-sm text-gray-600 max-h-32 overflow-y-auto">
            <p>{product.description}</p>
          </div>
        )}

        {/* Variant Options (Size, Color, etc.) */}
        <div className="space-y-6">
          {product.options
            .filter((option) => option.name !== "Title") // Skip the default "Title" option
            .map((option) => {
              const availableValues = getAvailableValues(option.name, option.values);
              
              return (
                <div key={option.id}>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    {option.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableValues.map(({ value, isAvailable }) => {
                      const isSelected = selectedOptions[option.name] === value;
                      
                      return (
                        <motion.button
                          key={value}
                          onClick={() => isAvailable && handleOptionChange(option.name, value)}
                          disabled={!isAvailable}
                          className={`relative px-6 py-3 rounded-lg font-medium transition-all ${
                            isSelected
                              ? "bg-black text-white"
                              : isAvailable
                              ? "bg-white border-2 border-gray-300 text-gray-900 hover:border-black"
                              : "bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed line-through"
                          }`}
                          whileHover={isAvailable ? { scale: 1.05 } : {}}
                          whileTap={isAvailable ? { scale: 0.95 } : {}}
                        >
                          {value}
                          {/* Animated selection indicator */}
                          {isSelected && (
                            <motion.div
                              layoutId={`selected-${option.name}`}
                              className="absolute inset-0 bg-black rounded-lg"
                              style={{ zIndex: -1 }}
                              transition={{ type: "spring", duration: 0.5 }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton variant={selectedVariant} onSuccess={onClose} />
      </div>
    </div>
  );
}
