"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";

// click -> open mdal "quck view"

// product data shape
interface Product {
  id: string;
  title: string; 
  handle: string;
  featuredImage?: {
    url: string;
  } | null;
  priceRange: {
   minVariantPrice: {
    amount: string;
    currencyCode: string;
   } 
  }
}

interface  ProductGridProps {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  const [selectedProductHandle, setSelectedProductHandle] = useState<string | null>(null);

  return (
    <>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            handle={product.handle}
            title={product.title}
            price={product.priceRange.minVariantPrice.amount}
            currencyCode={product.priceRange.minVariantPrice.currencyCode}
            image={product.featuredImage || undefined}
            onQuickView={() => setSelectedProductHandle(product.handle)}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        productHandle={selectedProductHandle}
        isOpen={selectedProductHandle !== null}
        onClose={() => setSelectedProductHandle(null)}
      />
    </>
  );
}
