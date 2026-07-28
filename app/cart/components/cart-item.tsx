"use client";

import Image from "next/image";
import { toast } from "react-hot-toast";
import { X, Plus, Minus } from "lucide-react";
import Link from "next/link";

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  data: CartItemType & { isOnSale?: boolean; originalPrice?: number; discount?: number };
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  const onRemove = () => {
    cart.removeItem(data.id, data.selectedSize, data.selectedHeight, data.comboSelections);
  };

  const onIncreaseQuantity = () => {
    const newQuantity = (data.quantity || 1) + 1;
    cart.updateQuantity(
      data.id,
      data.selectedSize,
      data.selectedHeight,
      newQuantity,
      data.comboSelections
    );
  };

  const onDecreaseQuantity = () => {
    const currentQuantity = data.quantity || 1;
    if (currentQuantity > 1) {
      cart.updateQuantity(
        data.id,
        data.selectedSize,
        data.selectedHeight,
        currentQuantity - 1,
        data.comboSelections
      );
    }
  };

  const imageSrc = Array.isArray(data.images) ? data.images[0] : data.images;

  return (
    <li className="bg-white rounded-lg border border-background p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-row gap-3 sm:gap-4 md:gap-5 items-stretch">
        {/* Product Image */}
        <div
          className={`relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 ${
            data.isCombo
              ? "w-32 sm:w-28 md:w-32 lg:w-36 xl:w-40 aspect-[3/4]"
              : "w-28 sm:w-24 md:w-28 lg:w-32 xl:w-36 aspect-square"
          }`}
        >
          <Link href={`/${data.id}`}>
            <Image
              fill
              src={imageSrc || "/placeholder.svg"}
              alt={data.name}
              className="object-cover object-top hover:scale-105 transition-transform duration-200 cursor-pointer"
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-3 sm:space-y-4">
          <div className="flex items-start justify-between gap-2 min-w-0">
            <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
              <Link href={`/${data.id}`} className="hover:underline">
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-foreground leading-tight line-clamp-2">
                  {data.name}
                </h3>
              </Link>

              <div className="flex flex-col space-y-2 text-xs sm:text-sm md:text-base text-primary">
                {/* Display combo selections if it's a combo product */}
                {data.isCombo && data.comboSelections && (
                  <div className="space-y-2 border-l-2 border-primary/30 pl-2">
                    {Object.entries(data.comboSelections).map(([itemId, selection]) => {
                      const itemName =
                        itemId === "sajni" || itemId === "heer"
                          ? "Women's Kurti"
                          : itemId === "sajan" || itemId === "ranjha"
                          ? "Men's Shirt"
                          : itemId;
                      return (
                        <div key={itemId} className="space-y-1">
                          <span className="font-semibold text-xs text-secondary capitalize">
                            {itemName}:
                          </span>
                          <div className="flex flex-wrap items-center gap-2 ml-2">
                            {selection.size && (
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                                Size: {selection.size}
                              </span>
                            )}
                            {selection.height && (
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                                Height:{" "}
                                {selection.height === "up-to-5-3"
                                  ? "Up to 5'3\""
                                  : selection.height === "5-4-to-5-6"
                                  ? "5'4\" - 5'6\""
                                  : selection.height === "5-6-and-above"
                                  ? "5'6\" and above"
                                  : selection.height}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Display regular size selection for non-combo products */}
                {!data.isCombo && data.selectedSize && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Size:</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs sm:text-sm font-medium">
                      {data.selectedSize}
                    </span>
                  </div>
                )}
                {!data.isCombo && data.selectedHeight && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Height:</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs sm:text-sm font-medium">
                      {data.selectedHeight === "up-to-5-3" && "Up to 5'3\""}
                      {data.selectedHeight === "5-4-to-5-6" && "5'4\" - 5'6\""}
                      {data.selectedHeight === "5-6-and-above" &&
                        "5'6\" and above"}
                    </span>
                  </div>
                )}
                {data.quantity && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Quantity:</span>
                    <div className="flex items-center gap-1 sm:gap-2 bg-orange-50 rounded-md p-1">
                      <button
                        onClick={onDecreaseQuantity}
                        disabled={data.quantity <= 1}
                        className="p-1 rounded hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus
                          size={12}
                          className="sm:w-3 sm:h-3 md:w-4 md:h-4"
                        />
                      </button>
                      <span className="px-2 py-1 min-w-[2rem] text-center text-xs sm:text-sm font-medium">
                        {data.quantity}
                      </span>
                      <button
                        onClick={onIncreaseQuantity}
                        className="p-1 rounded hover:bg-orange-100"
                      >
                        <Plus
                          size={12}
                          className="sm:w-3 sm:h-3 md:w-4 md:h-4"
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons - Mobile */}
            <div className="flex flex-col sm:hidden items-center gap-1 flex-shrink-0">
              <IconButton
                onClick={onRemove}
                icon={<X size={12} />}
                className="bg-background hover:bg-red-50 hover:text-red-600 text-foreground p-1.5 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 min-w-0">
            <div className="order-2 sm:order-1 flex-1 min-w-0">
              <div className="space-y-1 sm:space-y-2">
                <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-secondary break-words">
                  <Currency value={data.price * (data.quantity || 1)} />
                </div>
                {data.isOnSale && data.originalPrice && (
                  <div className="text-xs sm:text-sm text-gray-500 line-through break-words">
                    <Currency
                      value={data.originalPrice * (data.quantity || 1)}
                    />
                  </div>
                )}
                <div className="text-xs sm:text-sm text-gray-500 font-normal">
                  {data.isOnSale ? (
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <div className="flex items-center gap-1">
                        <Currency
                          value={data.price}
                        />
                        <span className="text-xs sm:text-sm">each</span>
                      </div>
                      <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                        {data.discount}% OFF
                      </span>
                    </div>
                  ) : (
                    <div className="break-words flex items-center gap-1">
                      <Currency
                        value={data.price}
                      />
                      <span>each</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Desktop */}
            <div className="order-1 sm:order-2 hidden sm:flex items-center justify-end gap-2 flex-shrink-0">
              <IconButton
                onClick={onRemove}
                icon={<X size={12} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />}
                className="bg-background hover:bg-red-50 hover:text-red-600 text-foreground p-2 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
