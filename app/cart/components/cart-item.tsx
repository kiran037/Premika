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
    <li className="bg-white rounded-xl border border-primary/20 p-3.5 sm:p-4 md:p-5 shadow-xs hover:shadow-md hover:border-primary/50 transition-all duration-300">
      <div className="flex flex-row gap-3.5 sm:gap-4 md:gap-5 items-stretch">
        {/* Product Image - Aspect 3/4 Portrait */}
        <div
          className={`relative rounded-lg overflow-hidden bg-popover/20 flex-shrink-0 ${
            data.isCombo
              ? "w-28 sm:w-32 md:w-36 lg:w-40 aspect-[3/4]"
              : "w-24 sm:w-28 md:w-32 lg:w-36 aspect-[3/4]"
          }`}
        >
          <Link href={`/${data.id}`}>
            <Image
              fill
              src={imageSrc || "/placeholder.svg"}
              alt={data.name}
              className="object-cover object-top hover:scale-105 transition-transform duration-500 ease-out cursor-pointer"
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-3 sm:space-y-4 flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between gap-2 min-w-0">
            <div className="flex-1 space-y-2 sm:space-y-2.5 min-w-0">
              <Link href={`/${data.id}`} className="hover:underline">
                <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors">
                  {data.name}
                </h3>
              </Link>

              <div className="flex flex-col space-y-2 text-xs sm:text-sm text-muted-foreground">
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
                              <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 rounded text-xs font-medium text-stone-800">
                                Size: {selection.size}
                              </span>
                            )}
                            {selection.height && (
                              <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 rounded text-xs font-medium text-stone-800">
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
                    <span className="font-medium text-foreground">Size:</span>
                    <span className="px-2.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-xs font-semibold text-stone-800">
                      {data.selectedSize}
                    </span>
                  </div>
                )}
                {!data.isCombo && data.selectedHeight && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">Height:</span>
                    <span className="px-2.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-xs font-semibold text-stone-800">
                      {data.selectedHeight === "up-to-5-3" && "Up to 5'3\""}
                      {data.selectedHeight === "5-4-to-5-6" && "5'4\" - 5'6\""}
                      {data.selectedHeight === "5-6-and-above" &&
                        "5'6\" and above"}
                    </span>
                  </div>
                )}

                {/* Quantity Stepper Control with 44px Touch Target */}
                {data.quantity && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-medium text-foreground">Quantity:</span>
                    <div className="flex items-center gap-1 bg-stone-100 border border-stone-200 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={onDecreaseQuantity}
                        disabled={data.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-stone-200 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-2.5 py-0.5 min-w-[2.25rem] text-center text-xs sm:text-sm font-bold text-foreground">
                        {data.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={onIncreaseQuantity}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-stone-200 text-stone-700 transition-colors"
                        title="Increase quantity"
                      >
                        <Plus size={14} />
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
                icon={<X size={14} />}
                className="bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-600 p-2 transition-colors border border-stone-200"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:items-end sm:justify-between sm:space-y-0 min-w-0 pt-1">
            <div className="order-2 sm:order-1 flex-1 min-w-0">
              <div className="space-y-1">
                <div className="text-base sm:text-lg font-bold text-foreground break-words">
                  <Currency value={data.price * (data.quantity || 1)} />
                </div>
                {data.isOnSale && data.originalPrice && (
                  <div className="text-xs sm:text-sm text-muted-foreground line-through break-words">
                    <Currency
                      value={data.originalPrice * (data.quantity || 1)}
                    />
                  </div>
                )}
                <div className="text-xs text-muted-foreground font-normal">
                  {data.isOnSale ? (
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 pt-0.5">
                      <div className="flex items-center gap-1">
                        <Currency value={data.price} />
                        <span className="text-xs">each</span>
                      </div>
                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex-shrink-0">
                        {data.discount}% OFF
                      </span>
                    </div>
                  ) : (
                    <div className="break-words flex items-center gap-1">
                      <Currency value={data.price} />
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
                icon={<X size={15} />}
                className="bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-600 p-2 transition-colors border border-stone-200"
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
