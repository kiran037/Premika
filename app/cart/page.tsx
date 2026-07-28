"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, ArrowLeft, Lightbulb } from "lucide-react";
import Link from "next/link";

import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

import CartItem from "./components/cart-item";
import Summary from "./components/summary";

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cart = useCart();

  if (!isMounted) return null;

  return (
    <div className="min-h-screen">
      <Container>
        <div className="bg-background px-3 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-16">
          {/* Header */}
          <div className="flex flex-col space-y-3 mb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:mb-6 md:mb-8">
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm md:text-base border border-secondary text-secondary hover:bg-secondary hover:text-background px-3 py-2 sm:px-4 sm:py-2"
                >
                  <ArrowLeft
                    size={14}
                    className="sm:w-4 sm:h-4 md:w-5 md:h-5"
                  />
                  <span className="hidden sm:inline">Continue Shopping</span>
                  <span className="sm:hidden">Shop</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-row items-center space-x-3 mb-4 sm:mb-6 md:mb-8">
            <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-secondary" />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-secondary">
              Shopping Cart
            </h1>
            {cart.items.length > 0 && (
              <span className="bg-secondary text-background px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium">
                {cart.items.reduce(
                  (total, item) => total + (item.quantity || 1),
                  0
                )}{" "}
                {cart.items.reduce(
                  (total, item) => total + (item.quantity || 1),
                  0
                ) === 1
                  ? "item"
                  : "items"}
              </span>
            )}
          </div>

          {cart.items.length === 0 ? (
            // Empty Cart State
            <div className="text-center py-8 sm:py-12 md:py-16 lg:py-20">
              <ShoppingBag className="mx-auto h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 text-[#E0BCA2] mb-3 sm:mb-4 md:mb-6" />
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2 sm:mb-3 md:mb-4">
                Your cart is empty
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-tertiary mb-4 sm:mb-6 md:mb-8 max-w-sm sm:max-w-md md:max-w-lg mx-auto px-4">
                Looks like you haven&apos;t added any items to your cart yet.
                Start shopping to fill it up!
              </p>
              <Link href="/">
                <Button
                  size="lg"
                  className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg text-background bg-foreground hover:bg-primary transition-colors"
                >
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            // Cart with Items
            <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-6 xl:gap-x-8 2xl:gap-x-12 lg:space-y-0">
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 mb-4 sm:mb-6">
                  <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-3 sm:mb-4 md:mb-5">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
                      Cart Items
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cart.removeAll}
                      className="text-foreground hover:text-background hover:bg-[#E0BCA2] text-xs sm:text-sm md:text-base self-end sm:self-auto px-3 py-2 sm:px-4"
                    >
                      Clear Cart
                    </Button>
                  </div>
                  <ul className="space-y-3 sm:space-y-4 md:space-y-5">
                    {cart.items.map((item) => (
                      <CartItem
                        key={`${item.id}-${item.selectedSize}-${item.selectedHeight}`}
                        data={item}
                      />
                    ))}
                  </ul>
                </div>

                {/* Additional Information */}
                <div className="bg-[#E0BCA2] border border-primary rounded-lg p-3 sm:p-4 md:p-5">
                  <h4 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base md:text-lg flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" /> Shopping
                    Tips
                  </h4>
                  <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm md:text-base text-foreground space-y-1 sm:space-y-2">
                    <li>Free shipping on all orders!</li>
                    <li>Secure checkout with multiple payment options.</li>
                    <li>
                      Not sure about your size? Check our size guide before
                      checking out.
                    </li>
                    <li>
                      Your payment and personal information are always safe with
                      us.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="lg:col-span-5 xl:col-span-4">
                <Summary />
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
