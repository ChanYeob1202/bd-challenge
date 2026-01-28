"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QuickViewModalContent } from "./QuickViewModalContent";
import { LoadingSkeleton } from "./LoadingSkeleton";

// The Quick View Modal - main modal component
// Handles: open/close, fetching product data, focus management, scroll lock

interface QuickViewModalProps  {
  productHandle: string | null;
  isOpen: boolean; 
  onClose: () => void;
};

export function QuickViewModal({
  productHandle,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // prevent scrolling on original page when moddal is opened
  useEffect(() => {
    if (isOpen) {
      setTriggerElement(document.activeElement as HTMLElement);
      // save focus on the "quick view button"
      document.body.style.overflow = "hidden";
 
      // Move focus into modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);

    } else {
      document.body.style.overflow = "";
      // Return focus to the trigger element
      if (triggerElement) {
        triggerElement.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, triggerElement]);

  // Fetch product details when modal opens
  useEffect(() => {
    if (!productHandle || !isOpen) {
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/product?handle=${productHandle}`);
        const data = await response.json();
        console.log(data)
  
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productHandle, isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - dark overlay */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0  bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Modal Content */}
                <div className="overflow-y-auto max-h-[90vh]">
                  {isLoading || !product ? (
                    <LoadingSkeleton />
                  ) : (
                    <QuickViewModalContent product={product} onClose={onClose} />
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
