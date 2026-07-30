"use client";

import React, { useState } from "react";
import {
  Star,
  Ruler,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSizeChartModal from "@/hooks/use-size-chart-modal";
import useCart from "@/hooks/use-cart";
import Link from "next/link";
import { getDiscountedPrice } from "@/lib/pricing";
import { SizeOption, ProductType, ComboSelections, ComboItemConfig, HeightOption } from "@/types";
import { validateCartSelection } from "@/lib/cart/cart-utils";
import HeartButton from "@/components/ui/heart-button";

interface ProductInfoProps {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  categories: string[];
  tags: string[];
  sizes?: SizeOption[];
  heights?: HeightOption[];
  inStock: boolean;
  images: string[];
  isCombo?: boolean;
  comboItems?: ComboItemConfig[];
  gender?: string;
}

export function ProductInfo({
  id,
  title,
  price,
  rating,
  reviewCount,
  description,
  categories,
  tags,
  sizes,
  heights,
  inStock,
  images,
  isCombo,
  comboItems,
  gender,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedHeight, setSelectedHeight] = useState(
    heights?.find((h) => h.default)?.value || heights?.[0]?.value || ""
  );
  const [showSkirtSizeChart, setShowSkirtSizeChart] = useState(false);
  const [showBottomSizeChart, setShowBottomSizeChart] = useState(false);
  const sizeChartModal = useSizeChartModal();
  const cart = useCart();

  // State for combo items - separate size/height for each item
  const [comboSelections, setComboSelections] = useState<ComboSelections>(() => {
    if (!isCombo || !comboItems) return {};
    const initial: ComboSelections = {};
    comboItems.forEach((item) => {
      initial[item.id] = {
        size: "",
        height: item.heights?.find((h) => h.default)?.value || item.heights?.[0]?.value || "",
      };
    });
    return initial;
  });

  // Check if this product has skirt size chart information
  const hasSkirtSizeChart =
    description && description.includes("Size Chart For Skirt");

  const hasBottomSizeChart =
    description && description.includes("Size Chart For Bottoms");

  // Check if all combo sizes are selected
  const allComboSizesSelected = isCombo && comboItems
    ? comboItems.every((item) => comboSelections[item.id]?.size)
    : true;

  const handleComboSizeChange = (itemId: string, size: string) => {
    setComboSelections((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], size },
    }));
  };

  const handleComboHeightChange = (itemId: string, height: string) => {
    setComboSelections((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], height },
    }));
  };

  const handleAddToCart = () => {
    const validation = validateCartSelection(
      { inStock, sizes, heights, isCombo, comboItems },
      { selectedSize, selectedHeight, comboSelections }
    );

    if (!validation.isValid) {
      return;
    }

    const pricing = getDiscountedPrice({ price });
    const item = {
      id: id,
      productId: id,
      title,
      name: title,
      price: pricing.discountedPrice,
      originalPrice: pricing.originalPrice,
      isOnSale: pricing.isOnSale,
      discount: pricing.discount,
      quantity,
      selectedSize: isCombo ? undefined : selectedSize,
      selectedHeight: isCombo ? undefined : selectedHeight,
      isCombo,
      comboSelections: isCombo ? comboSelections : undefined,
      inStock,
      images,
      category: categories?.[0] || "clothing",
    };
    cart.addItem(item as any);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  return (
    <div className="space-y-6 pr-0 lg:pr-24">
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-4">{title}</h1>

        <div className="flex items-center space-x-2 mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < rating
                    ? "fill-current"
                    : "stroke-current fill-transparent"
                  }`}
              />
            ))}
          </div>
          <span className="text-sm text-[#E0BCA2]">
            ({reviewCount} customer review{reviewCount !== 1 ? "s" : ""})
          </span>
        </div>

        <div className="mb-6">
          {(() => {
            const pricing = getDiscountedPrice({ price });
            return pricing.isOnSale ? (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl font-bold text-foreground">
                    Rs. {pricing.discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-base sm:text-lg text-gray-500 line-through">
                    Rs. {pricing.originalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="bg-red-500 text-white text-sm px-3 py-1 rounded font-medium w-fit">
                    {pricing.discount}% OFF
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    Save Rs.{" "}
                    {(pricing.originalPrice - pricing.discountedPrice).toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                Rs. {price.toFixed(2)}
              </div>
            );
          })()}
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          <span
            className={`text-sm font-medium ${inStock ? "text-green-600" : "text-red-600"
              }`}
          >
            {inStock ? "✓ In Stock" : "✗ Out of Stock"}
          </span>
        </div>
      </div>

      <div className="prose prose-sm text-tertiary text-justify">
        {description.split("<br>").map((line, index) => (
          <p key={index} className={index > 0 ? "mt-2" : ""}>
            {line}
          </p>
        ))}
      </div>

      {/* Combo Size Selection - For combo products */}
      {isCombo && comboItems && comboItems.length > 0 && (
        <div className="space-y-6 border border-primary/30 rounded-lg p-4 bg-muted/10">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-secondary">
              Select Sizes for Each Item
            </h3>
            <p className="text-sm text-tertiary mt-1">
              This is a combo set - please select sizes for both items
            </p>
          </div>

          {comboItems.map((item, index) => (
            <div
              key={item.id}
              className={`space-y-4 ${index > 0 ? "border-t border-primary/20 pt-4" : ""
                }`}
            >
              <h4 className="text-sm font-semibold text-secondary flex items-center gap-2">
                <span className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                {item.name}
              </h4>

              {/* Size selection for this combo item */}
              {item.sizes && item.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-tertiary">
                    Size *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {item.sizes.map((size) => (
                      <button
                        key={size.label}
                        onClick={() =>
                          handleComboSizeChange(item.id, size.label)
                        }
                        disabled={!size.inStock}
                        className={`px-4 py-2 text-sm border rounded-md transition-colors ${comboSelections[item.id]?.size === size.label
                            ? "bg-foreground text-background border-foreground"
                            : size.inStock
                              ? "border-gray-300 hover:border-foreground"
                              : "border-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        {size.label}
                        {!size.inStock && " (Out of Stock)"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Height selection for this combo item (if applicable) */}
              {item.heights && item.heights.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-tertiary">
                      Height Range
                    </label>
                    <div className="group relative">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                      <div className="invisible group-hover:visible absolute bottom-5 left-0 bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10 shadow-lg">
                        Choose height range for the best fit
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.heights.map((height) => (
                      <button
                        key={height.value}
                        onClick={() =>
                          handleComboHeightChange(item.id, height.value)
                        }
                        className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${comboSelections[item.id]?.height === height.value
                            ? "bg-foreground text-background border-foreground"
                            : "border-gray-300 hover:border-foreground"
                          }`}
                      >
                        {height.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Size Selection - For regular products */}
      {!isCombo && sizes && sizes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Size:</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size.label}
                onClick={() => setSelectedSize(size.label)}
                disabled={!size.inStock}
                className={`px-4 py-2 text-sm border rounded-md transition-colors ${selectedSize === size.label
                    ? "bg-foreground text-background border-foreground"
                    : size.inStock
                      ? "border-gray-300 hover:border-foreground"
                      : "border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {size.label}
                {!size.inStock && " (Out of Stock)"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Height Selection - For regular products */}
      {!isCombo && heights && heights.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Height Range:</h3>
            <div className="group relative">
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <div className="invisible group-hover:visible absolute bottom-6 left-0 bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10 shadow-lg">
                Choose your height range for the best fit
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {heights.map((height) => (
              <button
                key={height.value}
                onClick={() => setSelectedHeight(height.value)}
                className={`px-4 py-2 text-sm border rounded-md transition-colors ${selectedHeight === height.value
                    ? "bg-foreground text-background border-foreground"
                    : "border-gray-300 hover:border-foreground"
                  }`}
              >
                {height.label}
              </button>
            ))}
          </div>
          <div className="bg-muted/30 border border-primary rounded-lg p-3 text-sm text-secondary">
            <h4 className="font-medium mb-1">👗 Perfect Fit Guide</h4>
            <p className="text-xs leading-relaxed">
              This feature helps us recommend the ideal length for your kurti
              based on your height. Our garments are designed with different
              proportions to ensure the perfect fit and style for every body
              type. Choose your height range for the most flattering fit.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4 ">
        <div className="flex items-center border border-foreground rounded">
          <button
            type="button"
            className="px-2 h-9 text-background bg-foreground hover:bg-secondary hover:text-background transition-colors rounded-l"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </button>
          <Input
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            className="w-12 text-center font-bold border-0 focus:ring-0"
          />
          <button
            type="button"
            className="px-2 h-9 text-background bg-foreground hover:bg-secondary hover:text-background transition-colors rounded-r"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>
        <Link href="/cart" className="block">
          {(() => {
            const regularProductReady =
              !isCombo &&
              inStock &&
              !(sizes && sizes.length > 0 && !selectedSize);
            const comboProductReady =
              isCombo && inStock && allComboSizesSelected;
            const canAddToCart = regularProductReady || comboProductReady;

            let disabledText = "OUT OF STOCK";
            if (inStock) {
              if (isCombo && !allComboSizesSelected) {
                disabledText = "SELECT ALL SIZES";
              } else if (
                !isCombo &&
                sizes &&
                sizes.length > 0 &&
                !selectedSize
              ) {
                disabledText = "SELECT SIZE";
              }
            }

            return canAddToCart ? (
              <Button
                onClick={handleAddToCart}
                className="bg-foreground hover:bg-secondary text-background px-8 py-2"
              >
                ADD TO CART
              </Button>
            ) : (
              <Button
                className="bg-foreground hover:bg-secondary text-background px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={true}
              >
                {disabledText}
              </Button>
            );
          })()}
        </Link>
        <HeartButton
          product={{
            id,
            name: title,
            price,
            images,
            category: categories?.[0] || "clothing",
            inStock,
            shortDescription: description,
            sizes,
            heights,
            isCombo,
            comboItems,
          }}
          size={22}
          className="border border-foreground/20 hover:border-red-500"
        />
      </div>

      <div className="flex items-center space-x-6 text-sm">
        <button
          className="flex items-center space-x-2 text-tertiary hover:text-secondary transition-colors"
          onClick={() => {
            const chartType: ProductType = isCombo
              ? "combo"
              : gender === "male"
                ? "male"
                : "female";
            sizeChartModal.onOpen(chartType);
          }}
        >
          <Ruler className="w-4 h-4" />
          <span>Size chart</span>
        </button>
        {hasSkirtSizeChart && (
          <button
            className="flex items-center space-x-2 text-tertiary hover:text-secondary transition-colors"
            onClick={() => setShowSkirtSizeChart(true)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01m3 0h.01M9 11h.01m3 0h.01m0-7h.01M9 7h.01M24 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Skirt Size Chart</span>
          </button>
        )}
        {hasBottomSizeChart && (
          <button
            className="flex items-center space-x-2 text-tertiary hover:text-secondary transition-colors"
            onClick={() => setShowBottomSizeChart(true)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01m3 0h.01M9 11h.01m3 0h.01m0-7h.01M9 7h.01M24 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Bottom Size Chart</span>
          </button>
        )}
      </div>

      <div className="border-t pt-6 space-y-2 border-foreground">
        <div className="text-sm">
          <span className="font-medium">Categories:</span>
          <span className="text-tertiary ml-2">{categories?.join(", ")}</span>
        </div>
        <div className="text-sm">
          <span className="font-medium">Tags:</span>
          <span className="text-tertiary ml-2">{tags?.join(", ")}</span>
        </div>
      </div>

      <div className="border-t pt-6 border-foreground">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Share this product:</span>
          <div className="flex space-x-2">
            <a
              href={`https://www.facebook.com/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="w-5 h-5 text-tertiary hover:text-blue-600 cursor-pointer transition-colors" />
            </a>
            <a
              href={`https://twitter.com/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-5 h-5 text-tertiary hover:text-blue-400 cursor-pointer transition-colors" />
            </a>
            <a
              href={`https://www.instagram.com/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-5 h-5 text-tertiary hover:text-pink-600 cursor-pointer transition-colors" />
            </a>
          </div>
        </div>
      </div>

      {/* Skirt Size Chart Modal */}
      {showSkirtSizeChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowSkirtSizeChart(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Skirt Size Chart
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Waist measurements in inches
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-900">Size S</span>
                <span className="text-gray-700">
                  Waist: 26&quot; - 29&quot;
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-900">Size M</span>
                <span className="text-gray-700">
                  Waist: 29&quot; - 32&quot;
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-900">Size L</span>
                <span className="text-gray-700">
                  Waist: 33&quot; - 36&quot;
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted-foreground/30 rounded-lg">
              <h4 className="font-medium text-secondary mb-2">
                📏 How to Measure
              </h4>
              <p className="text-sm text-secondary">
                Measure around the narrowest part of your waist, typically just
                above your hip bones. Keep the measuring tape snug but not
                tight.
              </p>
            </div>

            <button
              onClick={() => setShowSkirtSizeChart(false)}
              className="mt-4 w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Bottom Size Chart Modal */}
      {showBottomSizeChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowBottomSizeChart(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Bottom Size Chart
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Waist measurements in inches
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-900">Size S</span>
                <div className="text-right">
                  <div className="text-gray-700">
                    Waist: 26&quot; - 30&quot;
                  </div>
                  <div className="text-xs text-gray-500">Length: 40&quot;</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-900">Size M</span>
                <div className="text-right">
                  <div className="text-gray-700">
                    Waist: 30&quot; - 34&quot;
                  </div>
                  <div className="text-xs text-gray-500">Length: 40&quot;</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-900">Size L</span>
                <div className="text-right">
                  <div className="text-gray-700">
                    Waist: 35&quot; - 38&quot;
                  </div>
                  <div className="text-xs text-gray-500">Length: 40&quot;</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted-foreground/30 rounded-lg">
              <h4 className="font-medium text-secondary mb-2">
                📏 How to Measure
              </h4>
              <p className="text-sm text-secondary">
                Measure around the fullest part of your waist while standing
                naturally. Keep the measuring tape snug but comfortable.
                Compare your measurement with the chart above to find your best
                fit.
              </p>
            </div>

            <button
              onClick={() => setShowBottomSizeChart(false)}
              className="mt-4 w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
