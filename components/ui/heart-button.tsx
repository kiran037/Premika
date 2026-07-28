"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import useWishlist from "@/hooks/use-wishlist";
import { WishlistItem } from "@/types";

interface HeartButtonProps {
  product: WishlistItem;
  className?: string;
  size?: number;
}

export default function HeartButton({
  product,
  className = "",
  size = 20,
}: HeartButtonProps) {
  const [isMounted, setIsMounted] = useState(false);
  const wishlist = useWishlist();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isWishlisted = isMounted ? wishlist.isInWishlist(product.id) : false;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    wishlist.toggleWishlist(product);
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-sm hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer ${className}`}
    >
      <Heart
        size={size}
        className={`transition-colors duration-200 ${
          isWishlisted
            ? "fill-red-500 text-red-500"
            : "text-foreground hover:text-red-500"
        }`}
      />
    </button>
  );
}
